import { join, isAbsolute, normalize } from 'path'

/** Абсолютный override из `settings.json`; `null` — каталог по умолчанию §6.2. */
let overrideAbsolute: string | null = null

/** Синхронизация с загрузкой/сохранением настроек (main). */
export function syncYtdlpDownloadDirectoryFromSettings(raw: string | undefined): void {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    overrideAbsolute = null
    return
  }
  const n = normalize(raw.trim())
  overrideAbsolute = isAbsolute(n) ? n : null
}

export function getYtdlpDownloadDirectoryOverride(): string | null {
  return overrideAbsolute
}

/** Использовать ли встроенный путь `userData/downloads/ytdlp`. */
export function isYtdlpDownloadDirectoryDefault(): boolean {
  return overrideAbsolute === null
}

export function resolveYtdlpOutputDirectory(userDataRoot: string): string {
  if (overrideAbsolute !== null) {
    return overrideAbsolute
  }
  return join(userDataRoot, 'downloads', 'ytdlp')
}
