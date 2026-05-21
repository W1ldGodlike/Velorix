import type { AppSettings } from '../../../shared/settings-contract'
import type {
  FfmpegExportContainerId,
  FfmpegExportUserPresetSnapshot
} from '../../../shared/ffmpeg-export-contract'
import { parseFfmpegExportVideoCodec } from '../../../shared/ffmpeg-export-video-codec'
import { parseFfmpegExportContainer } from '../../../shared/ffmpeg-export-parse-registry'

export function inferFfmpegExportContainerFromPath(path: string): FfmpegExportContainerId {
  const lower = path.trim().toLowerCase()
  if (lower.endsWith('.mkv')) {
    return 'mkv'
  }
  if (lower.endsWith('.mov')) {
    return 'mov'
  }
  return 'mp4'
}

export function ensureFfmpegExportExtension(
  path: string,
  fallback: FfmpegExportContainerId
): string {
  const trimmed = path.trim()
  if (/\.(mp4|mkv|mov)$/i.test(trimmed)) {
    return trimmed
  }
  return `${trimmed}.${parseFfmpegExportContainer(fallback)}`
}

/**
 * §7.2 — записать снимок в сериализуемые поля `AppSettings` (те же правила delete при «по умолчанию», что и точечные IPC).
 */
export function mergeFfmpegExportSnapshotIntoAppSettings(
  base: AppSettings,
  snapshot: FfmpegExportUserPresetSnapshot
): AppSettings {
  const next: AppSettings = { ...base }
  next.ffmpegExportEncodePreset = snapshot.encodePreset
  const snapV = parseFfmpegExportVideoCodec(snapshot.videoCodec)
  if (snapV === 'libx264') {
    delete next.ffmpegExportVideoCodec
  } else {
    next.ffmpegExportVideoCodec = snapV
  }
  next.ffmpegExportContainer = snapshot.container
  if (snapshot.crf === null) {
    delete next.ffmpegExportCrf
  } else {
    next.ffmpegExportCrf = snapshot.crf
  }
  if (snapshot.videoBitrate === null) {
    delete next.ffmpegExportVideoBitrate
  } else {
    next.ffmpegExportVideoBitrate = snapshot.videoBitrate
  }
  next.ffmpegExportAudioBitrate = snapshot.audioBitrate
  if (snapshot.audioMode === 'aac') {
    delete next.ffmpegExportAudioMode
  } else {
    next.ffmpegExportAudioMode = snapshot.audioMode
  }
  if (snapshot.fps === null) {
    delete next.ffmpegExportFps
  } else {
    next.ffmpegExportFps = snapshot.fps
  }
  if (snapshot.scalePreset === 'source') {
    delete next.ffmpegExportScalePreset
  } else {
    next.ffmpegExportScalePreset = snapshot.scalePreset
  }
  if (snapshot.videoTransform === 'none') {
    delete next.ffmpegExportVideoTransform
  } else {
    next.ffmpegExportVideoTransform = snapshot.videoTransform
  }
  if (snapshot.cropPreset === 'none') {
    delete next.ffmpegExportCropPreset
  } else {
    next.ffmpegExportCropPreset = snapshot.cropPreset
  }
  const snapCodec = parseFfmpegExportVideoCodec(snapshot.videoCodec)
  if (snapshot.twoPass === true && snapCodec === 'libx264' && snapshot.videoBitrate !== null) {
    next.ffmpegExportTwoPass = true
  } else {
    delete next.ffmpegExportTwoPass
  }
  if (snapshot.economyMode === true) {
    next.ffmpegExportEconomyMode = true
  } else {
    delete next.ffmpegExportEconomyMode
  }
  if (snapshot.hwDecode === true) {
    next.ffmpegExportHwDecode = true
  } else {
    delete next.ffmpegExportHwDecode
  }
  if (typeof snapshot.extraArgsLine === 'string' && snapshot.extraArgsLine.trim().length > 0) {
    next.ffmpegExportExtraArgsLine = snapshot.extraArgsLine.trim()
  } else {
    delete next.ffmpegExportExtraArgsLine
  }
  if (typeof snapshot.audioGainDb === 'number' && snapshot.audioGainDb !== 0) {
    next.ffmpegExportAudioGainDb = snapshot.audioGainDb
  } else {
    delete next.ffmpegExportAudioGainDb
  }
  if (snapshot.stripMetadata === true) {
    next.ffmpegExportStripMetadata = true
  } else {
    delete next.ffmpegExportStripMetadata
  }
  if (snapshot.stripChapters === true) {
    next.ffmpegExportStripChapters = true
  } else {
    delete next.ffmpegExportStripChapters
  }
  if (snapshot.subtitleMode === 'copy') {
    next.ffmpegExportSubtitleMode = 'copy'
  } else {
    delete next.ffmpegExportSubtitleMode
  }
  if (
    snapshot.videoDenoise === 'light' ||
    snapshot.videoDenoise === 'medium' ||
    snapshot.videoDenoise === 'strong'
  ) {
    next.ffmpegExportVideoDenoise = snapshot.videoDenoise
  } else {
    delete next.ffmpegExportVideoDenoise
  }
  if (
    snapshot.videoDeband === 'light' ||
    snapshot.videoDeband === 'medium' ||
    snapshot.videoDeband === 'strong'
  ) {
    next.ffmpegExportVideoDeband = snapshot.videoDeband
  } else {
    delete next.ffmpegExportVideoDeband
  }
  if (
    snapshot.videoHisteq === 'light' ||
    snapshot.videoHisteq === 'medium' ||
    snapshot.videoHisteq === 'strong'
  ) {
    next.ffmpegExportVideoHisteq = snapshot.videoHisteq
  } else {
    delete next.ffmpegExportVideoHisteq
  }
  if (
    snapshot.videoLut3d === 'film-warm' ||
    snapshot.videoLut3d === 'film-cool' ||
    snapshot.videoLut3d === 'punch'
  ) {
    next.ffmpegExportVideoLut3d = snapshot.videoLut3d
  } else {
    delete next.ffmpegExportVideoLut3d
  }
  if (
    snapshot.videoSharpen === 'light' ||
    snapshot.videoSharpen === 'medium' ||
    snapshot.videoSharpen === 'strong'
  ) {
    next.ffmpegExportVideoSharpen = snapshot.videoSharpen
  } else {
    delete next.ffmpegExportVideoSharpen
  }
  if (
    snapshot.videoEqPreset === 'warm' ||
    snapshot.videoEqPreset === 'cool' ||
    snapshot.videoEqPreset === 'vivid' ||
    snapshot.videoEqPreset === 'flat'
  ) {
    next.ffmpegExportVideoEqPreset = snapshot.videoEqPreset
  } else {
    delete next.ffmpegExportVideoEqPreset
  }
  if (
    snapshot.videoHue === 'warmShift' ||
    snapshot.videoHue === 'coolShift' ||
    snapshot.videoHue === 'satBoost'
  ) {
    next.ffmpegExportVideoHue = snapshot.videoHue
  } else {
    delete next.ffmpegExportVideoHue
  }
  if (
    snapshot.videoGrain === 'light' ||
    snapshot.videoGrain === 'medium' ||
    snapshot.videoGrain === 'strong'
  ) {
    next.ffmpegExportVideoGrain = snapshot.videoGrain
  } else {
    delete next.ffmpegExportVideoGrain
  }
  if (
    snapshot.videoVignette === 'light' ||
    snapshot.videoVignette === 'medium' ||
    snapshot.videoVignette === 'strong'
  ) {
    next.ffmpegExportVideoVignette = snapshot.videoVignette
  } else {
    delete next.ffmpegExportVideoVignette
  }
  if (
    snapshot.videoBlur === 'light' ||
    snapshot.videoBlur === 'medium' ||
    snapshot.videoBlur === 'strong'
  ) {
    next.ffmpegExportVideoBlur = snapshot.videoBlur
  } else {
    delete next.ffmpegExportVideoBlur
  }
  if (snapshot.videoDeinterlace === 'frame' || snapshot.videoDeinterlace === 'field') {
    next.ffmpegExportVideoDeinterlace = snapshot.videoDeinterlace
  } else {
    delete next.ffmpegExportVideoDeinterlace
  }
  if (snapshot.audioNormalize === 'loudnorm' || snapshot.audioNormalize === 'dynaudnorm') {
    next.ffmpegExportAudioNormalize = snapshot.audioNormalize
  } else {
    delete next.ffmpegExportAudioNormalize
  }
  return next
}
