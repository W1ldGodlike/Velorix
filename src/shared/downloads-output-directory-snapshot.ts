/** §6.2 — снимок каталога вывода yt-dlp для shell-вкладки «Загрузки». */
export type DownloadsOutputDirectorySnapshot = {
  path: string
  isDefault: boolean
}

export function sanitizeDownloadsOutputDirectorySnapshot(
  raw: unknown
): DownloadsOutputDirectorySnapshot {
  if (!raw || typeof raw !== 'object') {
    return { path: '', isDefault: true }
  }
  const o = raw as Record<string, unknown>
  return {
    path: typeof o['path'] === 'string' ? o['path'] : '',
    isDefault: o['isDefault'] === true
  }
}
