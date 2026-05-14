/**
 * §6.4 — чистые парсеры строкового вывода yt-dlp.
 *
 * Этот модуль сознательно изолирован от Electron/IPC/FS, чтобы покрываться юнит-тестами
 * прямо в Node без `electron`-runtime. Все «грязные» сервисы (`ytdlp-download-service`,
 * `downloads-queue-runner`) импортируют функции отсюда.
 */

import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getYtdlpQueueProgressStrings } from '../shared/ytdlp-queue-progress-locale'
import { YTDLP_QUEUE_STATUS_ERROR_PREFIX } from '../shared/ytdlp-queue-status'

/** Поля прогресса из строк stderr/stdout yt-dlp с префиксом «[download]». */
export interface YtdlpDownloadProgressParts {
  percent: string | null
  speed: string | null
  eta: string | null
  /** Размер целевого файла из фрагмента «NN% of 12.34MiB», если распознан. §6/v0 таблица. */
  sizeTotal?: string | null
}

/**
 * Число 0–100 из поля `percent` парсера, только если это строка вида «NN%» / «NN.N%».
 * Для плейлиста/фрагмента и т.п. (`percent: null`) — `null`.
 */
export function parseYtdlpProgressPercentNumber(percent: string | null): number | null {
  if (percent === null) {
    return null
  }
  const m = percent.trim().match(/^(\d+(?:\.\d+)?)%$/)
  if (!m?.[1]) {
    return null
  }
  const n = Number(m[1])
  if (!Number.isFinite(n)) {
    return null
  }
  return Math.max(0, Math.min(100, n))
}

/**
 * Классификация ошибки очереди §6.4: текст stderr + стабильные коды выхода yt-dlp
 * (см. обсуждение кодов в репозитории yt-dlp, напр. #4262: 2 / 100 / 101).
 */
export type YtdlpQueueFailureKind =
  | 'transient_network'
  | 'likely_source_block'
  | 'unknown'
  | 'exit_bad_options'
  | 'exit_needs_restart'
  | 'exit_download_limit'

/**
 * Разбор строки прогресса yt-dlp для колонки таблицы §6.1.
 * Не shell и не исполнение — только эвристика по тексту.
 */
export function parseYtdlpDownloadProgressLine(
  line: string,
  locale: DownloadsWindowUiLocale = 'ru'
): YtdlpDownloadProgressParts | null {
  const P = getYtdlpQueueProgressStrings(locale)
  const t = line.trimEnd()
  if (!t.includes('[download]')) {
    return null
  }
  // «Destination: …» без процентов — не колонка прогресса
  if (/destination:/i.test(t) && !/\d+(?:\.\d+)?%/.test(t)) {
    return null
  }

  const totalProgMatch = t.match(/\btotal\s+progress:\s*(\d+(?:\.\d+)?)%/i)
  if (totalProgMatch) {
    const p = totalProgMatch[1]
    if (p !== undefined) {
      return { percent: `${p}%`, speed: null, eta: null }
    }
  }

  const playlistMatch = t.match(/\bdownloading\s+(?:video|item)\s+(\d+)\s+of\s+(\d+)\b/i)
  if (playlistMatch) {
    const a = playlistMatch[1]
    const b = playlistMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: P.progressPlaylist.replace('{a}', a).replace('{b}', b),
        eta: null
      }
    }
  }

  /** Вариант без слова video/item: «… 3 of 10 videos …» (разные версии/локали yt-dlp). */
  const playlistVideosOnlyMatch = t.match(/\bDownloading\s+(\d+)\s+of\s+(\d+)\s+videos?\b/i)
  if (playlistVideosOnlyMatch && !/\bfragment\b/i.test(t)) {
    const a = playlistVideosOnlyMatch[1]
    const b = playlistVideosOnlyMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: P.progressPlaylist.replace('{a}', a).replace('{b}', b),
        eta: null
      }
    }
  }

  const fragMatch = t.match(/\bfragment\s+(\d+)\s+of\s+(\d+)\b/i)
  if (fragMatch) {
    const a = fragMatch[1]
    const b = fragMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: P.progressFragment.replace('{a}', a).replace('{b}', b),
        eta: null
      }
    }
  }

  /** Вариант «(frag 12/120)» без процентов в той же строке — иначе ниже разберём `%` + скорость. */
  const fragParenMatch =
    !/\d+(?:\.\d+)?%/.test(t) && t.match(/\(\s*frag\s+(\d+)\s*\/\s*(\d+)\s*\)/i)
  if (fragParenMatch) {
    const a = fragParenMatch[1]
    const b = fragParenMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: P.progressFragment.replace('{a}', a).replace('{b}', b),
        eta: null
      }
    }
  }

  /** Rate-limit / антибот: пауза перед повтором (типичная строка `[download] Sleeping …`). */
  const sleepingMatch = t.match(/\[download\]\s+Sleeping\s+([\d.]+)\s+seconds/i)
  if (sleepingMatch) {
    const sec = sleepingMatch[1]
    if (sec !== undefined) {
      return { percent: null, speed: P.progressPauseSec.replace('{sec}', sec), eta: null }
    }
  }

  if (/\[download\]\s+Waiting\s+for\s+reconnect/i.test(t)) {
    return { percent: null, speed: P.progressWaitingReconnect, eta: null }
  }

  /** Подготовка HLS/DASH без числового процента — чтобы колонка не «замирала» на пустом §6.4. */
  if (/\[download\]\s+Downloading\s+m3u8\s+information/i.test(t)) {
    return { percent: null, speed: P.progressHlsManifest, eta: null }
  }
  if (/\[download\]\s+Downloading\s+.*\bplayer\s+api\s+json\b/i.test(t)) {
    return { percent: null, speed: P.progressPlayerMetadata, eta: null }
  }
  if (/\[download\]\s+Downloading\s+webpage\b/i.test(t)) {
    return { percent: null, speed: P.progressWebpage, eta: null }
  }

  /** Некоторые версии пишут общее «ожидание …» без явного reconnect/sleep. */
  if (
    /\[download\]\s+Waiting\s+for\s+/i.test(t) &&
    !/\[download\]\s+Waiting\s+for\s+reconnect/i.test(t)
  ) {
    return { percent: null, speed: P.progressWaiting, eta: null }
  }

  /** Продолжение частично скачанного файла — без процентов в строке §6.4. */
  if (/\[download\]\s+Resuming download at byte\s+\d+/i.test(t)) {
    return { percent: null, speed: P.progressResume, eta: null }
  }

  /** Повторы внутри yt-dlp после сетевых/HTTP ошибок: полезно видеть счётчик без чтения raw-лога. */
  const retryingMatch = t.match(
    /\bRetrying(?:\s+fragment\s+(\d+))?\s*\((?:(\d+)\s*\/\s*(\d+)|attempt\s+(\d+)\s+of\s+(\d+))\)/i
  )
  if (retryingMatch) {
    const frag = retryingMatch[1]
    const a = retryingMatch[2] ?? retryingMatch[4]
    const b = retryingMatch[3] ?? retryingMatch[5]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed:
          frag !== undefined
            ? P.progressRetryFragment.replace('{frag}', frag).replace('{a}', a).replace('{b}', b)
            : P.progressRetry.replace('{a}', a).replace('{b}', b),
        eta: null
      }
    }
  }

  const retryingInMatch = t.match(/\bRetrying\s+in\s+([\d.]+)\s+seconds/i)
  if (retryingInMatch) {
    const sec = retryingInMatch[1]
    if (sec !== undefined) {
      return { percent: null, speed: P.progressRetryInSec.replace('{sec}', sec), eta: null }
    }
  }

  const pctMatch = t.match(/(\d+(?:\.\d+)?)%/)
  const percent = pctMatch ? `${pctMatch[1]}%` : null

  let sizeTotal: string | null = null
  if (percent !== null && /\d+(?:\.\d+)?%\s+of\s+/i.test(t)) {
    const ofSm = t.match(/\b\d+(?:\.\d+)?%\s+of\s+~?\s*(\S+)/i)
    const rawTok = ofSm?.[1]
    if (rawTok !== undefined) {
      const raw = rawTok.replace(/^~+/, '').replace(/[,;.]+$/, '')
      if (/^[\d.]+\s*[KMGT]?iB$/i.test(raw) || /^[\d.]+\s*[KMGT]?B$/i.test(raw)) {
        sizeTotal = raw.replace(/\s+/g, '')
      }
    }
  }

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

  const parts: YtdlpDownloadProgressParts = { percent, speed, eta }
  if (sizeTotal !== null && sizeTotal.length > 0) {
    parts.sizeTotal = sizeTotal
  }
  return parts
}

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
export function parseYtdlpQueueFormatHint(
  line: string,
  locale: DownloadsWindowUiLocale = 'ru'
): string | null {
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

const SPEED_TOKEN_RE = /^([\d.,]+)\s*(KiB|MiB|GiB|TiB|KB|MB|GB|TB|B)\/s$/i

/**
 * Разбор скорости yt-dlp вида `1.20MiB/s`, `999.36KiB/s`, `Unknown B/s` → байт/с.
 * Строки статуса («фрагмент», «плейлист») не матчатся и дают `null`.
 */
export function parseYtdlpSpeedToBytesPerSec(raw: string): number | null {
  const collapsed = raw.trim().replace(/\s+/g, '')
  if (collapsed.length === 0 || /^unknown/i.test(collapsed)) {
    return null
  }
  const m = collapsed.match(SPEED_TOKEN_RE)
  if (!m) {
    return null
  }
  const numRaw = m[1]
  const unit = m[2]
  if (numRaw === undefined || unit === undefined) {
    return null
  }
  const n = Number(numRaw.replace(',', '.'))
  if (!Number.isFinite(n) || n < 0) {
    return null
  }
  const u = unit.toUpperCase()
  const scale =
    u === 'B'
      ? 1
      : u === 'KIB' || u === 'KB'
        ? 1024
        : u === 'MIB' || u === 'MB'
          ? 1024 ** 2
          : u === 'GIB' || u === 'GB'
            ? 1024 ** 3
            : u === 'TIB' || u === 'TB'
              ? 1024 ** 4
              : null
  if (scale === null) {
    return null
  }
  return n * scale
}

/**
 * Скорость в стиле типичного торрент-клиента: **MB/s** и **KB/s** (десятичные ×1000), без «MiB».
 */
export function formatTorrentStyleSpeedFromBps(bytesPerSec: number): string {
  const bps = Math.max(0, bytesPerSec)
  if (bps >= 1_000_000) {
    const v = bps / 1_000_000
    const s = v >= 100 ? v.toFixed(0) : v.toFixed(1)
    return `${s} MB/s`
  }
  if (bps >= 1000) {
    const v = bps / 1000
    const s = v >= 100 ? v.toFixed(0) : v.toFixed(1)
    return `${s} KB/s`
  }
  if (bps > 0) {
    return `${Math.round(bps)} B/s`
  }
  return '0 B/s'
}

/**
 * Подпись строки очереди из финального пути yt-dlp: basename без расширения и без хвоста ` [video_id]`.
 */
export function displayLabelFromYtdlpOutputPath(rawPath: string): string | null {
  const t = rawPath.trim()
  if (t.length === 0) {
    return null
  }
  const normalized = t.replace(/[/\\]+$/, '')
  const sep = normalized.includes('\\') ? '\\' : '/'
  const parts = normalized.split(sep)
  const base = parts[parts.length - 1] ?? ''
  if (base.length < 2) {
    return null
  }
  const dot = base.lastIndexOf('.')
  const stem = dot > 0 ? base.slice(0, dot) : base
  const cleaned = stem.replace(/\s+\[[A-Za-z0-9_-]{6,32}\]\s*$/, '').trim()
  if (cleaned.length < 2) {
    return null
  }
  return cleaned.length > 200 ? `${cleaned.slice(0, 198)}…` : cleaned
}

/** Компактная подпись для ячейки: «42.1% · 1.2 MiB/s · Осталось 00:15». */
export function formatYtdlpProgressCell(
  parts: YtdlpDownloadProgressParts,
  locale: DownloadsWindowUiLocale = 'ru'
): string {
  const P = getYtdlpQueueProgressStrings(locale)
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
    bits.push(P.progressCellEta.replace('{eta}', et))
  }
  return bits.join(' · ')
}

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
  /** `Destination:` встречается у download, ExtractAudio и постпроцессоров на базе ffmpeg §6.4. */
  const destination = t.match(/^\[(?:download|ExtractAudio|ffmpeg)]\s+Destination:\s+(.+)$/i)
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
  /** Альтернативный тег слияния (некоторые сборки пишут `[ffmpeg]` вместо `[Merger]`). */
  const ffmpegMerge = t.match(/^\[ffmpeg]\s+Merging formats into\s+(.+)$/i)
  if (ffmpegMerge) {
    const cap = ffmpegMerge[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const moving = t.match(/^\[MoveFiles]\s+Moving file\s+.+?\s+to\s+(.+)$/i)
  if (moving) {
    const cap = moving[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const fixup = t.match(
    /^\[(?:FixupM3u8|FixupM4a|FixupStretched|FixupTimestamp|FixupDuration|FFmpegFixupM3u8)]\s+.+?(?:in|of)\s+(.+)$/i
  )
  if (fixup) {
    const cap = fixup[1]
    if (cap === undefined) {
      return null
    }
    const quotedTail = cap.match(/"([^"]+)"\s*$/)
    if (quotedTail?.[1]) {
      return quotedTail[1]
    }
    const pathTail = cap.match(/\b(?:in|of)\s+((?:[A-Za-z]:)?[/\\].+|\.\.?[/\\].+)$/i)
    return pathTail?.[1] ?? unquoteYtdlpPath(cap)
  }
  /** Постобработка: превью и субтитры пишутся отдельными строками §6.4. */
  const thumb = t.match(/^\[download]\s+Writing thumbnail to:\s+(.+)$/i)
  if (thumb) {
    const cap = thumb[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const subs = t.match(/^\[download]\s+Writing video subtitles to:\s+(.+)$/i)
  if (subs) {
    const cap = subs[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const subsAlt = t.match(/^\[download]\s+Writing subtitles to:\s+(.+)$/i)
  if (subsAlt) {
    const cap = subsAlt[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const embedSub = t.match(/^\[EmbedSubtitle]\s+Embedding subtitles in\s+(.+)$/i)
  if (embedSub) {
    const cap = embedSub[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const metaWrite = t.match(/^\[Metadata]\s+Writing metadata to\s+(.+)$/i)
  if (metaWrite) {
    const cap = metaWrite[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** Запись тегов в медиа та же по смыслу, что `[Metadata]`, но префикс `[download]` в части сборок. */
  const downloadMetaWrite = t.match(/^\[download]\s+Writing metadata to:\s+(.+)$/i)
  if (downloadMetaWrite) {
    const cap = downloadMetaWrite[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** FFmpegVideoConvertor и др.: «…; Destination: путь» (см. FFmpeg PP в yt-dlp). */
  const semiDestination = t.match(/^\[[^\]]+\]\s+.+;\s+Destination:\s+(.+)$/i)
  if (semiDestination) {
    const cap = semiDestination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** Любой PP с `Destination:` сразу после тега (не только download/ExtractAudio/ffmpeg). */
  const genericPpDestination = t.match(/^\[[^\]]+\]\s+Destination:\s+(.+)$/i)
  if (genericPpDestination) {
    const cap = genericPpDestination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** EmbedThumbnailPP: `[EmbedThumbnail] ffmpeg: Adding thumbnail to "…"` и аналоги. */
  const embedThumbnail = t.match(/^\[[^\]]+\]\s+[^:]+:\s+Adding thumbnail to\s+"(.+)"$/i)
  if (embedThumbnail) {
    const cap = embedThumbnail[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** FFmpegMetadataPP до записи: `Adding metadata to "…"`. */
  const addingMetadata = t.match(/^\[[^\]]+\]\s+Adding metadata to\s+"(.+)"$/i)
  if (addingMetadata) {
    const cap = addingMetadata[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** FFmpegConcatPP: выходной файл при переименовании одного фрагмента в итоговое имя. */
  const movingTo = t.match(/^\[[^\]]+\]\s+Moving\s+"(.+?)"\s+to\s+"(.+)"$/i)
  if (movingTo) {
    const cap = movingTo[2]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** VideoRemuxer / FFmpegVideoRemuxer — итоговый контейнер после remux §6.4. */
  const remuxInto = t.match(/^\[(?:VideoRemuxer|FFmpegVideoRemuxer)]\s+.+?\s+into\s+(.+)$/i)
  if (remuxInto) {
    const cap = remuxInto[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** ConvertFormatPP и др.: «… → Destination: …» или ASCII «… -> Destination: …». */
  const arrowDestination = t.match(/^\[[^\]]+\]\s+.+?\s+(?:→|->)\s+Destination:\s+(.+)$/i)
  if (arrowDestination) {
    const cap = arrowDestination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** SubtitlesConvertor: конвертация дорожки в другой формат (типично `->` между путями). */
  const subsConvertArrow = t.match(
    /^\[(?:SubsConvertor|SubtitlesConvertor)]\s+.+?\s+(?:→|->)\s+(.+)$/i
  )
  if (subsConvertArrow) {
    const cap = subsConvertArrow[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const subsConvertInto = t.match(/^\[(?:SubsConvertor|SubtitlesConvertor)]\s+.+?\s+into\s+(.+)$/i)
  if (subsConvertInto) {
    const cap = subsConvertInto[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  return null
}
