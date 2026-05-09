import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize, relative, resolve } from 'path'

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

/**
 * §6.4 — путь к выходному файлу допустим для действий «Открыть» / «В обработчик»:
 * только абсолютный файл внутри текущего каталога загрузок yt-dlp и реально существует на диске.
 */
export function resolveAllowedYtdlpDownloadOutputFile(
  raw: unknown,
  userDataRoot: string
): string | null {
  if (typeof raw !== 'string' || raw.trim().length === 0 || raw.length > 4096) {
    return null
  }
  if (!isAbsolute(raw)) {
    return null
  }
  const outDir = resolve(resolveYtdlpOutputDirectory(userDataRoot))
  const file = resolve(raw.trim())
  const rel = relative(outDir, file)
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) {
    return null
  }
  try {
    return existsSync(file) && statSync(file).isFile() ? file : null
  } catch {
    return null
  }
}
