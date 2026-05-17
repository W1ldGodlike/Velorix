import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
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
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import type { FfmpegExportArgvParams } from '../shared/ffmpeg-export-argv'

export type FfmpegExportJobParams = {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  encodePreset?: FfmpegExportEncodePresetId
  videoCodec?: FfmpegExportVideoCodecId | null
  container?: FfmpegExportContainerId | null
  crf?: number | null
  videoBitrate?: string | null
  audioMode?: FfmpegExportAudioModeId | null
  audioBitrate?: string | null
  fps?: number | null
  scalePreset?: FfmpegExportScalePresetId | null
  videoTransform?: FfmpegExportVideoTransformId | null
  cropPreset?: FfmpegExportCropPresetId | null
  twoPass?: boolean | null
  economyMode?: boolean | null
  hwDecode?: boolean | null
  extraArgsLine?: string | null
  audioGainDb?: number | null
  stripMetadata?: boolean | null
  stripChapters?: boolean | null
  subtitleMode?: FfmpegExportSubtitleModeId | null
  videoDenoise?: FfmpegExportVideoDenoiseId | null
  videoDeband?: FfmpegExportVideoDebandId | null
  videoHisteq?: FfmpegExportVideoHisteqId | null
  videoLut3d?: FfmpegExportVideoLut3dId | null
  lutResourcesRoot?: string | null
  videoLut3dCubeAbsPath?: string | null
  videoSharpen?: FfmpegExportVideoSharpenId | null
  videoEqPreset?: FfmpegExportVideoEqPresetId | null
  videoHue?: FfmpegExportVideoHueId | null
  videoGrain?: FfmpegExportVideoGrainId | null
  videoVignette?: FfmpegExportVideoVignetteId | null
  videoBlur?: FfmpegExportVideoBlurId | null
  videoDeinterlace?: FfmpegExportVideoDeinterlaceId | null
  audioNormalize?: FfmpegExportAudioNormalizeId | null
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
  uiLocale?: DownloadsWindowUiLocale
}

export type FfmpegExportJobResolved =
  | { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId }
  | {
      ok: true
      videoCodec: FfmpegExportVideoCodecId
      wantTwoPass: boolean
      baseArgvParams: FfmpegExportArgvParams
      segmentDur: number
      uloc: DownloadsWindowUiLocale
      secondPassProgressMessage: string
      jobOnProgress?: (p: FfmpegExportProgressPayload) => void
      doneOk: () => { ok: true; videoCodecUsed: FfmpegExportVideoCodecId }
      doneErr: (error: string) => {
        ok: false
        error: string
        videoCodecUsed: FfmpegExportVideoCodecId
      }
    }
