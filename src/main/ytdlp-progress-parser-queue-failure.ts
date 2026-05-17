import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getYtdlpQueueProgressStrings } from '../shared/ytdlp-queue-progress-locale'
import { YTDLP_QUEUE_STATUS_ERROR_PREFIX } from '../shared/ytdlp-queue-status'

import type { YtdlpQueueFailureKind } from './ytdlp-progress-parser-download'

function ytdlpQueueFailureKindSuffix(
  kind: YtdlpQueueFailureKind,
  locale: DownloadsWindowUiLocale
): string {
  const P = getYtdlpQueueProgressStrings(locale)
  switch (kind) {
    case 'transient_network':
      return P.failureKindTransientNetwork
    case 'likely_source_block':
      return P.failureKindSourceBlock
    case 'exit_bad_options':
      return P.failureKindBadOptions
    case 'exit_needs_restart':
      return P.failureKindNeedsRestart
    case 'exit_download_limit':
      return P.failureKindDownloadLimit
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
  failureKind?: YtdlpQueueFailureKind,
  locale: DownloadsWindowUiLocale = 'ru'
): string {
  const P = getYtdlpQueueProgressStrings(locale)
  let base: string
  if (exitCode === null && signal) {
    base = `${YTDLP_QUEUE_STATUS_ERROR_PREFIX} ${P.failureParensSignal.replace('{signal}', signal)}`
  } else {
    const code = exitCode ?? '?'
    base = `${YTDLP_QUEUE_STATUS_ERROR_PREFIX} ${P.failureParensCode.replace('{code}', String(code))}`
  }

  const primary = errorHint?.trim() ?? ''
  const fallback = stderrFallback?.trim() ?? ''
  const hint = primary.length > 0 ? primary : fallback

  const body = hint.length === 0 ? base : `${base}: ${hint}`
  const suf =
    failureKind !== undefined && failureKind !== 'unknown'
      ? ytdlpQueueFailureKindSuffix(failureKind, locale)
      : ''
  const full = suf.length > 0 ? `${body}${suf}` : body
  return full.length > 200 ? `${full.slice(0, 199)}…` : full
}

/**
 * §6.4 — не тратить повторы **очереди** на типичные «устойчивые» отказы источника (private, 403/404 и т.д.).
 * Консервативно: только явные подстроки в нижнем регистре; транзиентные сетевые ошибки не матчим.
 */
const YTDLP_QUEUE_RETRY_SKIP_MARKERS = [
  'live stream has ended',
  'premiere will begin',
  'scheduled stream',
  'private video',
  'members only',
  'video unavailable',
  'this video is not available',
  'this video may be inappropriate',
  'video has been removed',
  'is no longer available',
  'http error 403',
  'http error 404',
  'sign in to confirm your age',
  "sign in to confirm you're not a bot",
  'sign in to confirm you are not a bot',
  'login required',
  'requires login',
  'blocked it on copyright',
  'not available in your country',
  'not available from your location',
  'geo restricted',
  'geo-blocked',
  'drm protected',
  'requested format is not available',
  'no video formats found',
  'unsupported url',
  'no space left on device',
  'errno 28',
  'disk is full',
  'ffmpeg: not found',
  'ffprobe: not found',
  'unable to locate ffmpeg',
  'the downloaded file is empty',
  'file is smaller than min filesize',
  'account has been terminated',
  'video has been taken down',
  'copyright takedown',
  'blocked by uploader'
] as const

/**
 * Типичные транзиентные сбои (сеть/CDN): повторы очереди оставляем, даже если рядом шумный текст.
 * Имеет приоритет над маркерами «не повторять» (консервативный порядок проверки).
 */
const YTDLP_QUEUE_RETRY_KEEP_TRYING_MARKERS = [
  'unable to download webpage',
  'unable to download video',
  'premature close',
  'connection prematurely closed',
  'connection timed out',
  'connection reset',
  'connection reset by peer',
  'connection refused',
  'connection aborted',
  'broken pipe',
  'timed out',
  'read timed out',
  'temporary failure',
  'temporary error',
  'network is unreachable',
  'no route to host',
  'name or service not known',
  'failed to resolve',
  'remote end closed connection',
  'http error 500',
  'http error 502',
  'http error 503',
  'http error 504',
  'http error 429',
  'http error 408',
  'http error 520',
  'http error 521',
  'http error 522',
  'http error 523',
  'request timeout',
  'too many requests',
  'got server http error',
  'eof occurred in violation of protocol',
  'ssl handshake',
  'certificate verify failed',
  'ssl: ',
  'errno 110',
  'errno 113',
  'bad gateway',
  'gateway timeout',
  'service unavailable',
  'connection lost',
  // Ротация извлечения подписи на стороне YouTube и подобные временные сбои клиента yt-dlp.
  'signature extraction failed',
  'signature solve failed',
  'rate limit exceeded'
] as const

function classifyYtdlpQueueFailureKindFromText(
  errorSummary: string | null | undefined,
  stderrFallback: string | null | undefined
): 'transient_network' | 'likely_source_block' | 'unknown' {
  const haystack = `${errorSummary ?? ''}\n${stderrFallback ?? ''}`.toLowerCase()
  if (YTDLP_QUEUE_RETRY_KEEP_TRYING_MARKERS.some((m) => haystack.includes(m))) {
    return 'transient_network'
  }
  if (YTDLP_QUEUE_RETRY_SKIP_MARKERS.some((m) => haystack.includes(m))) {
    return 'likely_source_block'
  }
  return 'unknown'
}

export function classifyYtdlpQueueFailureKind(
  errorSummary: string | null | undefined,
  stderrFallback: string | null | undefined,
  exitCode?: number | null
): YtdlpQueueFailureKind {
  const textKind = classifyYtdlpQueueFailureKindFromText(errorSummary, stderrFallback)
  if (textKind !== 'unknown') {
    return textKind
  }
  if (typeof exitCode !== 'number' || !Number.isFinite(exitCode)) {
    return 'unknown'
  }
  if (exitCode === 2) {
    return 'exit_bad_options'
  }
  if (exitCode === 100) {
    return 'exit_needs_restart'
  }
  if (exitCode === 101) {
    return 'exit_download_limit'
  }
  return 'unknown'
}

/** Пропуск дальнейших повторов **очереди** для данного уже вычисленного класса. */
export function shouldSkipQueueRetriesForFailureKind(kind: YtdlpQueueFailureKind): boolean {
  return (
    kind === 'likely_source_block' ||
    kind === 'exit_bad_options' ||
    kind === 'exit_needs_restart' ||
    kind === 'exit_download_limit'
  )
}

export function shouldSkipYtdlpQueueRetriesAfterFailure(
  errorSummary: string | null | undefined,
  stderrFallback: string | null | undefined,
  exitCode?: number | null
): boolean {
  return shouldSkipQueueRetriesForFailureKind(
    classifyYtdlpQueueFailureKind(errorSummary, stderrFallback, exitCode)
  )
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
