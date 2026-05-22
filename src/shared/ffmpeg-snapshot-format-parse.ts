import type { FfmpegSnapshotFormatId } from './ffmpeg-snapshot-contract'

export function parseFfmpegSnapshotFormatId(raw: unknown): FfmpegSnapshotFormatId {
  if (raw === 'jpg' || raw === 'jpeg') {
    return 'jpg'
  }
  if (raw === 'webp') {
    return 'webp'
  }
  if (raw === 'bmp') {
    return 'bmp'
  }
  if (raw === 'tiff' || raw === 'tif') {
    return 'tiff'
  }
  return 'png'
}
