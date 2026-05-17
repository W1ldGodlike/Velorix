import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

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
  parseEditorUrlPasteBehavior,
  type EditorUrlPasteBehaviorId
} from '../../shared/editor-url-paste-behavior'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../shared/ffmpeg-export-batch-output-suffix'
import { resolveFfmpegExportHwaccelForDecode } from '../../shared/ffmpeg-export-hw-decode'
import { FFMPEG_HW_VIDEO_ENCODER_IDS, type FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import { ffmpegExportAudioModeRequiresMkv } from '../../shared/ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwExportVideoCodec,
  parseFfmpegExportVideoCodec,
  probeSnapshotOrEmpty,
  resolveFfmpegExportVideoCodecForArgv
} from '../../shared/ffmpeg-export-video-codec'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { AppSettings } from '../../shared/settings-contract'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

const EXPORT_VIDEO_BITRATES = ['1000k', '2500k', '5000k', '8000k', '12000k', '20000k']
const EXPORT_AUDIO_BITRATES = ['96k', '128k', '160k', '192k', '256k', '320k']
const EXPORT_FPS_OPTIONS = [24, 25, 30, 50, 60]

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
    () => ({
      encodePresets: [
        { id: 'balance', label: uiText('editorExportEncodeBalance') },
        { id: 'smaller', label: uiText('editorExportEncodeSmaller') },
        { id: 'quality', label: uiText('editorExportEncodeQuality') }
      ] as Array<{ id: FfmpegExportEncodePresetId; label: string }>,
      videoCodecs: (() => {
        const v: Array<{ id: FfmpegExportVideoCodecId; label: string }> = [
          { id: 'libx264', label: uiText('editorExportCodecH264') },
          { id: 'libx265', label: uiText('editorExportCodecH265') },
          { id: 'libvpx-vp9', label: uiText('editorExportCodecVp9') },
          { id: 'libsvtav1', label: uiText('editorExportCodecSvtav1') },
          { id: 'libaom-av1', label: uiText('editorExportCodecAomav1') },
          { id: 'librav1e', label: uiText('editorExportCodecLibrav1e') },
          { id: 'prores_ks', label: uiText('editorExportCodecProresKs') },
          { id: 'dnxhd', label: uiText('editorExportCodecDnxhd') },
          { id: 'ffv1', label: uiText('editorExportCodecFfv1') },
          { id: 'hw_auto', label: uiText('editorExportCodecHwAuto') },
          { id: 'hw_auto_hevc', label: uiText('editorExportCodecHwAutoHevc') }
        ]
        if (hwEncoderProbe?.ok === true) {
          for (const id of FFMPEG_HW_VIDEO_ENCODER_IDS) {
            if (hwEncoderProbe.snapshot[id]) {
              v.push({ id, label: id })
            }
          }
        } else if (isFfmpegHwExportVideoCodec(exportVideoCodec)) {
          v.push({ id: exportVideoCodec, label: `${exportVideoCodec} (?)` })
        }
        return v
      })(),
      containers: [
        { id: 'mp4', label: uiText('editorExportContainerMp4') },
        { id: 'mkv', label: uiText('editorExportContainerMkv') },
        { id: 'mov', label: uiText('editorExportContainerMov') }
      ] as Array<{ id: FfmpegExportContainerId; label: string }>,
      scalePresets: [
        { id: 'source', label: uiText('editorExportScaleSource') },
        { id: '480p', label: uiText('editorExportScale480p') },
        { id: '720p', label: uiText('editorExportScale720p') },
        { id: '1080p', label: uiText('editorExportScale1080p') }
      ] as Array<{ id: FfmpegExportScalePresetId; label: string }>,
      videoTransforms: [
        { id: 'none', label: uiText('editorExportTransformNone') },
        { id: 'cw90', label: uiText('editorExportTransformCw90') },
        { id: 'ccw90', label: uiText('editorExportTransformCcw90') },
        { id: 'r180', label: uiText('editorExportTransformR180') },
        { id: 'hflip', label: uiText('editorExportTransformHflip') },
        { id: 'vflip', label: uiText('editorExportTransformVflip') }
      ] as Array<{ id: FfmpegExportVideoTransformId; label: string }>,
      cropPresets: [
        { id: 'none', label: uiText('editorExportCropNone') },
        { id: 'center-square', label: uiText('editorExportCropCenterSquare') },
        { id: 'center-16-9', label: uiText('editorExportCropCenter169') },
        { id: 'center-4-3', label: uiText('editorExportCropCenter43') }
      ] as Array<{ id: FfmpegExportCropPresetId; label: string }>,
      audioGainOptions: [
        { value: -12, label: uiText('editorExportAudioGainM12') },
        { value: -9, label: uiText('editorExportAudioGainM9') },
        { value: -6, label: uiText('editorExportAudioGainM6') },
        { value: -3, label: uiText('editorExportAudioGainM3') },
        { value: 0, label: uiText('editorExportAudioGain0') },
        { value: 3, label: uiText('editorExportAudioGainP3') },
        { value: 6, label: uiText('editorExportAudioGainP6') },
        { value: 9, label: uiText('editorExportAudioGainP9') },
        { value: 12, label: uiText('editorExportAudioGainP12') }
      ],
      subtitleModes: [
        { id: 'drop', label: uiText('editorExportSubtitleDrop') },
        { id: 'copy', label: uiText('editorExportSubtitleCopy') }
      ] as Array<{ id: FfmpegExportSubtitleModeId; label: string }>,
      videoDeinterlace: [
        { id: 'off', label: uiText('editorExportDeinterlaceOff') },
        { id: 'frame', label: uiText('editorExportDeinterlaceFrame') },
        { id: 'field', label: uiText('editorExportDeinterlaceField') }
      ] as Array<{ id: FfmpegExportVideoDeinterlaceId; label: string }>,
      videoDenoise: [
        { id: 'off', label: uiText('editorExportDenoiseOff') },
        { id: 'light', label: uiText('editorExportDenoiseLight') },
        { id: 'medium', label: uiText('editorExportDenoiseMedium') },
        { id: 'strong', label: uiText('editorExportDenoiseStrong') }
      ] as Array<{ id: FfmpegExportVideoDenoiseId; label: string }>,
      videoSharpen: [
        { id: 'off', label: uiText('editorExportSharpenOff') },
        { id: 'light', label: uiText('editorExportSharpenLight') },
        { id: 'medium', label: uiText('editorExportSharpenMedium') },
        { id: 'strong', label: uiText('editorExportSharpenStrong') }
      ] as Array<{ id: FfmpegExportVideoSharpenId; label: string }>,
      videoDeband: [
        { id: 'off', label: uiText('editorExportDebandOff') },
        { id: 'light', label: uiText('editorExportDebandLight') },
        { id: 'medium', label: uiText('editorExportDebandMedium') },
        { id: 'strong', label: uiText('editorExportDebandStrong') }
      ] as Array<{ id: FfmpegExportVideoDebandId; label: string }>,
      videoHisteq: [
        { id: 'off', label: uiText('editorExportHisteqOff') },
        { id: 'light', label: uiText('editorExportHisteqLight') },
        { id: 'medium', label: uiText('editorExportHisteqMedium') },
        { id: 'strong', label: uiText('editorExportHisteqStrong') }
      ] as Array<{ id: FfmpegExportVideoHisteqId; label: string }>,
      videoLut3d: [
        { id: 'off', label: uiText('editorExportLut3dOff') },
        { id: 'film-warm', label: uiText('editorExportLut3dFilmWarm') },
        { id: 'film-cool', label: uiText('editorExportLut3dFilmCool') },
        { id: 'punch', label: uiText('editorExportLut3dPunch') }
      ] as Array<{ id: FfmpegExportVideoLut3dId; label: string }>,
      videoEq: [
        { id: 'off', label: uiText('editorExportEqOff') },
        { id: 'warm', label: uiText('editorExportEqWarm') },
        { id: 'cool', label: uiText('editorExportEqCool') },
        { id: 'vivid', label: uiText('editorExportEqVivid') },
        { id: 'flat', label: uiText('editorExportEqFlat') }
      ] as Array<{ id: FfmpegExportVideoEqPresetId; label: string }>,
      videoHue: [
        { id: 'off', label: uiText('editorExportHueOff') },
        { id: 'warmShift', label: uiText('editorExportHueWarmShift') },
        { id: 'coolShift', label: uiText('editorExportHueCoolShift') },
        { id: 'satBoost', label: uiText('editorExportHueSatBoost') }
      ] as Array<{ id: FfmpegExportVideoHueId; label: string }>,
      videoGrain: [
        { id: 'off', label: uiText('editorExportGrainOff') },
        { id: 'light', label: uiText('editorExportGrainLight') },
        { id: 'medium', label: uiText('editorExportGrainMedium') },
        { id: 'strong', label: uiText('editorExportGrainStrong') }
      ] as Array<{ id: FfmpegExportVideoGrainId; label: string }>,
      videoVignette: [
        { id: 'off', label: uiText('editorExportVignetteOff') },
        { id: 'light', label: uiText('editorExportVignetteLight') },
        { id: 'medium', label: uiText('editorExportVignetteMedium') },
        { id: 'strong', label: uiText('editorExportVignetteStrong') }
      ] as Array<{ id: FfmpegExportVideoVignetteId; label: string }>,
      videoBlur: [
        { id: 'off', label: uiText('editorExportBlurOff') },
        { id: 'light', label: uiText('editorExportBlurLight') },
        { id: 'medium', label: uiText('editorExportBlurMedium') },
        { id: 'strong', label: uiText('editorExportBlurStrong') }
      ] as Array<{ id: FfmpegExportVideoBlurId; label: string }>,
      audioNormalize: [
        { id: 'off', label: uiText('editorExportAudioNormOff') },
        { id: 'loudnorm', label: uiText('editorExportAudioNormLoudnorm') },
        { id: 'dynaudnorm', label: uiText('editorExportAudioNormDynaudnorm') }
      ] as Array<{ id: FfmpegExportAudioNormalizeId; label: string }>,
      audioModes: [
        { id: 'aac', label: uiText('editorExportAudioModeAac') },
        { id: 'libmp3lame', label: uiText('editorExportAudioModeLibmp3lame') },
        { id: 'ac3', label: uiText('editorExportAudioModeAc3') },
        { id: 'copy', label: uiText('editorExportAudioModeCopy') },
        { id: 'pcm_s16le', label: uiText('editorExportAudioModePcmS16le') },
        { id: 'libvorbis', label: uiText('editorExportAudioModeLibvorbis') },
        { id: 'libopus', label: uiText('editorExportAudioModeLibopus') },
        { id: 'flac', label: uiText('editorExportAudioModeFlac') },
        { id: 'alac', label: uiText('editorExportAudioModeAlac') },
        { id: 'none', label: uiText('editorExportAudioModeNone') }
      ] as Array<{ id: FfmpegExportAudioModeId; label: string }>,
      snapshotFormats: [
        { id: 'png', label: uiText('editorExportSnapshotPng') },
        { id: 'jpg', label: uiText('editorExportSnapshotJpg') }
      ] as Array<{ id: FfmpegSnapshotFormatId; label: string }>
    }),
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
    const ep = loaded.ffmpegExportEncodePreset
    if (ep === 'balance' || ep === 'smaller' || ep === 'quality') {
      setExportEncodePreset(ep)
    }
    const ec = loaded.ffmpegExportContainer
    if (
      typeof loaded.ffmpegExportCrf === 'number' &&
      Number.isInteger(loaded.ffmpegExportCrf) &&
      loaded.ffmpegExportCrf >= 0 &&
      loaded.ffmpegExportCrf <= 51
    ) {
      setExportCrf(loaded.ffmpegExportCrf)
    } else {
      setExportCrf(null)
    }
    if (
      typeof loaded.ffmpegExportVideoBitrate === 'string' &&
      EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
    ) {
      setExportVideoBitrate(loaded.ffmpegExportVideoBitrate)
    } else {
      setExportVideoBitrate(null)
    }
    const bitrateOk =
      typeof loaded.ffmpegExportVideoBitrate === 'string' &&
      EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
    const vcodec = parseFfmpegExportVideoCodec(loaded.ffmpegExportVideoCodec)
    setExportVideoCodec(vcodec)
    let nextContainer: FfmpegExportContainerId =
      ec === 'mp4' || ec === 'mkv' || ec === 'mov' ? ec : 'mp4'
    if (cpuFfmpegVideoCodecRequiresMkv(vcodec) && nextContainer !== 'mkv') {
      nextContainer = 'mkv'
      void window.fluxalloy.settings.setFfmpegExportContainer('mkv').catch(console.error)
    }
    if (ffmpegExportVideoCodecRequiresMov(vcodec) && nextContainer !== 'mov') {
      nextContainer = 'mov'
      void window.fluxalloy.settings.setFfmpegExportContainer('mov').catch(console.error)
    }
    let nextAudioMode: FfmpegExportAudioModeId = 'aac'
    if (loaded.ffmpegExportAudioMode === 'none') {
      nextAudioMode = 'none'
    } else if (loaded.ffmpegExportAudioMode === 'libmp3lame') {
      nextAudioMode = 'libmp3lame'
    } else if (loaded.ffmpegExportAudioMode === 'ac3') {
      nextAudioMode = 'ac3'
    } else if (loaded.ffmpegExportAudioMode === 'copy') {
      nextAudioMode = 'copy'
    } else if (loaded.ffmpegExportAudioMode === 'pcm_s16le') {
      nextAudioMode = 'pcm_s16le'
    } else if (loaded.ffmpegExportAudioMode === 'libvorbis') {
      nextAudioMode = 'libvorbis'
    } else if (loaded.ffmpegExportAudioMode === 'libopus') {
      nextAudioMode = 'libopus'
    } else if (loaded.ffmpegExportAudioMode === 'flac') {
      nextAudioMode = 'flac'
    } else if (loaded.ffmpegExportAudioMode === 'alac') {
      nextAudioMode = 'alac'
    }
    if (ffmpegExportAudioModeRequiresMkv(nextAudioMode) && nextContainer !== 'mkv') {
      nextContainer = 'mkv'
      void window.fluxalloy.settings.setFfmpegExportContainer('mkv').catch(console.error)
    }
    setExportContainer(nextContainer)
    setExportAudioMode(nextAudioMode)
    setExportTwoPass(loaded.ffmpegExportTwoPass === true && bitrateOk && vcodec === 'libx264')
    setExportEconomyMode(loaded.ffmpegExportEconomyMode === true)
    setExportHwDecode(loaded.ffmpegExportHwDecode === true)
    setExportExtraArgsLine(
      typeof loaded.ffmpegExportExtraArgsLine === 'string' ? loaded.ffmpegExportExtraArgsLine : ''
    )
    setEditorUrlPasteBehavior(parseEditorUrlPasteBehavior(loaded.editorUrlPasteBehavior))
    setBatchOutputSuffix(
      typeof loaded.ffmpegExportBatchOutputSuffix === 'string' &&
        loaded.ffmpegExportBatchOutputSuffix.trim().length > 0
        ? loaded.ffmpegExportBatchOutputSuffix.trim()
        : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
    )
    setBatchOutputDirectory(
      typeof loaded.ffmpegExportBatchOutputDirectory === 'string'
        ? loaded.ffmpegExportBatchOutputDirectory.trim()
        : ''
    )
    if (
      typeof loaded.ffmpegExportAudioBitrate === 'string' &&
      EXPORT_AUDIO_BITRATES.includes(loaded.ffmpegExportAudioBitrate)
    ) {
      setExportAudioBitrate(loaded.ffmpegExportAudioBitrate)
    }
    if (
      typeof loaded.ffmpegExportFps === 'number' &&
      EXPORT_FPS_OPTIONS.includes(loaded.ffmpegExportFps)
    ) {
      setExportFps(loaded.ffmpegExportFps)
    } else {
      setExportFps(null)
    }
    const vt = loaded.ffmpegExportVideoTransform
    if (vt === 'cw90' || vt === 'ccw90' || vt === 'r180' || vt === 'hflip' || vt === 'vflip') {
      setExportVideoTransform(vt)
    } else {
      setExportVideoTransform('none')
    }
    const crop = loaded.ffmpegExportCropPreset
    if (crop === 'center-square' || crop === 'center-16-9' || crop === 'center-4-3') {
      setExportCropPreset(crop)
    } else {
      setExportCropPreset('none')
    }
    const scale = loaded.ffmpegExportScalePreset
    if (scale === '480p' || scale === '720p' || scale === '1080p') {
      setExportScalePreset(scale)
    } else {
      setExportScalePreset('source')
    }
    if (
      typeof loaded.ffmpegExportAudioGainDb === 'number' &&
      Number.isInteger(loaded.ffmpegExportAudioGainDb) &&
      loaded.ffmpegExportAudioGainDb >= -24 &&
      loaded.ffmpegExportAudioGainDb <= 24 &&
      loaded.ffmpegExportAudioGainDb !== 0
    ) {
      setExportAudioGainDb(loaded.ffmpegExportAudioGainDb)
    } else {
      setExportAudioGainDb(0)
    }
    setExportStripMetadata(loaded.ffmpegExportStripMetadata === true)
    setExportStripChapters(loaded.ffmpegExportStripChapters === true)
    setExportSubtitleMode(loaded.ffmpegExportSubtitleMode === 'copy' ? 'copy' : 'drop')
    const deint = loaded.ffmpegExportVideoDeinterlace
    setExportVideoDeinterlace(deint === 'frame' || deint === 'field' ? deint : 'off')
    const dn = loaded.ffmpegExportVideoDenoise
    setExportVideoDenoise(dn === 'light' || dn === 'medium' || dn === 'strong' ? dn : 'off')
    const db = loaded.ffmpegExportVideoDeband
    setExportVideoDeband(db === 'light' || db === 'medium' || db === 'strong' ? db : 'off')
    const hi = loaded.ffmpegExportVideoHisteq
    setExportVideoHisteq(hi === 'light' || hi === 'medium' || hi === 'strong' ? hi : 'off')
    const sh = loaded.ffmpegExportVideoSharpen
    setExportVideoSharpen(sh === 'light' || sh === 'medium' || sh === 'strong' ? sh : 'off')
    const eq = loaded.ffmpegExportVideoEqPreset
    setExportVideoEqPreset(
      eq === 'warm' || eq === 'cool' || eq === 'vivid' || eq === 'flat' ? eq : 'off'
    )
    const hu = loaded.ffmpegExportVideoHue
    setExportVideoHue(hu === 'warmShift' || hu === 'coolShift' || hu === 'satBoost' ? hu : 'off')
    const gr = loaded.ffmpegExportVideoGrain
    setExportVideoGrain(gr === 'light' || gr === 'medium' || gr === 'strong' ? gr : 'off')
    const vg = loaded.ffmpegExportVideoVignette
    setExportVideoVignette(vg === 'light' || vg === 'medium' || vg === 'strong' ? vg : 'off')
    const bl = loaded.ffmpegExportVideoBlur
    setExportVideoBlur(bl === 'light' || bl === 'medium' || bl === 'strong' ? bl : 'off')
    const an = loaded.ffmpegExportAudioNormalize
    setExportAudioNormalize(an === 'loudnorm' || an === 'dynaudnorm' ? an : 'off')
    const lut = loaded.ffmpegExportVideoLut3d
    setExportVideoLut3d(lut === 'film-warm' || lut === 'film-cool' || lut === 'punch' ? lut : 'off')
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

export type FfmpegExportSelectOptions = ReturnType<
  typeof useEditorExportSettings
>['ffmpegExportSelectOptions']
