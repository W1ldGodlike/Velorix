/**
 * §7.3 — расширения видео для пакетного экспорта (shared, без Node).
 */

export const FFMPEG_EXPORT_BATCH_VIDEO_EXTENSIONS = [
  'mp4',
  'mkv',
  'webm',
  'mov',
  'avi',
  'm4v',
  'wmv',
  'mpeg',
  'mpg',
  'ts'
] as const

export type FfmpegExportBatchVideoExtension = (typeof FFMPEG_EXPORT_BATCH_VIDEO_EXTENSIONS)[number]

export function isFfmpegExportBatchVideoExtension(
  ext: string
): ext is FfmpegExportBatchVideoExtension {
  return (FFMPEG_EXPORT_BATCH_VIDEO_EXTENSIONS as readonly string[]).includes(ext)
}

export function isFfmpegExportBatchVideoPath(filePath: string): boolean {
  const dot = filePath.lastIndexOf('.')
  if (dot < 0) {
    return false
  }
  return isFfmpegExportBatchVideoExtension(filePath.slice(dot + 1).toLowerCase())
}
