/**
 * §6.4 — чистые парсеры строкового вывода yt-dlp.
 *
 * Этот модуль сознательно изолирован от Electron/IPC/FS, чтобы покрываться юнит-тестами
 * прямо в Node без `electron`-runtime. Все «грязные» сервисы (`ytdlp-download-service`,
 * `downloads-queue-runner`) импортируют функции отсюда.
 */

/** Поля прогресса из строк stderr/stdout yt-dlp с префиксом «[download]». */
export interface YtdlpDownloadProgressParts {
  percent: string | null
  speed: string | null
  eta: string | null
}

/** Грубая классификация текста ошибки для §6.4 (без IPC; только эвристика). */
export type YtdlpQueueFailureKind = 'transient_network' | 'likely_source_block' | 'unknown'

/**
 * Разбор строки прогресса yt-dlp для колонки таблицы §6.1.
 * Не shell и не исполнение — только эвристика по тексту.
 */
export function parseYtdlpDownloadProgressLine(line: string): YtdlpDownloadProgressParts | null {
  const t = line.trimEnd()
  if (!t.includes('[download]')) {
    return null
  }
  // «Destination: …» без процентов — не колонка прогресса
  if (/destination:/i.test(t) && !/\d+(?:\.\d+)?%/.test(t)) {
    return null
  }

  const fragMatch = t.match(/\bfragment\s+(\d+)\s+of\s+(\d+)\b/i)
  if (fragMatch) {
    const a = fragMatch[1]
    const b = fragMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: `фрагмент ${a}/${b}`,
        eta: null
      }
    }
  }

  const pctMatch = t.match(/(\d+(?:\.\d+)?)%/)
  const percent = pctMatch ? `${pctMatch[1]}%` : null

  let speed: string | null = null
  let eta: string | null = null

  const etaMatch = t.match(/\bETA\s+(\S+)/i)
  if (etaMatch) {
    const token = etaMatch[1]
    if (token !== undefined) {
      eta = token
    }
  }

  const atEtaMatch = t.match(/\bat\s+(.+?)\s+ETA\s+/i)
  if (atEtaMatch) {
    const chunk = atEtaMatch[1]
    if (chunk !== undefined) {
      speed = chunk.trim().replace(/\s+/g, ' ')
    }
  } else {
    const atTailMatch = t.match(/\bin\s+[\d:.]+\s+at\s+(.+?)\s*$/i)
    if (atTailMatch) {
      const chunk = atTailMatch[1]
      if (chunk !== undefined) {
        speed = chunk.trim().replace(/\s+/g, ' ')
      }
    }
  }

  if (!percent && !speed) {
    return null
  }

  return { percent, speed, eta }
}

/** Компактная подпись для ячейки: «42.1% · 1.2MiB/s · ETA 00:15». */
export function formatYtdlpProgressCell(parts: YtdlpDownloadProgressParts): string {
  const bits: string[] = []
  if (parts.percent) {
    bits.push(parts.percent)
  }
  const spd = parts.speed?.trim() ?? ''
  if (spd.length > 0 && !/^unknown(\s+speed)?$/i.test(spd)) {
    bits.push(spd)
  }
  const et = parts.eta?.trim() ?? ''
  if (et.length > 0 && !/^unknown$/i.test(et)) {
    bits.push(`ETA ${et}`)
  }
  return bits.join(' · ')
}

function ytdlpQueueFailureKindSuffix(kind: YtdlpQueueFailureKind): string {
  switch (kind) {
    case 'transient_network':
      return ' · вероятно сеть'
    case 'likely_source_block':
      return ' · отказ источника'
    default:
      return ''
  }
}

/**
 * Текст статуса строки очереди §6.1 при неуспешном yt-dlp: код выхода или сигнал ОС,
 * плюс краткая подсказка из `ERROR:` или последней строки stderr (если явной ошибки не было).
 * `failureKind` — необязательная подпись по эвристике §6.4 (`classifyYtdlpQueueFailureKind`).
 */
export function formatYtdlpQueueFailureStatus(
  exitCode: number | null | undefined,
  signal: NodeJS.Signals | null | undefined,
  errorHint: string | null | undefined,
  stderrFallback: string | null | undefined,
  failureKind?: YtdlpQueueFailureKind
): string {
  let base: string
  if (exitCode === null && signal) {
    base = `Ошибка (сигнал ${signal})`
  } else {
    const code = exitCode ?? '?'
    base = `Ошибка (код ${code})`
  }

  const primary = errorHint?.trim() ?? ''
  const fallback = stderrFallback?.trim() ?? ''
  const hint = primary.length > 0 ? primary : fallback

  const body = hint.length === 0 ? base : `${base}: ${hint}`
  const suf =
    failureKind !== undefined && failureKind !== 'unknown'
      ? ytdlpQueueFailureKindSuffix(failureKind)
      : ''
  const full = suf.length > 0 ? `${body}${suf}` : body
  return full.length > 200 ? `${full.slice(0, 199)}…` : full
}

/**
 * §6.4 — не тратить повторы **очереди** на типичные «устойчивые» отказы источника (private, 403/404 и т.д.).
 * Консервативно: только явные подстроки в нижнем регистре; транзиентные сетевые ошибки не матчим.
 */
const YTDLP_QUEUE_RETRY_SKIP_MARKERS = [
  'private video',
  'members only',
  'video unavailable',
  'this video is not available',
  'video has been removed',
  'is no longer available',
  'http error 403',
  'http error 404',
  'sign in to confirm your age',
  'login required',
  'blocked it on copyright'
] as const

/**
 * Типичные транзиентные сбои (сеть/CDN): повторы очереди оставляем, даже если рядом шумный текст.
 * Имеет приоритет над маркерами «не повторять» (консервативный порядок проверки).
 */
const YTDLP_QUEUE_RETRY_KEEP_TRYING_MARKERS = [
  'unable to download webpage',
  'unable to download video',
  'connection timed out',
  'connection reset',
  'connection refused',
  'timed out',
  'temporary failure',
  'temporary error',
  'network is unreachable',
  'no route to host',
  'name or service not known',
  'failed to resolve',
  'http error 503',
  'http error 502',
  'http error 429',
  'too many requests',
  'got server http error',
  'certificate verify failed',
  'ssl: ',
  'errno 110',
  'errno 113'
] as const

export function classifyYtdlpQueueFailureKind(
  errorSummary: string | null | undefined,
  stderrFallback: string | null | undefined
): YtdlpQueueFailureKind {
  const haystack = `${errorSummary ?? ''}\n${stderrFallback ?? ''}`.toLowerCase()
  if (YTDLP_QUEUE_RETRY_KEEP_TRYING_MARKERS.some((m) => haystack.includes(m))) {
    return 'transient_network'
  }
  if (YTDLP_QUEUE_RETRY_SKIP_MARKERS.some((m) => haystack.includes(m))) {
    return 'likely_source_block'
  }
  return 'unknown'
}

export function shouldSkipYtdlpQueueRetriesAfterFailure(
  errorSummary: string | null | undefined,
  stderrFallback: string | null | undefined
): boolean {
  return classifyYtdlpQueueFailureKind(errorSummary, stderrFallback) === 'likely_source_block'
}

/**
 * Последняя осмысленная строка об ошибке из stdout/stderr yt-dlp для статуса §6.4.
 * Не исполняет код — только эвристика по тексту.
 */
export function extractYtdlpErrorSummary(line: string): string | null {
  const t = line.trimEnd()
  const m = t.match(/\bERROR:\s*(.+)$/i)
  if (!m) {
    return null
  }
  const rawMsg = m[1]
  if (rawMsg === undefined) {
    return null
  }
  const msg = rawMsg.trim()
  if (msg.length === 0) {
    return null
  }
  return msg.length > 200 ? `${msg.slice(0, 198)}…` : msg
}

function unquoteYtdlpPath(raw: string): string {
  const t = raw.trim()
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1)
  }
  return t
}

/**
 * Best-effort извлечение фактического файла из обычных строк yt-dlp.
 * Не добавляем новых argv-флагов, чтобы не ломать старые версии yt-dlp; ловим типовые сообщения.
 */
export function extractYtdlpOutputPath(line: string): string | null {
  const t = line.trim()
  const destination = t.match(/^\[(?:download|ExtractAudio)]\s+Destination:\s+(.+)$/i)
  if (destination) {
    const cap = destination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const alreadyDownloaded = t.match(/^\[download]\s+(.+?)\s+has already been downloaded$/i)
  if (alreadyDownloaded) {
    const cap = alreadyDownloaded[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const merging = t.match(/^\[Merger]\s+Merging formats into\s+(.+)$/i)
  if (merging) {
    const cap = merging[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const moving = t.match(/^\[MoveFiles]\s+Moving file\s+.+?\s+to\s+(.+)$/i)
  if (moving) {
    const cap = moving[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  return null
}
