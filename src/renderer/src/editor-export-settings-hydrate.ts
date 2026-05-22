import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId,
  FfmpegExportAudioNormalizeId
} from '../../shared/ffmpeg-export-contract'
import {
  parseEditorUrlPasteBehavior,
  type EditorUrlPasteBehaviorId
} from '../../shared/editor-url-paste-behavior'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../shared/ffmpeg-export-batch-output-suffix'
import { ffmpegExportAudioModeRequiresMkv } from '../../shared/ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  ffmpegExportVideoCodecRequiresMov,
  parseFfmpegExportVideoCodec
} from '../../shared/ffmpeg-export-video-codec'
import type { AppSettings } from '../../shared/settings-contract'
import {
  EXPORT_AUDIO_BITRATES,
  EXPORT_FPS_OPTIONS,
  EXPORT_VIDEO_BITRATES
} from './editor-export-settings-constants'

export type EditorExportSettingsHydrateSetters = {
  setExportEncodePreset: (v: FfmpegExportEncodePresetId) => void
  setExportCrf: (v: number | null) => void
  setExportVideoBitrate: (v: string | null) => void
  setExportVideoCodec: (v: FfmpegExportVideoCodecId) => void
  setExportContainer: (v: FfmpegExportContainerId) => void
  setExportAudioMode: (v: FfmpegExportAudioModeId) => void
  setExportTwoPass: (v: boolean) => void
  setExportEconomyMode: (v: boolean) => void
  setExportBenchmarkLoadThreshold: (v: number) => void
  setExportHwDecode: (v: boolean) => void
  setExportExtraArgsLine: (v: string) => void
  setEditorUrlPasteBehavior: (v: EditorUrlPasteBehaviorId) => void
  setBatchOutputSuffix: (v: string) => void
  setBatchOutputDirectory: (v: string) => void
  setExportAudioBitrate: (v: string) => void
  setExportFps: (v: number | null) => void
  setExportVideoTransform: (v: FfmpegExportVideoTransformId) => void
  setExportCropPreset: (v: FfmpegExportCropPresetId) => void
  setExportScalePreset: (v: FfmpegExportScalePresetId) => void
  setExportAudioGainDb: (v: number) => void
  setExportStripMetadata: (v: boolean) => void
  setExportStripChapters: (v: boolean) => void
  setExportSubtitleMode: (v: FfmpegExportSubtitleModeId) => void
  setExportVideoDeinterlace: (v: FfmpegExportVideoDeinterlaceId) => void
  setExportVideoDenoise: (v: FfmpegExportVideoDenoiseId) => void
  setExportVideoDeband: (v: FfmpegExportVideoDebandId) => void
  setExportVideoHisteq: (v: FfmpegExportVideoHisteqId) => void
  setExportVideoSharpen: (v: FfmpegExportVideoSharpenId) => void
  setExportVideoEqPreset: (v: FfmpegExportVideoEqPresetId) => void
  setExportVideoHue: (v: FfmpegExportVideoHueId) => void
  setExportVideoGrain: (v: FfmpegExportVideoGrainId) => void
  setExportVideoVignette: (v: FfmpegExportVideoVignetteId) => void
  setExportVideoBlur: (v: FfmpegExportVideoBlurId) => void
  setExportAudioNormalize: (v: FfmpegExportAudioNormalizeId) => void
  setExportVideoLut3d: (v: FfmpegExportVideoLut3dId) => void
  setExportExternalFilterKind: (v: 'off' | 'avisynth' | 'vapoursynth') => void
  setExportExternalFilterScriptPath: (v: string) => void
}

export function hydrateEditorExportFieldsFromSettings(
  loaded: AppSettings,
  s: EditorExportSettingsHydrateSetters
): void {
  const ep = loaded.ffmpegExportEncodePreset
  if (ep === 'balance' || ep === 'smaller' || ep === 'quality') {
    s.setExportEncodePreset(ep)
  }
  const ec = loaded.ffmpegExportContainer
  if (
    typeof loaded.ffmpegExportCrf === 'number' &&
    Number.isInteger(loaded.ffmpegExportCrf) &&
    loaded.ffmpegExportCrf >= 0 &&
    loaded.ffmpegExportCrf <= 51
  ) {
    s.setExportCrf(loaded.ffmpegExportCrf)
  } else {
    s.setExportCrf(null)
  }
  if (
    typeof loaded.ffmpegExportVideoBitrate === 'string' &&
    EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
  ) {
    s.setExportVideoBitrate(loaded.ffmpegExportVideoBitrate)
  } else {
    s.setExportVideoBitrate(null)
  }
  const bitrateOk =
    typeof loaded.ffmpegExportVideoBitrate === 'string' &&
    EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
  const vcodec = parseFfmpegExportVideoCodec(loaded.ffmpegExportVideoCodec)
  s.setExportVideoCodec(vcodec)
  let nextContainer: FfmpegExportContainerId =
    ec === 'mp4' || ec === 'mkv' || ec === 'mov' ? ec : 'mp4'
  if (cpuFfmpegVideoCodecRequiresMkv(vcodec) && nextContainer !== 'mkv') {
    nextContainer = 'mkv'
    void window.velorix.settings.setFfmpegExportContainer('mkv').catch(console.error)
  }
  if (ffmpegExportVideoCodecRequiresMov(vcodec) && nextContainer !== 'mov') {
    nextContainer = 'mov'
    void window.velorix.settings.setFfmpegExportContainer('mov').catch(console.error)
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
    void window.velorix.settings.setFfmpegExportContainer('mkv').catch(console.error)
  }
  s.setExportContainer(nextContainer)
  s.setExportAudioMode(nextAudioMode)
  s.setExportTwoPass(loaded.ffmpegExportTwoPass === true && bitrateOk && vcodec === 'libx264')
  s.setExportEconomyMode(loaded.ffmpegExportEconomyMode === true)
  s.setExportBenchmarkLoadThreshold(
    typeof loaded.ffmpegExportBenchmarkLoadThresholdPercent === 'number'
      ? Math.min(100, Math.max(10, Math.round(loaded.ffmpegExportBenchmarkLoadThresholdPercent)))
      : 80
  )
  s.setExportHwDecode(loaded.ffmpegExportHwDecode === true)
  s.setExportExtraArgsLine(
    typeof loaded.ffmpegExportExtraArgsLine === 'string' ? loaded.ffmpegExportExtraArgsLine : ''
  )
  s.setEditorUrlPasteBehavior(parseEditorUrlPasteBehavior(loaded.editorUrlPasteBehavior))
  s.setBatchOutputSuffix(
    typeof loaded.ffmpegExportBatchOutputSuffix === 'string' &&
      loaded.ffmpegExportBatchOutputSuffix.trim().length > 0
      ? loaded.ffmpegExportBatchOutputSuffix.trim()
      : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  )
  s.setBatchOutputDirectory(
    typeof loaded.ffmpegExportBatchOutputDirectory === 'string'
      ? loaded.ffmpegExportBatchOutputDirectory.trim()
      : ''
  )
  if (
    typeof loaded.ffmpegExportAudioBitrate === 'string' &&
    EXPORT_AUDIO_BITRATES.includes(loaded.ffmpegExportAudioBitrate)
  ) {
    s.setExportAudioBitrate(loaded.ffmpegExportAudioBitrate)
  }
  if (
    typeof loaded.ffmpegExportFps === 'number' &&
    EXPORT_FPS_OPTIONS.includes(loaded.ffmpegExportFps)
  ) {
    s.setExportFps(loaded.ffmpegExportFps)
  } else {
    s.setExportFps(null)
  }
  const vt = loaded.ffmpegExportVideoTransform
  if (vt === 'cw90' || vt === 'ccw90' || vt === 'r180' || vt === 'hflip' || vt === 'vflip') {
    s.setExportVideoTransform(vt)
  } else {
    s.setExportVideoTransform('none')
  }
  const crop = loaded.ffmpegExportCropPreset
  if (crop === 'center-square' || crop === 'center-16-9' || crop === 'center-4-3') {
    s.setExportCropPreset(crop)
  } else {
    s.setExportCropPreset('none')
  }
  const scale = loaded.ffmpegExportScalePreset
  if (scale === '480p' || scale === '720p' || scale === '1080p') {
    s.setExportScalePreset(scale)
  } else {
    s.setExportScalePreset('source')
  }
  if (
    typeof loaded.ffmpegExportAudioGainDb === 'number' &&
    Number.isInteger(loaded.ffmpegExportAudioGainDb) &&
    loaded.ffmpegExportAudioGainDb >= -24 &&
    loaded.ffmpegExportAudioGainDb <= 24 &&
    loaded.ffmpegExportAudioGainDb !== 0
  ) {
    s.setExportAudioGainDb(loaded.ffmpegExportAudioGainDb)
  } else {
    s.setExportAudioGainDb(0)
  }
  s.setExportStripMetadata(loaded.ffmpegExportStripMetadata === true)
  s.setExportStripChapters(loaded.ffmpegExportStripChapters === true)
  s.setExportSubtitleMode(loaded.ffmpegExportSubtitleMode === 'copy' ? 'copy' : 'drop')
  const deint = loaded.ffmpegExportVideoDeinterlace
  s.setExportVideoDeinterlace(deint === 'frame' || deint === 'field' ? deint : 'off')
  const dn = loaded.ffmpegExportVideoDenoise
  s.setExportVideoDenoise(dn === 'light' || dn === 'medium' || dn === 'strong' ? dn : 'off')
  const db = loaded.ffmpegExportVideoDeband
  s.setExportVideoDeband(db === 'light' || db === 'medium' || db === 'strong' ? db : 'off')
  const hi = loaded.ffmpegExportVideoHisteq
  s.setExportVideoHisteq(hi === 'light' || hi === 'medium' || hi === 'strong' ? hi : 'off')
  const sh = loaded.ffmpegExportVideoSharpen
  s.setExportVideoSharpen(sh === 'light' || sh === 'medium' || sh === 'strong' ? sh : 'off')
  const eq = loaded.ffmpegExportVideoEqPreset
  s.setExportVideoEqPreset(
    eq === 'warm' || eq === 'cool' || eq === 'vivid' || eq === 'flat' ? eq : 'off'
  )
  const hu = loaded.ffmpegExportVideoHue
  s.setExportVideoHue(hu === 'warmShift' || hu === 'coolShift' || hu === 'satBoost' ? hu : 'off')
  const gr = loaded.ffmpegExportVideoGrain
  s.setExportVideoGrain(gr === 'light' || gr === 'medium' || gr === 'strong' ? gr : 'off')
  const vg = loaded.ffmpegExportVideoVignette
  s.setExportVideoVignette(vg === 'light' || vg === 'medium' || vg === 'strong' ? vg : 'off')
  const bl = loaded.ffmpegExportVideoBlur
  s.setExportVideoBlur(bl === 'light' || bl === 'medium' || bl === 'strong' ? bl : 'off')
  const an = loaded.ffmpegExportAudioNormalize
  s.setExportAudioNormalize(an === 'loudnorm' || an === 'dynaudnorm' ? an : 'off')
  const lut = loaded.ffmpegExportVideoLut3d
  s.setExportVideoLut3d(lut === 'film-warm' || lut === 'film-cool' || lut === 'punch' ? lut : 'off')
  const fk = loaded.ffmpegExportExternalFilterKind
  s.setExportExternalFilterKind(
    fk === 'avisynth' || fk === 'vapoursynth' || fk === 'off' ? fk : 'off'
  )
  s.setExportExternalFilterScriptPath(
    typeof loaded.ffmpegExportExternalFilterScriptPath === 'string'
      ? loaded.ffmpegExportExternalFilterScriptPath
      : ''
  )
}
