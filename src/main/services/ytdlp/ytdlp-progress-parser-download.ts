import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getYtdlpQueueProgressStrings } from '../../../shared/ytdlp-queue-progress-locale'

/** Поля прогресса из строк stderr/stdout yt-dlp с префиксом «[download]». */
export interface YtdlpDownloadProgressParts {
  percent: string | null
  speed: string | null
  eta: string | null
  /** Размер целевого файла из фрагмента «NN% of 12.34MiB», если распознан. §6 таблица. */
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
  locale: AppUiLocale = 'ru'
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

  const skipVideosMatch = t.match(/\[download\]\s+Skipping\s+(\d+)\s+of\s+(\d+)\s+videos?\b/i)
  if (skipVideosMatch) {
    const a = skipVideosMatch[1]
    const b = skipVideosMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: P.progressPlaylistSkip.replace('{a}', a).replace('{b}', b),
        eta: null
      }
    }
  }

  if (/\[download\]\s+Unable to rename file/i.test(t)) {
    return { percent: null, speed: P.progressRenameFailed, eta: null }
  }

  const dlFormatsMatch = t.match(/\[download\]\s+Downloading\s+\d+\s+format\(s\):\s*(\S+)/i)
  const dlFormatIds = dlFormatsMatch?.[1]
  if (dlFormatIds !== undefined && dlFormatIds.length > 0) {
    return {
      percent: null,
      speed: P.progressFormatSelect.replace('{ids}', dlFormatIds),
      eta: null
    }
  }

  const dlFormatSingleMatch = t.match(/\[download\]\s+Downloading\s+format\s+(\d+(?:\+\d+)*)/i)
  const singleIds = dlFormatSingleMatch?.[1]
  if (singleIds !== undefined && singleIds.length > 0) {
    return {
      percent: null,
      speed: P.progressFormatSelect.replace('{ids}', singleIds),
      eta: null
    }
  }

  if (/\[download\]\s+.+\s+has already been downloaded/i.test(t)) {
    return { percent: '100%', speed: P.progressAlreadyDownloaded, eta: null }
  }

  if (/\[download\]\s+Writing thumbnail to:/i.test(t)) {
    return { percent: null, speed: P.progressWritingThumbnail, eta: null }
  }

  if (/\[download\]\s+Writing (?:video )?subtitles to:/i.test(t)) {
    return { percent: null, speed: P.progressWritingSubtitles, eta: null }
  }

  if (/\[download\]\s+Writing metadata to:/i.test(t)) {
    return { percent: null, speed: P.progressWritingMetadata, eta: null }
  }

  const rateLimitSleepMatch = t.match(
    /\[download\]\s+Download rate limit reached, sleeping for\s+([\d.]+)/i
  )
  const rateLimitSec = rateLimitSleepMatch?.[1]
  if (rateLimitSec !== undefined) {
    return {
      percent: null,
      speed: P.progressRateLimitSleep.replace('{sec}', rateLimitSec),
      eta: null
    }
  }

  if (/\[download\]\s+Deleting original file\b/i.test(t)) {
    return { percent: null, speed: P.progressDeletingOriginal, eta: null }
  }

  const giveUpMatch = t.match(/\[download\]\s+Giving up after\s+(\d+)\s+retries/i)
  const giveUpN = giveUpMatch?.[1]
  if (giveUpN !== undefined) {
    return {
      percent: null,
      speed: P.progressGivingUpRetries.replace('{n}', giveUpN),
      eta: null
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
  let base = parts[parts.length - 1] ?? ''
  if (base.length < 2) {
    return null
  }
  const lowerBase = base.toLowerCase()
  for (const suffix of ['.part', '.ytdl', '.temp', '.tmp']) {
    if (lowerBase.endsWith(suffix)) {
      base = base.slice(0, -suffix.length)
      break
    }
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
  locale: AppUiLocale = 'ru'
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
