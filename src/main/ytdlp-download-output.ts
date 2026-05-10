import { existsSync, readdirSync, statSync } from 'fs'
import { basename, extname, isAbsolute, join, normalize, relative, resolve } from 'path'

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

const MEDIA_OUTPUT_EXTENSIONS = new Set([
  '.3gp',
  '.aac',
  '.flac',
  '.m4a',
  '.m4v',
  '.mkv',
  '.mov',
  '.mp3',
  '.mp4',
  '.ogg',
  '.opus',
  '.wav',
  '.webm'
])

function isInsideDirectory(root: string, candidate: string): boolean {
  const rel = relative(root, candidate)
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

function extractBracketedMediaId(rawPath: string): string | null {
  const name = basename(rawPath)
  const matches = [...name.matchAll(/\[([A-Za-z0-9_-]{6,128})]/g)]
  const last = matches.at(-1)
  const id = last?.[1]
  return id && id.trim().length > 0 ? id : null
}

function resolveExistingSiblingByMediaId(outDir: string, rawPath: string): string | null {
  const mediaId = extractBracketedMediaId(rawPath)
  if (!mediaId) {
    return null
  }
  const candidates: Array<{ path: string; mtimeMs: number; size: number }> = []

  function visit(dir: string, depth: number): void {
    if (depth > 2) {
      return
    }
    let entries: import('fs').Dirent[]
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        visit(full, depth + 1)
        continue
      }
      if (!entry.isFile() || !entry.name.includes(`[${mediaId}]`)) {
        continue
      }
      const ext = extname(entry.name).toLowerCase()
      if (!MEDIA_OUTPUT_EXTENSIONS.has(ext)) {
        continue
      }
      try {
        const st = statSync(full)
        if (!st.isFile()) {
          continue
        }
        candidates.push({ path: full, mtimeMs: st.mtimeMs, size: st.size })
      } catch {
        /* ignore vanished files */
      }
    }
  }

  visit(outDir, 0)
  const best = candidates.sort((a, b) => b.mtimeMs - a.mtimeMs || b.size - a.size)[0]
  return best?.path ?? null
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
  if (!isInsideDirectory(outDir, file)) {
    return null
  }
  try {
    if (existsSync(file) && statSync(file).isFile()) {
      return file
    }
  } catch {
    /* fall through to best-effort lookup below */
  }
  return resolveExistingSiblingByMediaId(outDir, file)
}
