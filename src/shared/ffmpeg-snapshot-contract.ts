/** Формат файла снимка кадра §7.6 (persisted в settings + save dialog). */

export const FFMPEG_SNAPSHOT_FORMAT_IDS = ['png', 'jpg', 'webp', 'bmp', 'tiff'] as const

export type FfmpegSnapshotFormatId = (typeof FFMPEG_SNAPSHOT_FORMAT_IDS)[number]
