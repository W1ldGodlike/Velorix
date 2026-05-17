import type { MediaProbeChapterRow } from './ffprobe-contract'

/**
 * Выделено из main ffprobe §9: разбор массива `chapters` из JSON ffprobe (`-show_chapters`).
 * Использует `start_time` / `end_time` (секунды), как выдаёт ffprobe.
 */

function parseChapterSeconds(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) {
    return v
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseFloat(v.trim())
    return Number.isFinite(n) ? n : null
  }
  return null
}

function chapterTitleFromTags(tags: unknown): string | null {
  if (!tags || typeof tags !== 'object') {
    return null
  }
  const t = (tags as Record<string, unknown>)['title']
  return typeof t === 'string' && t.trim() !== '' ? t.trim() : null
}

/** Smoke §9/§19: корневой `chapters` из ffprobe JSON (`-show_chapters`). */
export function isFfprobeChaptersArrayOkForSmoke(chapters: unknown): boolean {
  if (chapters === undefined || chapters === null) {
    return true
  }
  if (!Array.isArray(chapters)) {
    return false
  }
  for (const raw of chapters) {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
      return false
    }
    const o = raw as Record<string, unknown>
    const tags = o['tags']
    if (tags !== undefined && tags !== null && (typeof tags !== 'object' || Array.isArray(tags))) {
      return false
    }
    const startRaw = o['start_time'] ?? o['start']
    const endRaw = o['end_time'] ?? o['end']
    const hasStart =
      startRaw !== undefined && startRaw !== null && String(startRaw).trim() !== ''
    const hasEnd = endRaw !== undefined && endRaw !== null && String(endRaw).trim() !== ''
    if (hasStart && parseChapterSeconds(startRaw) === null) {
      return false
    }
    if (hasEnd && parseChapterSeconds(endRaw) === null) {
      return false
    }
  }
  buildChapterRowsFromFfprobeJson(chapters)
  return true
}

/** Строит строки глав для IPC/UI; при ошибках полей строка пропускается. */
export function buildChapterRowsFromFfprobeJson(chapters: unknown): MediaProbeChapterRow[] {
  if (!Array.isArray(chapters)) {
    return []
  }
  const rows: MediaProbeChapterRow[] = []
  let fallbackIndex = 0
  for (const raw of chapters) {
    if (!raw || typeof raw !== 'object') {
      continue
    }
    const o = raw as Record<string, unknown>
    const startSec = parseChapterSeconds(o['start_time']) ?? parseChapterSeconds(o['start'])
    const endSec = parseChapterSeconds(o['end_time']) ?? parseChapterSeconds(o['end'])
    if (startSec === null || endSec === null) {
      continue
    }
    const idRaw = o['id']
    let resolvedIndex: number
    if (typeof idRaw === 'number' && Number.isFinite(idRaw)) {
      resolvedIndex = idRaw
    } else if (typeof idRaw === 'string' && idRaw.trim() !== '') {
      const parsed = Number.parseInt(idRaw.trim(), 10)
      resolvedIndex = Number.isFinite(parsed) ? parsed : fallbackIndex++
    } else {
      resolvedIndex = fallbackIndex++
    }
    rows.push({
      index: resolvedIndex,
      startSec,
      endSec,
      title: chapterTitleFromTags(o['tags'])
    })
  }
  rows.sort((a, b) => (a.startSec !== b.startSec ? a.startSec - b.startSec : a.index - b.index))
  return rows
}
