import { existsSync, readdirSync, statSync, unlinkSync } from 'fs'
import { basename, dirname, extname, isAbsolute, join, normalize, relative, resolve } from 'path'

import { isYtdlpQueueStatusDone, isYtdlpQueueStatusWaiting } from '../shared/ytdlp-queue-status'

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

/** Использовать ли встроенный путь `app-data/downloads/ytdlp`. */
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

const YTDLP_PARTIAL_SUFFIXES = ['.part', '.ytdl', '.temp', '.tmp'] as const

export type YtdlpFolderRevealTarget =
  | { kind: 'file'; path: string }
  | { kind: 'directory'; path: string }

/**
 * Цель для «показать в папке» / открыть каталог вывода: готовый файл, частичная загрузка
 * или родительский каталог ожидаемого пути (пока финальный файл ещё не записан).
 */
export function resolveYtdlpFolderRevealTarget(
  raw: unknown,
  userDataRoot: string
): YtdlpFolderRevealTarget | null {
  const outDir = resolve(resolveYtdlpOutputDirectory(userDataRoot))
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return { kind: 'directory', path: outDir }
  }
  if (!isAbsolute(raw) || raw.length > 4096) {
    return null
  }
  const file = resolve(raw.trim())
  const parent = dirname(file)
  if (!isInsideDirectory(outDir, file) && !isInsideDirectory(outDir, parent) && parent !== outDir) {
    return null
  }
  const ready = resolveAllowedYtdlpDownloadOutputFile(raw, userDataRoot)
  if (ready) {
    return { kind: 'file', path: ready }
  }
  for (const suffix of YTDLP_PARTIAL_SUFFIXES) {
    const partial = `${file}${suffix}`
    try {
      if (existsSync(partial) && statSync(partial).isFile()) {
        return { kind: 'file', path: partial }
      }
    } catch {
      /* ignore */
    }
  }
  const dirResolved = resolve(parent)
  if (dirResolved === outDir || isInsideDirectory(outDir, dirResolved)) {
    return { kind: 'directory', path: dirResolved }
  }
  return { kind: 'directory', path: outDir }
}

function tryUnlinkFileInsideYtdlpOutDir(absPath: string, outDirResolved: string): void {
  const resolved = resolve(absPath.trim())
  if (!isInsideDirectory(outDirResolved, resolved)) {
    return
  }
  try {
    if (existsSync(resolved) && statSync(resolved).isFile()) {
      unlinkSync(resolved)
    }
  } catch {
    /* ignore */
  }
}

/** Глубина обхода подкаталогов для `*.part` / `*.ytdl`: 2 — корень и до двух уровней вложенности под ним. */
const YTDLP_PARTIAL_SWEEP_MAX_DEPTH = 2

/** Удаляет только верхнеуровневые в `dir` `*.part` / `*.ytdl`, каждый путь проверяется относительно `outDirResolved`. */
function tryUnlinkLooseYtdlpPartialsInDir(dir: string, outDirResolved: string): void {
  let ents: import('fs').Dirent[]
  try {
    ents = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  const dirResolved = resolve(dir)
  if (dirResolved !== outDirResolved && !isInsideDirectory(outDirResolved, dirResolved)) {
    return
  }
  for (const e of ents) {
    if (!e.isFile()) {
      continue
    }
    const lower = e.name.toLowerCase()
    if (!lower.endsWith('.part') && !lower.endsWith('.ytdl')) {
      continue
    }
    tryUnlinkFileInsideYtdlpOutDir(join(dirResolved, e.name), outDirResolved)
  }
}

function sweepLooseYtdlpPartialsUnderOutputRoot(outDirResolved: string, maxDepth: number): void {
  const walk = (dir: string, depthLeft: number): void => {
    const dirResolved = resolve(dir)
    if (dirResolved !== outDirResolved && !isInsideDirectory(outDirResolved, dirResolved)) {
      return
    }
    tryUnlinkLooseYtdlpPartialsInDir(dirResolved, outDirResolved)
    if (depthLeft <= 0) {
      return
    }
    let subEnts: import('fs').Dirent[]
    try {
      subEnts = readdirSync(dirResolved, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of subEnts) {
      if (!e.isDirectory()) {
        continue
      }
      const subResolved = resolve(join(dirResolved, e.name))
      if (!isInsideDirectory(outDirResolved, subResolved)) {
        continue
      }
      walk(subResolved, depthLeft - 1)
    }
  }
  walk(outDirResolved, maxDepth)
}

/**
 * Удаляет незавершённый вывод yt-dlp для строки очереди (после отмены / удаления строки).
 * Не трогает файлы со статусом «Готово».
 * Для статуса не «Ожидание»: дополнительно удаляет `*.part` и `*.ytdl` под корнем вывода yt-dlp
 * с обходом подкаталогов до двух уровней вложенности (типичные шаблоны `-o` с подпапками; очередь последовательная §6).
 */
export function deleteIncompleteDownloadArtifactsForQueueRow(
  userDataRoot: string,
  row: { status: string; outputPath?: string; url?: string }
): void {
  if (isYtdlpQueueStatusDone(row.status)) {
    return
  }
  const outDir = resolve(resolveYtdlpOutputDirectory(userDataRoot))
  const op = row.outputPath?.trim()
  if (op && op.length > 0) {
    tryUnlinkFileInsideYtdlpOutDir(op, outDir)
    tryUnlinkFileInsideYtdlpOutDir(`${op}.part`, outDir)
  }
  if (isYtdlpQueueStatusWaiting(row.status)) {
    return
  }
  sweepLooseYtdlpPartialsUnderOutputRoot(outDir, YTDLP_PARTIAL_SWEEP_MAX_DEPTH)
}
