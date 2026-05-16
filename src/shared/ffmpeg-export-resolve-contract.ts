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
} from './ffmpeg-export-contract'

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
