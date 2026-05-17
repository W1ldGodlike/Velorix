import type {
  FfmpegExportProgressPayload,
  FfmpegExportVideoCodecId
} from '../shared/ffmpeg-export-contract'
import { resolveFfmpegExportJobArgv } from './ffmpeg-export-service-job-resolve-argv'
import type {
  FfmpegExportJobParams,
  FfmpegExportJobResolved
} from './ffmpeg-export-service-job-resolve-types'
import { resolveFfmpegExportJobVideo } from './ffmpeg-export-service-job-resolve-video'

export type { FfmpegExportJobParams, FfmpegExportJobResolved } from './ffmpeg-export-service-job-resolve-types'

export async function resolveFfmpegExportJobPlan(
  params: FfmpegExportJobParams
): Promise<FfmpegExportJobResolved> {
  const uloc = params.uiLocale ?? 'ru'
  const video = await resolveFfmpegExportJobVideo(params)
  if (!video.ok) {
    return video
  }
  const argv = resolveFfmpegExportJobArgv(
    params,
    video.videoCodec,
    video.hwaccelDecode,
    video.container,
    uloc
  )
  if (!argv.ok) {
    return argv
  }

  const { videoCodec } = video
  const doneOk = (): { ok: true; videoCodecUsed: FfmpegExportVideoCodecId } => ({
    ok: true,
    videoCodecUsed: videoCodec
  })
  const doneErr = (
    error: string
  ): { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId } => ({
    ok: false,
    error,
    videoCodecUsed: videoCodec
  })

  const onProgressCb = params.onProgress
  const jobOnProgress =
    onProgressCb === undefined
      ? undefined
      : (p: FfmpegExportProgressPayload): void => {
          onProgressCb({ ...p, videoCodecUsed: videoCodec })
        }

  return {
    ok: true,
    videoCodec,
    wantTwoPass: argv.wantTwoPass,
    baseArgvParams: argv.baseArgvParams,
    segmentDur: argv.segmentDur,
    uloc,
    secondPassProgressMessage: argv.secondPassProgressMessage,
    ...(jobOnProgress !== undefined ? { jobOnProgress } : {}),
    doneOk,
    doneErr
  }
}
