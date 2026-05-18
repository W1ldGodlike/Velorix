/** §10 — расширения файлов для мониторинга папки (не рекурсивно). */
export const WATCH_FOLDER_MEDIA_EXTENSIONS = [
  '.mp4',
  '.mkv',
  '.mov',
  '.webm',
  '.m4v',
  '.avi',
  '.mpg',
  '.mpeg',
  '.wmv',
  '.ts',
  '.m2ts'
] as const

export function isWatchFolderMediaFileName(fileName: string): boolean {
  const lower = fileName.toLowerCase()
  return WATCH_FOLDER_MEDIA_EXTENSIONS.some((ext) => lower.endsWith(ext))
}
