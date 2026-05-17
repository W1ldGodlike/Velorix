import type { FfmpegExportContainerId, FfmpegExportVideoCodecId } from '../shared/ffmpeg-export-contract'
import {
  exportAudioModeMkvOnlyErrorMessage,
  ffmpegExportAudioModeRequiresMkv
} from '../shared/ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  exportCpuCodecMkvOnlyErrorMessage,
  exportMovOnlyCodecErrorMessage,
  ffmpegExportVideoCodecRequiresMov,
  parseFfmpegExportVideoCodec,
  pickFfmpegHwAutoEncoder,
  pickFfmpegHwAutoHevcEncoder
} from '../shared/ffmpeg-export-video-codec'
import { createEmptyFfmpegHwEncodersSnapshot } from '../shared/ffmpeg-hw-encoder-probe'
import { parseFfmpegExportAudioMode, parseFfmpegExportContainer } from '../shared/ffmpeg-export-parse-registry'
import {
  parseFfmpegExportHwDecode,
  resolveFfmpegExportHwaccelForDecode
} from '../shared/ffmpeg-export-hw-decode'
import { probeFfmpegHwEncoders } from './ffmpeg-hw-encoder-probe-main'
import type { FfmpegExportJobParams } from './ffmpeg-export-service-job-resolve-types'

export type FfmpegExportJobVideoResolve =
  | { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId }
  | {
      ok: true
      videoCodec: FfmpegExportVideoCodecId
      hwaccelDecode: string | null
      container: FfmpegExportContainerId
    }

export async function resolveFfmpegExportJobVideo(
  params: Pick<FfmpegExportJobParams, 'ffmpegPath' | 'videoCodec' | 'hwDecode' | 'audioMode' | 'container'>
): Promise<FfmpegExportJobVideoResolve> {
  const parsedVideoCodec = parseFfmpegExportVideoCodec(params.videoCodec)
  let videoCodec: FfmpegExportVideoCodecId = parsedVideoCodec
  const wantHwDecode = parseFfmpegExportHwDecode(params.hwDecode)
  let hwaccels: readonly string[] = []
  if (parsedVideoCodec === 'hw_auto' || parsedVideoCodec === 'hw_auto_hevc' || wantHwDecode) {
    let snap = createEmptyFfmpegHwEncodersSnapshot()
    try {
      const pr = await probeFfmpegHwEncoders(params.ffmpegPath)
      if (pr.ok) {
        snap = pr.snapshot
        hwaccels = pr.hwaccels
      }
    } catch {
      /* probe не обязан быть доступен — остаёмся на CPU */
    }
    if (parsedVideoCodec === 'hw_auto' || parsedVideoCodec === 'hw_auto_hevc') {
      videoCodec =
        parsedVideoCodec === 'hw_auto_hevc'
          ? pickFfmpegHwAutoHevcEncoder(snap)
          : pickFfmpegHwAutoEncoder(snap)
    }
  }
  const hwaccelDecode = wantHwDecode
    ? resolveFfmpegExportHwaccelForDecode(videoCodec, hwaccels)
    : null
  const audioMode = parseFfmpegExportAudioMode(params.audioMode)
  const container = parseFfmpegExportContainer(params.container ?? 'mp4')
  if (cpuFfmpegVideoCodecRequiresMkv(videoCodec) && container !== 'mkv') {
    return {
      ok: false,
      error: exportCpuCodecMkvOnlyErrorMessage(videoCodec),
      videoCodecUsed: videoCodec
    }
  }
  if (ffmpegExportVideoCodecRequiresMov(videoCodec) && container !== 'mov') {
    return {
      ok: false,
      error: exportMovOnlyCodecErrorMessage(videoCodec),
      videoCodecUsed: videoCodec
    }
  }
  if (ffmpegExportAudioModeRequiresMkv(audioMode) && container !== 'mkv') {
    return {
      ok: false,
      error: exportAudioModeMkvOnlyErrorMessage(audioMode),
      videoCodecUsed: videoCodec
    }
  }
  return { ok: true, videoCodec, hwaccelDecode, container }
}
