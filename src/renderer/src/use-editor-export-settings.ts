import { useCallback, useEffect, useMemo, useState } from 'react'

import { isBuiltinExportUserPresetId } from '../../shared/builtin-ffmpeg-export-user-presets'
import {
  FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX,
  FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES,
  type FfmpegExportAudioModeId,
  type FfmpegExportAudioNormalizeId,
  type FfmpegExportContainerId,
  type FfmpegExportCropPresetId,
  type FfmpegExportEncodePresetId,
  type FfmpegExportScalePresetId,
  type FfmpegExportSubtitleModeId,
  type FfmpegExportUserPreset,
  type FfmpegExportUserPresetSnapshot,
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
import {
  buildEditorExportSelectOptions,
  type FfmpegExportSelectOptions
} from './editor-export-select-options'
import { hydrateEditorExportFieldsFromSettings } from './editor-export-settings-hydrate'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

export type ExportPresetNameDialogState = {
  mode: 'create' | 'rename'
  value: string
  error: string | null
} | null

type ExportPresetNameDialog = ExportPresetNameDialogState

export type UseEditorExportSettingsDeps = {
  setStatusHint: (hint: string | null) => void
}

// Return shape is consumed via destructuring in App.tsx (large flat API).
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat export-settings surface
export function useEditorExportSettings(deps: UseEditorExportSettingsDeps) {
  const { setStatusHint } = deps

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

  const buildCurrentExportSnapshot = useCallback((): FfmpegExportUserPresetSnapshot => {
    return {
      encodePreset: exportEncodePreset,
      ...(exportVideoCodec !== 'libx264' ? { videoCodec: exportVideoCodec } : {}),
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      ...(exportTwoPass && exportVideoCodec === 'libx264' ? { twoPass: true as const } : {}),
      ...(exportEconomyMode ? { economyMode: true as const } : {}),
      ...(exportHwDecode ? { hwDecode: true as const } : {}),
      ...(exportExtraArgsLine.trim().length > 0
        ? { extraArgsLine: exportExtraArgsLine.trim() }
        : {}),
      ...(exportAudioGainDb !== 0 ? { audioGainDb: exportAudioGainDb } : {}),
      ...(exportStripMetadata ? { stripMetadata: true } : {}),
      ...(exportStripChapters ? { stripChapters: true } : {}),
      ...(exportSubtitleMode === 'copy' ? { subtitleMode: 'copy' as const } : {}),
      ...(exportVideoDeinterlace !== 'off' ? { videoDeinterlace: exportVideoDeinterlace } : {}),
      ...(exportVideoDenoise !== 'off' ? { videoDenoise: exportVideoDenoise } : {}),
      ...(exportVideoDeband !== 'off' ? { videoDeband: exportVideoDeband } : {}),
      ...(exportVideoHisteq !== 'off' ? { videoHisteq: exportVideoHisteq } : {}),
      ...(exportVideoLut3d !== 'off' ? { videoLut3d: exportVideoLut3d } : {}),
      ...(exportVideoSharpen !== 'off' ? { videoSharpen: exportVideoSharpen } : {}),
      ...(exportVideoEqPreset !== 'off' ? { videoEqPreset: exportVideoEqPreset } : {}),
      ...(exportVideoHue !== 'off' ? { videoHue: exportVideoHue } : {}),
      ...(exportVideoGrain !== 'off' ? { videoGrain: exportVideoGrain } : {}),
      ...(exportVideoVignette !== 'off' ? { videoVignette: exportVideoVignette } : {}),
      ...(exportVideoBlur !== 'off' ? { videoBlur: exportVideoBlur } : {}),
      ...(exportAudioNormalize !== 'off' ? { audioNormalize: exportAudioNormalize } : {})
    }
  }, [
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
  ])

  const handleSaveExportUserPreset = useCallback(() => {
    if (exportUserPresets.length >= FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES) {
      setStatusHint(uiText('editorExportUserPresetsMaxTotalStatus'))
      return
    }
    const userAdded = exportUserPresets.filter((p) => !isBuiltinExportUserPresetId(p.id)).length
    if (userAdded >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
      setStatusHint(uiText('editorExportUserPresetsMaxStatus'))
      return
    }
    setExportPresetNameDialog({
      mode: 'create',
      value: uiText('editorExportPresetDefaultName'),
      error: null
    })
  }, [exportUserPresets])

  const handleDeleteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
      return
    }
    const next = exportUserPresets.filter((p) => p.id !== selectedUserPresetId)
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setSelectedUserPresetId(null)
      })
      .catch(console.error)
  }, [exportUserPresets, selectedUserPresetId])

  const handleRenameExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
      return
    }
    const current = exportUserPresets.find((p) => p.id === selectedUserPresetId)
    if (!current) {
      return
    }
    setExportPresetNameDialog({ mode: 'rename', value: current.label, error: null })
  }, [exportUserPresets, selectedUserPresetId])

  const handleSubmitExportPresetName = useCallback(async () => {
    if (!exportPresetNameDialog) {
      return
    }
    const label = exportPresetNameDialog.value.trim()
    if (label.length === 0) {
      setExportPresetNameDialog((prev) =>
        prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorEmpty') }
      )
      return
    }
    const safeLabel = label.slice(0, 64)
    if (exportPresetNameDialog.mode === 'create') {
      if (exportUserPresets.length >= FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorMaxTotal') }
        )
        return
      }
      const userAdded = exportUserPresets.filter((p) => !isBuiltinExportUserPresetId(p.id)).length
      if (userAdded >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorMax') }
        )
        return
      }
      const id = crypto.randomUUID()
      const next = [
        ...exportUserPresets,
        { id, label: safeLabel, snapshot: buildCurrentExportSnapshot() }
      ]
      setExportPresetSaving(true)
      try {
        const s = await window.fluxalloy.settings.setFfmpegExportUserPresets(next)
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setSelectedUserPresetId(id)
        setExportPresetNameDialog(null)
      } catch (error) {
        console.error(error)
      } finally {
        setExportPresetSaving(false)
      }
      return
    }

    if (!selectedUserPresetId) {
      setExportPresetNameDialog(null)
      return
    }
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, label: safeLabel } : p
    )
    setExportPresetSaving(true)
    try {
      const s = await window.fluxalloy.settings.setFfmpegExportUserPresets(next)
      setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      setExportPresetNameDialog(null)
    } catch (error) {
      console.error(error)
    } finally {
      setExportPresetSaving(false)
    }
  }, [buildCurrentExportSnapshot, exportPresetNameDialog, exportUserPresets, selectedUserPresetId])

  const handleOverwriteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
      return
    }
    const snap = buildCurrentExportSnapshot()
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, snapshot: snap } : p
    )
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      })
      .catch(console.error)
  }, [buildCurrentExportSnapshot, exportUserPresets, selectedUserPresetId])

  const buildCurrentFfmpegExportOverrides = useCallback(
    () => ({
      encodePreset: exportEncodePreset,
      videoCodec: exportVideoCodec,
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      twoPass: exportTwoPass && exportVideoBitrate !== null && exportVideoCodec === 'libx264',
      economyMode: exportEconomyMode,
      hwDecode: exportHwDecode,
      extraArgsLine: exportExtraArgsLine,
      audioGainDb: exportAudioGainDb === 0 ? null : exportAudioGainDb,
      stripMetadata: exportStripMetadata,
      stripChapters: exportStripChapters,
      subtitleMode: exportSubtitleMode,
      videoDeinterlace: exportVideoDeinterlace,
      videoDenoise: exportVideoDenoise,
      videoDeband: exportVideoDeband,
      videoHisteq: exportVideoHisteq,
      videoLut3d: exportVideoLut3d,
      videoSharpen: exportVideoSharpen,
      videoEqPreset: exportVideoEqPreset,
      videoHue: exportVideoHue,
      videoGrain: exportVideoGrain,
      videoVignette: exportVideoVignette,
      videoBlur: exportVideoBlur,
      audioNormalize: exportAudioNormalize
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
    buildCurrentFfmpegExportOverrides,
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleSubmitExportPresetName,
    handleOverwriteExportUserPreset
  }
}

export type { FfmpegExportSelectOptions }
