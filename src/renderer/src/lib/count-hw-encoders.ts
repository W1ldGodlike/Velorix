import {
  FFMPEG_HW_VIDEO_ENCODER_IDS,
  type FfmpegHwEncodersSnapshot
} from '../../../shared/ffmpeg-hw-encoder-probe'

export function countHwEncoders(snapshot: FfmpegHwEncodersSnapshot): number {
  let count = 0
  for (const id of FFMPEG_HW_VIDEO_ENCODER_IDS) {
    if (snapshot[id]) {
      count += 1
    }
  }
  return count
}
