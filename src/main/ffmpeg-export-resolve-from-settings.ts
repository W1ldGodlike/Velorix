import { existsSync } from 'fs'
import { basename, dirname, join } from 'path'

import type { AppSettings } from '../shared/settings-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoLut3dId,
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
  parseFfmpegExportTwoPass,
  parseFfmpegExportVideoBitrate,
  parseFfmpegExportVideoDeband,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoEqPreset,
  parseFfmpegExportVideoLut3d,
  parseFfmpegExportVideoSharpen,
  parseFfmpegExportVideoTransform
} from './ffmpeg-export-service'

/** Параметры `runFfmpegExportJob`, кроме путей, ffmpeg, trim, probe, signal, onProgress. */
export type ResolvedFfmpegExportJobOptions = {
  encodePreset: FfmpegExportEncodePresetId
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
  audioGainDb: number | null
  stripMetadata: boolean | null
  stripChapters: boolean | null
  subtitleMode: FfmpegExportSubtitleModeId | null
  videoDenoise: FfmpegExportVideoDenoiseId | null
  videoDeband: FfmpegExportVideoDebandId | null
  videoLut3d: FfmpegExportVideoLut3dId
  videoSharpen: FfmpegExportVideoSharpenId | null
  videoEqPreset: FfmpegExportVideoEqPresetId | null
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
      ? parseFfmpegExportTwoPass(twoPassRaw)
      : parseFfmpegExportTwoPass(settings.ffmpegExportTwoPass)
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
  const audioNormalizeRaw = raw['audioNormalize']
  const audioNormalize =
    audioNormalizeRaw !== undefined && audioNormalizeRaw !== null
      ? parseFfmpegExportAudioNormalize(audioNormalizeRaw)
      : parseFfmpegExportAudioNormalize(settings.ffmpegExportAudioNormalize)

  return {
    encodePreset,
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
    audioGainDb,
    stripMetadata,
    stripChapters,
    subtitleMode,
    videoDenoise,
    videoDeband,
    videoLut3d,
    videoSharpen,
    videoEqPreset,
    audioNormalize
  }
}

/** §6.4 → §7.2: соседний файл `name-export(.-N).ext` без перезаписи существующих. */
export function pickUniqueAutoExportOutputPath(
  inputAbsolutePath: string,
  container: FfmpegExportContainerId
): string {
  const dir = dirname(inputAbsolutePath)
  const stem = basename(inputAbsolutePath).replace(/\.[^.]+$/, '')
  const ext = container
  let n = 0
  let candidate = join(dir, `${stem}-export.${ext}`)
  while (existsSync(candidate)) {
    n += 1
    candidate = join(dir, `${stem}-export-${n}.${ext}`)
  }
  return candidate
}
