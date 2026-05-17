import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  type FfmpegExportAudioModeId,
  type FfmpegExportAudioNormalizeId,
  type FfmpegExportContainerId,
  type FfmpegExportCropPresetId,
  type FfmpegExportEncodePresetId,
  type FfmpegExportScalePresetId,
  type FfmpegExportSubtitleModeId,
  type FfmpegExportUserPreset,
  type FfmpegExportVideoCodecId,
  type FfmpegExportVideoDebandId,
  type FfmpegExportVideoDeinterlaceId,
  type FfmpegExportVideoHisteqId,
  type FfmpegExportVideoDenoiseId,
  type FfmpegExportVideoEqPresetId,
  type FfmpegExportVideoGrainId,
  type FfmpegExportVideoHueId,
  type FfmpegExportVideoBlurId,
  type FfmpegExportVideoLut3dId,
  type FfmpegExportVideoVignetteId,
  type FfmpegExportVideoSharpenId,
  type FfmpegExportVideoTransformId
} from '../../shared/ffmpeg-export-contract'
import { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  type EditorUrlPasteBehaviorId
} from '../../shared/editor-url-paste-behavior'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../shared/ffmpeg-export-batch-output-suffix'
import { resolveFfmpegExportHwaccelForDecode } from '../../shared/ffmpeg-export-hw-decode'
import { type FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import {
  isFfmpegHwExportVideoCodec,
  probeSnapshotOrEmpty,
  resolveFfmpegExportVideoCodecForArgv
} from '../../shared/ffmpeg-export-video-codec'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { AppSettings } from '../../shared/settings-contract'
import { buildEditorExportSelectOptions } from './editor-export-select-options'
import {
  buildEditorExportUserPresetSnapshot,
  buildEditorFfmpegExportOverrides
} from './editor-export-settings-snapshot-build'
import type { ExportPresetNameDialogState } from './editor-export-settings-types'
import { hydrateEditorExportFieldsFromSettings } from './editor-export-settings-hydrate'
import { getUiLocale, uiTextVars } from './locales/ui-text'

type ExportPresetNameDialog = ExportPresetNameDialogState

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat export-settings state bundle
export function useEditorExportSettingsState() {
  const [exportEncodePreset, setExportEncodePreset] =
    useState<FfmpegExportEncodePresetId>('balance')
  const [exportVideoCodec, setExportVideoCodec] = useState<FfmpegExportVideoCodecId>('libx264')
  const [hwEncoderProbe, setHwEncoderProbe] = useState<FfmpegHwEncodersProbeResult | null>(null)
  const [exportContainer, setExportContainer] = useState<FfmpegExportContainerId>('mp4')
  const [exportCrf, setExportCrf] = useState<number | null>(null)
  const [exportVideoBitrate, setExportVideoBitrate] = useState<string | null>(null)
  const [exportAudioMode, setExportAudioMode] = useState<FfmpegExportAudioModeId>('aac')
  const [exportAudioBitrate, setExportAudioBitrate] = useState('192k')
  const [exportFps, setExportFps] = useState<number | null>(null)
  const [exportVideoTransform, setExportVideoTransform] =
    useState<FfmpegExportVideoTransformId>('none')
  const [exportCropPreset, setExportCropPreset] = useState<FfmpegExportCropPresetId>('none')

  const [exportScalePreset, setExportScalePreset] = useState<FfmpegExportScalePresetId>('source')
  /** §7.2 / v0 — двухпроходный libx264 только вместе с выбранным видеобитрейтом. */
  const [exportTwoPass, setExportTwoPass] = useState(false)
  const [exportEconomyMode, setExportEconomyMode] = useState(false)
  const [exportHwDecode, setExportHwDecode] = useState(false)
  const [exportExtraArgsLine, setExportExtraArgsLine] = useState('')
  const [editorUrlPasteBehavior, setEditorUrlPasteBehavior] = useState<EditorUrlPasteBehaviorId>(
    DEFAULT_EDITOR_URL_PASTE_BEHAVIOR
  )
  const [batchOutputSuffix, setBatchOutputSuffix] = useState(
    DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  )
  const [batchOutputDirectory, setBatchOutputDirectory] = useState('')
  /** §7.2 — сдвиг громкости в дБ (`-filter:a volume`); `0` означает «без фильтра». */
  const [exportAudioGainDb, setExportAudioGainDb] = useState<number>(0)
  /** §7.2 — добавить `-map_metadata -1` (очистить контейнерные tag-ы). */
  const [exportStripMetadata, setExportStripMetadata] = useState(false)
  /** §7.2 — добавить `-map_chapters -1` (очистить главы). */
  const [exportStripChapters, setExportStripChapters] = useState(false)
  /** §7.2 — режим субтитров: `drop` (по умолчанию) или `copy` (`-c:s copy`/`mov_text`). */
  const [exportSubtitleMode, setExportSubtitleMode] = useState<FfmpegExportSubtitleModeId>('drop')
  /** §7.2 — `yadif` после crop и до hqdn3d. */
  const [exportVideoDeinterlace, setExportVideoDeinterlace] =
    useState<FfmpegExportVideoDeinterlaceId>('off')
  /** §7.2 — пресет `hqdn3d` denoise. */
  const [exportVideoDenoise, setExportVideoDenoise] = useState<FfmpegExportVideoDenoiseId>('off')
  /** §7.2 — пресет `deband` (полосы/ступени). */
  const [exportVideoDeband, setExportVideoDeband] = useState<FfmpegExportVideoDebandId>('off')
  /** §7.2 — `histeq` после deband и до lut3d. */
  const [exportVideoHisteq, setExportVideoHisteq] = useState<FfmpegExportVideoHisteqId>('off')
  /** §7.2 — bundled `lut3d` (между deband и unsharp). */
  const [exportVideoLut3d, setExportVideoLut3d] = useState<FfmpegExportVideoLut3dId>('off')
  /** Абсолютный путь к `.cube` для превью argv (main `resolveFfmpegExportLutCubeAbsPath`). */
  const [lutCubePathForPreview, setLutCubePathForPreview] = useState<string | null>(null)
  /** §7.2 — пресет `unsharp` контурной резкости. */
  const [exportVideoSharpen, setExportVideoSharpen] = useState<FfmpegExportVideoSharpenId>('off')
  /** §7.2 — пресет `eq=` цветокоррекции. */
  const [exportVideoEqPreset, setExportVideoEqPreset] = useState<FfmpegExportVideoEqPresetId>('off')
  /** §7.2 — пресет `hue` сразу после `eq`, до зерна. */
  const [exportVideoHue, setExportVideoHue] = useState<FfmpegExportVideoHueId>('off')
  /** §7.2 — пресет `noise` (зернистость после eq, до scale). */
  const [exportVideoGrain, setExportVideoGrain] = useState<FfmpegExportVideoGrainId>('off')
  const [exportVideoVignette, setExportVideoVignette] = useState<FfmpegExportVideoVignetteId>('off')
  const [exportVideoBlur, setExportVideoBlur] = useState<FfmpegExportVideoBlurId>('off')
  /** §7.2 — нормализация громкости через whitelist фильтров. */
  const [exportAudioNormalize, setExportAudioNormalize] =
    useState<FfmpegExportAudioNormalizeId>('off')
  /** §7.2 — сохранённые пользователем наборы параметров тулбара (preview/spawn используют те же поля). */
  const [exportUserPresets, setExportUserPresets] = useState<FfmpegExportUserPreset[]>([])
  /** Выбранный в `<select>` пользовательский пресет; ручные правки тулбара сбрасывают выбор. */
  const [selectedUserPresetId, setSelectedUserPresetId] = useState<string | null>(null)
  const selectedExportUserPreset = useMemo(
    () =>
      selectedUserPresetId
        ? exportUserPresets.find((p) => p.id === selectedUserPresetId)
        : undefined,
    [exportUserPresets, selectedUserPresetId]
  )
  const [exportPresetNameDialog, setExportPresetNameDialog] = useState<ExportPresetNameDialog>(null)
  const [exportPresetSaving, setExportPresetSaving] = useState(false)
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)
  const [snapshotFormat, setSnapshotFormat] = useState<FfmpegSnapshotFormatId>('png')
  const [snapshotBusy, setSnapshotBusy] = useState(false)

  const ffmpegExportSelectOptions = useMemo(
    () => buildEditorExportSelectOptions(hwEncoderProbe, exportVideoCodec),
    [hwEncoderProbe, exportVideoCodec]
  )
  const exportVideoCodecResolvedForPreview = useMemo(
    () =>
      resolveFfmpegExportVideoCodecForArgv(exportVideoCodec, probeSnapshotOrEmpty(hwEncoderProbe)),
    [exportVideoCodec, hwEncoderProbe]
  )
  const exportExtraArgsParsed = useMemo(
    () => parseFfmpegExportExtraArgsLine(exportExtraArgsLine, getUiLocale()),
    [exportExtraArgsLine]
  )
  const exportHwaccelDecodeForPreview = useMemo(() => {
    if (!exportHwDecode) {
      return null
    }
    const hwaccels = hwEncoderProbe?.ok === true ? hwEncoderProbe.hwaccels : []
    return resolveFfmpegExportHwaccelForDecode(exportVideoCodecResolvedForPreview, hwaccels)
  }, [exportHwDecode, hwEncoderProbe, exportVideoCodecResolvedForPreview])
  const exportCodecStatusbarLabel = useMemo(() => {
    let label = uiTextVars('editorStatusbarCodec', { codec: exportVideoCodecResolvedForPreview })
    if (exportHwaccelDecodeForPreview) {
      label += uiTextVars('editorStatusbarHwDecode', { method: exportHwaccelDecodeForPreview })
    }
    return label
  }, [exportVideoCodecResolvedForPreview, exportHwaccelDecodeForPreview])

  const refetchHwEncoders = useCallback((): Promise<void> => {
    return window.fluxalloy.engines.probeHwEncoders().then((r) => {
      setHwEncoderProbe(r)
      setExportVideoCodec((codec) => {
        if (codec === 'hw_auto' || codec === 'hw_auto_hevc') {
          return codec
        }
        if (!isFfmpegHwExportVideoCodec(codec)) {
          return codec
        }
        if (r.ok === true && r.snapshot[codec]) {
          return codec
        }
        void window.fluxalloy.settings.setFfmpegExportVideoCodec('libx264').catch(console.error)
        return 'libx264'
      })
    })
  }, [])

  useEffect(() => {
    void refetchHwEncoders()
  }, [refetchHwEncoders])

  const hydrateExportFieldsFromSettings = useCallback((loaded: AppSettings) => {
    hydrateEditorExportFieldsFromSettings(loaded, {
      setExportEncodePreset,
      setExportCrf,
      setExportVideoBitrate,
      setExportVideoCodec,
      setExportContainer,
      setExportAudioMode,
      setExportTwoPass,
      setExportEconomyMode,
      setExportHwDecode,
      setExportExtraArgsLine,
      setEditorUrlPasteBehavior,
      setBatchOutputSuffix,
      setBatchOutputDirectory,
      setExportAudioBitrate,
      setExportFps,
      setExportVideoTransform,
      setExportCropPreset,
      setExportScalePreset,
      setExportAudioGainDb,
      setExportStripMetadata,
      setExportStripChapters,
      setExportSubtitleMode,
      setExportVideoDeinterlace,
      setExportVideoDenoise,
      setExportVideoDeband,
      setExportVideoHisteq,
      setExportVideoSharpen,
      setExportVideoEqPreset,
      setExportVideoHue,
      setExportVideoGrain,
      setExportVideoVignette,
      setExportVideoBlur,
      setExportAudioNormalize,
      setExportVideoLut3d
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.export.resolveBundledLutCubePath(exportVideoLut3d).then((p) => {
      if (!cancelled) {
        setLutCubePathForPreview(p)
      }
    })
    return () => {
      cancelled = true
    }
  }, [exportVideoLut3d])

  const bumpManualExportEdit = useCallback(() => {
    setSelectedUserPresetId(null)
  }, [])

  const exportSnapshotFields = useMemo(
    () => ({
      exportEncodePreset,
      exportVideoCodec,
      exportContainer,
      exportCrf,
      exportVideoBitrate,
      exportAudioMode,
      exportAudioBitrate,
      exportFps,
      exportScalePreset,
      exportVideoTransform,
      exportCropPreset,
      exportTwoPass,
      exportEconomyMode,
      exportHwDecode,
      exportExtraArgsLine,
      exportAudioGainDb,
      exportStripMetadata,
      exportStripChapters,
      exportSubtitleMode,
      exportVideoDeinterlace,
      exportVideoDenoise,
      exportVideoDeband,
      exportVideoHisteq,
      exportVideoLut3d,
      exportVideoSharpen,
      exportVideoEqPreset,
      exportVideoHue,
      exportVideoGrain,
      exportVideoVignette,
      exportVideoBlur,
      exportAudioNormalize
    }),
    [
      exportEncodePreset,
      exportVideoCodec,
      exportContainer,
      exportCrf,
      exportVideoBitrate,
      exportAudioMode,
      exportAudioBitrate,
      exportFps,
      exportScalePreset,
      exportVideoTransform,
      exportCropPreset,
      exportTwoPass,
      exportEconomyMode,
      exportHwDecode,
      exportExtraArgsLine,
      exportAudioGainDb,
      exportStripMetadata,
      exportStripChapters,
      exportSubtitleMode,
      exportVideoDeinterlace,
      exportVideoDenoise,
      exportVideoDeband,
      exportVideoHisteq,
      exportVideoLut3d,
      exportVideoSharpen,
      exportVideoEqPreset,
      exportVideoHue,
      exportVideoGrain,
      exportVideoVignette,
      exportVideoBlur,
      exportAudioNormalize
    ]
  )

  const buildCurrentExportSnapshot = useCallback(
    () => buildEditorExportUserPresetSnapshot(exportSnapshotFields),
    [exportSnapshotFields]
  )

  const buildCurrentFfmpegExportOverrides = useCallback(
    () => buildEditorFfmpegExportOverrides(exportSnapshotFields),
    [exportSnapshotFields]
  )

  return {
    exportEncodePreset,
    setExportEncodePreset,
    exportVideoCodec,
    setExportVideoCodec,
    hwEncoderProbe,
    exportContainer,
    setExportContainer,
    exportCrf,
    setExportCrf,
    exportVideoBitrate,
    setExportVideoBitrate,
    exportAudioMode,
    setExportAudioMode,
    exportAudioBitrate,
    setExportAudioBitrate,
    exportFps,
    setExportFps,
    exportVideoTransform,
    setExportVideoTransform,
    exportCropPreset,
    setExportCropPreset,
    exportScalePreset,
    setExportScalePreset,
    exportTwoPass,
    setExportTwoPass,
    exportEconomyMode,
    setExportEconomyMode,
    exportHwDecode,
    setExportHwDecode,
    exportExtraArgsLine,
    setExportExtraArgsLine,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    batchOutputSuffix,
    setBatchOutputSuffix,
    batchOutputDirectory,
    setBatchOutputDirectory,
    exportAudioGainDb,
    setExportAudioGainDb,
    exportStripMetadata,
    setExportStripMetadata,
    exportStripChapters,
    setExportStripChapters,
    exportSubtitleMode,
    setExportSubtitleMode,
    exportVideoDeinterlace,
    setExportVideoDeinterlace,
    exportVideoDenoise,
    setExportVideoDenoise,
    exportVideoDeband,
    setExportVideoDeband,
    exportVideoHisteq,
    setExportVideoHisteq,
    exportVideoLut3d,
    setExportVideoLut3d,
    lutCubePathForPreview,
    exportVideoSharpen,
    setExportVideoSharpen,
    exportVideoEqPreset,
    setExportVideoEqPreset,
    exportVideoHue,
    setExportVideoHue,
    exportVideoGrain,
    setExportVideoGrain,
    exportVideoVignette,
    setExportVideoVignette,
    exportVideoBlur,
    setExportVideoBlur,
    exportAudioNormalize,
    setExportAudioNormalize,
    exportUserPresets,
    setExportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    selectedExportUserPreset,
    exportPresetNameDialog,
    setExportPresetNameDialog,
    exportPresetSaving,
    setExportPresetSaving,
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath,
    snapshotFormat,
    setSnapshotFormat,
    snapshotBusy,
    setSnapshotBusy,
    ffmpegExportSelectOptions,
    exportVideoCodecResolvedForPreview,
    exportExtraArgsParsed,
    exportHwaccelDecodeForPreview,
    exportCodecStatusbarLabel,
    refetchHwEncoders,
    hydrateExportFieldsFromSettings,
    bumpManualExportEdit,
    buildCurrentExportSnapshot,
    buildCurrentFfmpegExportOverrides
  }
}
