import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getYtdlpQueueProgressStrings } from '../../../shared/ytdlp-queue-progress-locale'

function isYtdlpInfoLine(t: string): boolean {
  return /^\[[iI][nN][fF][oO]\]/.test(t)
}

function truncateYtdlpQueueCellSnippet(s: string): string {
  if (s.length === 0) {
    return s
  }
  return s.length <= 56 ? s : `${s.slice(0, 54)}…`
}

function normalizeYtdlpApproxSizeToken(raw: string): string | null {
  const collapsed = raw
    .trim()
    .replace(/^~+/, '')
    .replace(/[,;.]+$/, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
  if (/^[\d.]+[KMGT]?iB$/i.test(collapsed) || /^[\d.]+[KMGT]?B$/i.test(collapsed)) {
    return collapsed
  }
  return null
}

export function unquoteYtdlpPath(raw: string): string {
  const t = raw.trim()
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1)
  }
  return t
}

function ytdlpOutputExtension(rawPath: string): string | null {
  const path = unquoteYtdlpPath(rawPath)
  const base = path.replace(/^.*[/\\]/, '')
  const dot = base.lastIndexOf('.')
  if (dot < 1 || dot >= base.length - 1) {
    return null
  }
  const ext = base.slice(dot + 1).toLowerCase()
  return /^[a-z0-9]{1,12}$/.test(ext) ? ext : null
}

function ytdlpFormatHintFromOutputPath(prefix: string, rawPath: string): string | null {
  const ext = ytdlpOutputExtension(rawPath)
  return ext === null ? null : truncateYtdlpQueueCellSnippet(`${prefix} → ${ext}`)
}

/**
 * §6/v0 — краткая подпись целевого формата из строк yt-dlp `[info] … Downloading N format(s): …`.
 */
/**
 * §6/v0 — фрагмент до `: Downloading N format(s)` в `[info]` для колонки «Название» (не сырой id ролика YouTube).
 */
export function parseYtdlpInfoDownloadingTitlePrefix(line: string): string | null {
  const t = line.trimEnd()
  if (!isYtdlpInfoLine(t)) {
    return null
  }
  const m = t.match(/^\[info\]\s+(.+?):\s+Downloading\s+\d+\s+format(?:\(s\))?/i)
  const raw = m?.[1]?.trim()
  if (!raw || raw.length < 2) {
    return null
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) {
    return null
  }
  return raw.length > 240 ? `${raw.slice(0, 238)}…` : raw
}

export function parseYtdlpInfoFormatSnippet(line: string): string | null {
  const t = line.trimEnd()
  if (!isYtdlpInfoLine(t)) {
    return null
  }
  const m1 = t.match(/Downloading\s+\d+\s+format\(s\):\s*(.+)$/i)
  const cap1 = m1?.[1]
  if (cap1) {
    const s = cap1.trim()
    if (s.length > 0) {
      return truncateYtdlpQueueCellSnippet(s)
    }
  }
  const m2 = t.match(/\bDownloading\s+video\s+in\s+format\s+(\d+(?:\+\d+)*)\b/i)
  const id = m2?.[1]
  if (id && id.length > 0) {
    return truncateYtdlpQueueCellSnippet(id.trim())
  }
  return null
}

/**
 * §6/v0 — подпись колонки «Формат»: `[info]` (см. `parseYtdlpInfoFormatSnippet`)
 * плюс типичные строки post-processing (`merge`, audio extract, remux/convert).
 */
export function parseYtdlpQueueFormatHint(line: string, locale: AppUiLocale = 'ru'): string | null {
  const P = getYtdlpQueueProgressStrings(locale)
  const fromInfo = parseYtdlpInfoFormatSnippet(line)
  if (fromInfo) {
    return fromInfo
  }
  const t = line.trimEnd()
  const mm = t.match(/^\[(?:Merger|ffmpeg)]\s+Merging formats into\s+(.+)$/i)
  const tail = mm?.[1]
  if (tail) {
    return ytdlpFormatHintFromOutputPath(P.formatHintMerge, tail)
  }

  const extractAudio = t.match(/^\[ExtractAudio]\s+Destination:\s+(.+)$/i)
  const audioPath = extractAudio?.[1]
  if (audioPath) {
    return ytdlpFormatHintFromOutputPath(P.formatHintAudio, audioPath)
  }

  const remux = t.match(/^\[(?:VideoRemuxer|FFmpegVideoRemuxer)]\s+.+?\s+into\s+(.+)$/i)
  const remuxPath = remux?.[1]
  if (remuxPath) {
    return ytdlpFormatHintFromOutputPath(P.formatHintRemux, remuxPath)
  }

  const convert = t.match(
    /^\[(?:FFmpegVideoConvertor|VideoConvertor)]\s+.+;\s+Destination:\s+(.+)$/i
  )
  const convertPath = convert?.[1]
  if (convertPath) {
    return ytdlpFormatHintFromOutputPath(P.formatHintConvert, convertPath)
  }

  return null
}

/**
 * §6/v0 — приблизительный размер из `[info] … Filesize …` до появления `% of …` в `[download]`.
 * Не перезаписывает уже выставленный из прогресса `queueSize` (см. runner).
 */
export function parseYtdlpInfoQueueSizeHint(line: string): string | null {
  const t = line.trimEnd()
  if (!isYtdlpInfoLine(t)) {
    return null
  }
  const patterns: RegExp[] = [
    /\bApproximate\s+filesize\b[:\s]+(\S+)/i,
    /\bFilesize\s+approx(?:imate)?[:\s]+(\S+)/i,
    /\bEstimated\s+filesize\b[:\s]+(\S+)/i,
    /\bTotal\s+estimated\s+download\s+size\b[:\s]+(\S+)/i,
    /\bFilesize\s+is\s+(\S+)/i,
    /\bFilesize\b[:\s]+(\S+)/i
  ]
  for (const re of patterns) {
    const m = t.match(re)
    const tok = m?.[1]
    if (tok === undefined) {
      continue
    }
    const norm = normalizeYtdlpApproxSizeToken(tok)
    if (norm) {
      return norm
    }
  }
  return null
}
