import type { FfmpegSnapshotFormatId } from './ffmpeg-snapshot-contract'

export function parseFfmpegSnapshotFormatId(raw: unknown): FfmpegSnapshotFormatId {
  if (raw === 'jpg' || raw === 'jpeg') {
    return 'jpg'
  }
  if (raw === 'webp') {
    return 'webp'
  }
  return 'png'
}
