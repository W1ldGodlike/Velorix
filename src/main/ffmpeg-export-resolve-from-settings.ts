import { existsSync } from 'fs'
import { dirname, isAbsolute, join, normalize } from 'path'

import type { AppSettings } from '../shared/settings-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId
} from '../shared/ffmpeg-export-contract'
import {
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioGainDb,
  parseFfmpegExportAudioMode,
  parseFfmpegExportAudioNormalize,
  parseFfmpegExportContainer,
  parseFfmpegExportCropPreset,
  parseFfmpegExportCrf,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportStripFlag,
  parseFfmpegExportSubtitleMode,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportTwoPass,
  parseFfmpegExportVideoBitrate,
  parseFfmpegExportVideoCodec,
  parseFfmpegExportVideoDeband,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoHisteq,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoEqPreset,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoHue,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoLut3d,
  parseFfmpegExportVideoVignette,
  parseFfmpegExportVideoSharpen,
  parseFfmpegExportVideoTransform
} from './ffmpeg-export-service'
import { parseFfmpegExportHwDecode } from '../shared/ffmpeg-export-hw-decode'
import {
  buildFfmpegExportBatchOutputBasename,
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  parseFfmpegExportBatchOutputSuffixTemplate
} from '../shared/ffmpeg-export-batch-output-suffix'

/** Параметры `runFfmpegExportJob`, кроме путей, ffmpeg, trim, probe, signal, onProgress. */
export type ResolvedFfmpegExportJobOptions = {
  encodePreset: FfmpegExportEncodePresetId
  videoCodec: FfmpegExportVideoCodecId
  container: FfmpegExportContainerId
  crf: number | null
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId | null
  audioBitrate: string | null
  fps: number | null
  scalePreset: FfmpegExportScalePresetId | null
  videoTransform: FfmpegExportVideoTransformId | null
  cropPreset: FfmpegExportCropPresetId | null
  twoPass: boolean
  economyMode: boolean
  hwDecode: boolean
  extraArgsLine: string
  audioGainDb: number | null
  stripMetadata: boolean | null
  stripChapters: boolean | null
  subtitleMode: FfmpegExportSubtitleModeId | null
  videoDenoise: FfmpegExportVideoDenoiseId | null
  videoDeband: FfmpegExportVideoDebandId | null
  videoHisteq: FfmpegExportVideoHisteqId | null
  videoLut3d: FfmpegExportVideoLut3dId
  videoSharpen: FfmpegExportVideoSharpenId | null
  videoEqPreset: FfmpegExportVideoEqPresetId | null
  videoHue: FfmpegExportVideoHueId | null
  videoGrain: FfmpegExportVideoGrainId | null
  videoVignette: FfmpegExportVideoVignetteId | null
  videoBlur: FfmpegExportVideoBlurId | null
  videoDeinterlace: FfmpegExportVideoDeinterlaceId | null
  audioNormalize: FfmpegExportAudioNormalizeId | null
}

/**
 * Те же правила, что IPC `exportStart`: поля из `overrides` при наличии, иначе из `settings`.
 */
export function resolveFfmpegExportJobOptionsFromAppSettings(
  settings: AppSettings,
  overrides?: unknown
): ResolvedFfmpegExportJobOptions {
  const raw =
    overrides !== undefined && overrides !== null && typeof overrides === 'object'
      ? (overrides as Record<string, unknown>)
      : {}

  const encodePresetRaw = raw['encodePreset']
  const encodePreset =
    encodePresetRaw !== undefined && encodePresetRaw !== null
      ? parseFfmpegExportEncodePreset(encodePresetRaw)
      : parseFfmpegExportEncodePreset(settings.ffmpegExportEncodePreset)
  const videoCodecRaw = raw['videoCodec']
  const videoCodec =
    videoCodecRaw !== undefined && videoCodecRaw !== null
      ? parseFfmpegExportVideoCodec(videoCodecRaw)
      : parseFfmpegExportVideoCodec(settings.ffmpegExportVideoCodec)
  const containerRaw = raw['container']
  const container =
    containerRaw !== undefined && containerRaw !== null
      ? parseFfmpegExportContainer(containerRaw)
      : parseFfmpegExportContainer(settings.ffmpegExportContainer)
  const crfRaw = raw['crf']
  const crf =
    crfRaw !== undefined && crfRaw !== null
      ? parseFfmpegExportCrf(crfRaw)
      : parseFfmpegExportCrf(settings.ffmpegExportCrf)
  const videoBitrateRaw = raw['videoBitrate']
  const videoBitrate =
    videoBitrateRaw !== undefined && videoBitrateRaw !== null
      ? parseFfmpegExportVideoBitrate(videoBitrateRaw)
      : parseFfmpegExportVideoBitrate(settings.ffmpegExportVideoBitrate)
  const audioModeRaw = raw['audioMode']
  const audioMode =
    audioModeRaw !== undefined && audioModeRaw !== null
      ? parseFfmpegExportAudioMode(audioModeRaw)
      : parseFfmpegExportAudioMode(settings.ffmpegExportAudioMode)
  const audioBitrateRaw = raw['audioBitrate']
  const audioBitrate =
    audioBitrateRaw !== undefined && audioBitrateRaw !== null
      ? parseFfmpegExportAudioBitrate(audioBitrateRaw)
      : parseFfmpegExportAudioBitrate(settings.ffmpegExportAudioBitrate)
  const fpsRaw = raw['fps']
  const fps =
    fpsRaw !== undefined && fpsRaw !== null
      ? parseFfmpegExportFps(fpsRaw)
      : parseFfmpegExportFps(settings.ffmpegExportFps)
  const scalePresetRaw = raw['scalePreset']
  const scalePreset =
    scalePresetRaw !== undefined && scalePresetRaw !== null
      ? parseFfmpegExportScalePreset(scalePresetRaw)
      : parseFfmpegExportScalePreset(settings.ffmpegExportScalePreset)
  const videoTransformRaw = raw['videoTransform']
  const videoTransform =
    videoTransformRaw !== undefined && videoTransformRaw !== null
      ? parseFfmpegExportVideoTransform(videoTransformRaw)
      : parseFfmpegExportVideoTransform(settings.ffmpegExportVideoTransform)
  const cropPresetRaw = raw['cropPreset']
  const cropPreset =
    cropPresetRaw !== undefined && cropPresetRaw !== null
      ? parseFfmpegExportCropPreset(cropPresetRaw)
      : parseFfmpegExportCropPreset(settings.ffmpegExportCropPreset)
  const twoPassRaw = raw['twoPass']
  const twoPass =
    twoPassRaw !== undefined && twoPassRaw !== null
      ? parseFfmpegExportTwoPass(twoPassRaw) && videoCodec === 'libx264'
      : parseFfmpegExportTwoPass(settings.ffmpegExportTwoPass) && videoCodec === 'libx264'
  const economyModeRaw = raw['economyMode']
  const economyMode =
    economyModeRaw !== undefined && economyModeRaw !== null
      ? parseFfmpegExportEconomyMode(economyModeRaw)
      : parseFfmpegExportEconomyMode(settings.ffmpegExportEconomyMode)
  const hwDecodeRaw = raw['hwDecode']
  const hwDecode =
    hwDecodeRaw !== undefined && hwDecodeRaw !== null
      ? parseFfmpegExportHwDecode(hwDecodeRaw)
      : parseFfmpegExportHwDecode(settings.ffmpegExportHwDecode)
  const extraArgsLineRaw = raw['extraArgsLine']
  const extraArgsLine =
    typeof extraArgsLineRaw === 'string'
      ? extraArgsLineRaw
      : typeof settings.ffmpegExportExtraArgsLine === 'string'
        ? settings.ffmpegExportExtraArgsLine
        : ''
  const audioGainRaw = raw['audioGainDb']
  const audioGainDb =
    audioGainRaw !== undefined
      ? parseFfmpegExportAudioGainDb(audioGainRaw)
      : parseFfmpegExportAudioGainDb(settings.ffmpegExportAudioGainDb)
  const stripMetadataRaw = raw['stripMetadata']
  const stripMetadata =
    stripMetadataRaw !== undefined
      ? parseFfmpegExportStripFlag(stripMetadataRaw)
      : parseFfmpegExportStripFlag(settings.ffmpegExportStripMetadata)
  const stripChaptersRaw = raw['stripChapters']
  const stripChapters =
    stripChaptersRaw !== undefined
      ? parseFfmpegExportStripFlag(stripChaptersRaw)
      : parseFfmpegExportStripFlag(settings.ffmpegExportStripChapters)
  const subtitleModeRaw = raw['subtitleMode']
  const subtitleMode =
    subtitleModeRaw !== undefined && subtitleModeRaw !== null
      ? parseFfmpegExportSubtitleMode(subtitleModeRaw)
      : parseFfmpegExportSubtitleMode(settings.ffmpegExportSubtitleMode)
  const videoDenoiseRaw = raw['videoDenoise']
  const videoDenoise =
    videoDenoiseRaw !== undefined && videoDenoiseRaw !== null
      ? parseFfmpegExportVideoDenoise(videoDenoiseRaw)
      : parseFfmpegExportVideoDenoise(settings.ffmpegExportVideoDenoise)
  const videoDebandRaw = raw['videoDeband']
  const videoDeband =
    videoDebandRaw !== undefined && videoDebandRaw !== null
      ? parseFfmpegExportVideoDeband(videoDebandRaw)
      : parseFfmpegExportVideoDeband(settings.ffmpegExportVideoDeband)
  const videoHisteqRaw = raw['videoHisteq']
  const videoHisteq =
    videoHisteqRaw !== undefined && videoHisteqRaw !== null
      ? parseFfmpegExportVideoHisteq(videoHisteqRaw)
      : parseFfmpegExportVideoHisteq(settings.ffmpegExportVideoHisteq)
  const videoLut3dRaw = raw['videoLut3d']
  const videoLut3d =
    videoLut3dRaw !== undefined && videoLut3dRaw !== null
      ? parseFfmpegExportVideoLut3d(videoLut3dRaw)
      : parseFfmpegExportVideoLut3d(settings.ffmpegExportVideoLut3d)
  const videoSharpenRaw = raw['videoSharpen']
  const videoSharpen =
    videoSharpenRaw !== undefined && videoSharpenRaw !== null
      ? parseFfmpegExportVideoSharpen(videoSharpenRaw)
      : parseFfmpegExportVideoSharpen(settings.ffmpegExportVideoSharpen)
  const videoEqPresetRaw = raw['videoEqPreset']
  const videoEqPreset =
    videoEqPresetRaw !== undefined && videoEqPresetRaw !== null
      ? parseFfmpegExportVideoEqPreset(videoEqPresetRaw)
      : parseFfmpegExportVideoEqPreset(settings.ffmpegExportVideoEqPreset)
  const videoHueRaw = raw['videoHue']
  const videoHue =
    videoHueRaw !== undefined && videoHueRaw !== null
      ? parseFfmpegExportVideoHue(videoHueRaw)
      : parseFfmpegExportVideoHue(settings.ffmpegExportVideoHue)
  const videoGrainRaw = raw['videoGrain']
  const videoGrain =
    videoGrainRaw !== undefined && videoGrainRaw !== null
      ? parseFfmpegExportVideoGrain(videoGrainRaw)
      : parseFfmpegExportVideoGrain(settings.ffmpegExportVideoGrain)
  const videoVignetteRaw = raw['videoVignette']
  const videoVignette =
    videoVignetteRaw !== undefined && videoVignetteRaw !== null
      ? parseFfmpegExportVideoVignette(videoVignetteRaw)
      : parseFfmpegExportVideoVignette(settings.ffmpegExportVideoVignette)
  const videoBlurRaw = raw['videoBlur']
  const videoBlur =
    videoBlurRaw !== undefined && videoBlurRaw !== null
      ? parseFfmpegExportVideoBlur(videoBlurRaw)
      : parseFfmpegExportVideoBlur(settings.ffmpegExportVideoBlur)
  const videoDeinterlaceRaw = raw['videoDeinterlace']
  const videoDeinterlace =
    videoDeinterlaceRaw !== undefined && videoDeinterlaceRaw !== null
      ? parseFfmpegExportVideoDeinterlace(videoDeinterlaceRaw)
      : parseFfmpegExportVideoDeinterlace(settings.ffmpegExportVideoDeinterlace)
  const audioNormalizeRaw = raw['audioNormalize']
  const audioNormalize =
    audioNormalizeRaw !== undefined && audioNormalizeRaw !== null
      ? parseFfmpegExportAudioNormalize(audioNormalizeRaw)
      : parseFfmpegExportAudioNormalize(settings.ffmpegExportAudioNormalize)

  return {
    encodePreset,
    videoCodec,
    container,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset,
    videoTransform,
    cropPreset,
    twoPass,
    economyMode,
    hwDecode,
    extraArgsLine,
    audioGainDb,
    stripMetadata,
    stripChapters,
    subtitleMode,
    videoDenoise,
    videoDeband,
    videoHisteq,
    videoLut3d,
    videoSharpen,
    videoEqPreset,
    videoHue,
    videoGrain,
    videoVignette,
    videoBlur,
    videoDeinterlace,
    audioNormalize
  }
}

/** §6.4 → §7.2 / §7.3: уникальный выход; шаблон без расширения контейнера; опционально общая папка для пакета. */
export function pickUniqueAutoExportOutputPath(
  inputAbsolutePath: string,
  container: FfmpegExportContainerId,
  outputSuffixTemplate?: string | null,
  outputDirAbsolute?: string | null
): string {
  const parsed = parseFfmpegExportBatchOutputSuffixTemplate(
    outputSuffixTemplate ?? DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  )
  const template = parsed.ok ? parsed.template : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  const inDir = dirname(inputAbsolutePath)
  let dir = inDir
  if (typeof outputDirAbsolute === 'string') {
    const n = normalize(outputDirAbsolute.trim())
    if (n.length > 0 && n.length <= 4096 && isAbsolute(n)) {
      dir = n
    }
  }
  const base = buildFfmpegExportBatchOutputBasename(inputAbsolutePath, template)
  const ext = container
  let n = 0
  let candidate = join(dir, `${base}.${ext}`)
  while (existsSync(candidate)) {
    n += 1
    candidate = join(dir, `${base}-${n}.${ext}`)
  }
  return candidate
}

export function resolveFfmpegExportBatchOutputDirectoryFromSettings(
  settings: AppSettings
): string | null {
  const raw = settings.ffmpegExportBatchOutputDirectory
  if (typeof raw !== 'string' || raw.trim() === '') {
    return null
  }
  const n = normalize(raw.trim())
  if (!isAbsolute(n) || n.length > 4096) {
    return null
  }
  return n
}

export function resolveFfmpegExportBatchOutputSuffixFromSettings(settings: AppSettings): string {
  const parsed = parseFfmpegExportBatchOutputSuffixTemplate(settings.ffmpegExportBatchOutputSuffix)
  return parsed.ok ? parsed.template : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
}
