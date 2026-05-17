import type { MutableRefObject, RefObject } from 'react'

import {
  buildFfmpegExportPreviewCommand,
  type FfmpegExportPreviewInput
} from '../../shared/ffmpeg-export-argv'
import type {
  FfmpegExportContainerId,
  FfmpegExportVideoCodecId
} from '../../shared/ffmpeg-export-contract'
import { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'

export type UseEditorExportPipelineDeps = {
  setStatusHint: (hint: string | null) => void
  preview: RestoredSourceInfo | null
  probeInfo: MediaProbeSuccess | null
  trimRange: { inSec: number; outSec: number } | null
  trimSnapshotRef: MutableRefObject<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>
  videoRef: RefObject<HTMLVideoElement | null>
  exportBusy: boolean
  setExportBusy: (busy: boolean) => void
  exportCancelBusy: boolean
  setExportCancelBusy: (busy: boolean) => void
  batchExportBusy: boolean
  snapshotBusy: boolean
  setSnapshotBusy: (busy: boolean) => void
  refreshProcessingHistory: () => Promise<void>
  buildCurrentFfmpegExportOverrides: () => Record<string, unknown>
  exportContainer: FfmpegExportContainerId
  exportEncodePreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['encodePreset']
  exportVideoCodecResolvedForPreview: Exclude<
    FfmpegExportVideoCodecId,
    'hw_auto' | 'hw_auto_hevc'
  >
  exportCrf: number | null
  exportVideoBitrate: string | null
  exportAudioMode: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['audioMode']
  exportAudioBitrate: string
  exportFps: number | null
  exportScalePreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['scalePreset']
  exportVideoTransform: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoTransform']
  exportCropPreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['cropPreset']
  exportTwoPass: boolean
  exportEconomyMode: boolean
  exportHwaccelDecodeForPreview: string | null
  exportExtraArgsParsed: ReturnType<typeof parseFfmpegExportExtraArgsLine>
  exportAudioGainDb: number
  exportStripMetadata: boolean
  exportStripChapters: boolean
  exportSubtitleMode: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['subtitleMode']
  exportVideoDeinterlace: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoDeinterlace']
  exportVideoDenoise: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoDenoise']
  exportVideoDeband: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoDeband']
  exportVideoHisteq: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoHisteq']
  lutCubePathForPreview: string | null
  exportVideoSharpen: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoSharpen']
  exportVideoEqPreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoEqPreset']
  exportVideoHue: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoHue']
  exportVideoGrain: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoGrain']
  exportVideoVignette: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoVignette']
  exportVideoBlur: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoBlur']
  exportAudioNormalize: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['audioNormalize']
  lastExportPath: string | null
  setLastExportPath: (path: string | null) => void
  lastSnapshotPath: string | null
  setLastSnapshotPath: (path: string | null) => void
}

export type EditorExportPipelinePreviewDeps = Pick<
  UseEditorExportPipelineDeps,
  | 'preview'
  | 'probeInfo'
  | 'trimRange'
  | 'exportContainer'
  | 'exportEncodePreset'
  | 'exportVideoCodecResolvedForPreview'
  | 'exportCrf'
  | 'exportVideoBitrate'
  | 'exportAudioMode'
  | 'exportAudioBitrate'
  | 'exportFps'
  | 'exportScalePreset'
  | 'exportVideoTransform'
  | 'exportCropPreset'
  | 'exportTwoPass'
  | 'exportEconomyMode'
  | 'exportHwaccelDecodeForPreview'
  | 'exportExtraArgsParsed'
  | 'exportAudioGainDb'
  | 'exportStripMetadata'
  | 'exportStripChapters'
  | 'exportSubtitleMode'
  | 'exportVideoDeinterlace'
  | 'exportVideoDenoise'
  | 'exportVideoDeband'
  | 'exportVideoHisteq'
  | 'lutCubePathForPreview'
  | 'exportVideoSharpen'
  | 'exportVideoEqPreset'
  | 'exportVideoHue'
  | 'exportVideoGrain'
  | 'exportVideoVignette'
  | 'exportVideoBlur'
  | 'exportAudioNormalize'
>

export type { FfmpegExportPreviewInput }
