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
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId
} from '../../shared/ffmpeg-export-contract'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'

type SelectOption<T extends string> = { id: T; label: string }

export type FfmpegExportSelectOptions = {
  encodePresets: Array<SelectOption<FfmpegExportEncodePresetId>>
  videoCodecs: Array<SelectOption<FfmpegExportVideoCodecId>>
  containers: Array<SelectOption<FfmpegExportContainerId>>
  scalePresets: Array<SelectOption<FfmpegExportScalePresetId>>
  videoTransforms: Array<SelectOption<FfmpegExportVideoTransformId>>
  cropPresets: Array<SelectOption<FfmpegExportCropPresetId>>
  audioGainOptions: Array<{ value: number; label: string }>
  subtitleModes: Array<SelectOption<FfmpegExportSubtitleModeId>>
  videoDeinterlace: Array<SelectOption<FfmpegExportVideoDeinterlaceId>>
  videoDenoise: Array<SelectOption<FfmpegExportVideoDenoiseId>>
  videoSharpen: Array<SelectOption<FfmpegExportVideoSharpenId>>
  videoDeband: Array<SelectOption<FfmpegExportVideoDebandId>>
  videoHisteq: Array<SelectOption<FfmpegExportVideoHisteqId>>
  videoLut3d: Array<SelectOption<FfmpegExportVideoLut3dId>>
  videoEq: Array<SelectOption<FfmpegExportVideoEqPresetId>>
  videoHue: Array<SelectOption<FfmpegExportVideoHueId>>
  videoGrain: Array<SelectOption<FfmpegExportVideoGrainId>>
  videoVignette: Array<SelectOption<FfmpegExportVideoVignetteId>>
  videoBlur: Array<SelectOption<FfmpegExportVideoBlurId>>
  audioNormalize: Array<SelectOption<FfmpegExportAudioNormalizeId>>
  audioModes: Array<SelectOption<FfmpegExportAudioModeId>>
  snapshotFormats: Array<SelectOption<FfmpegSnapshotFormatId>>
}
