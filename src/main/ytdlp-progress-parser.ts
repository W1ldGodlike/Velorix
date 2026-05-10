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
export function parseYtdlpDownloadProgressLine(line: string): YtdlpDownloadProgressParts | null {
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
        speed: `плейлист ${a}/${b}`,
        eta: null
      }
    }
  }

  /** Вариант без слова video/item: «… 3 of 10 videos …» (разные версии/локали yt-dlp). */
  const playlistVideosOnlyMatch = t.match(/\b(\d+)\s+of\s+(\d+)\s+videos?\b/i)
  if (playlistVideosOnlyMatch && !/\bfragment\b/i.test(t)) {
    const a = playlistVideosOnlyMatch[1]
    const b = playlistVideosOnlyMatch[2]
    if (a !== undefined && b !== undefined) {
      return {
        percent: null,
        speed: `плейлист ${a}/${b}`,
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
        speed: `фрагмент ${a}/${b}`,
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
        speed: `фрагмент ${a}/${b}`,
        eta: null
      }
    }
  }

  /** Rate-limit / антибот: пауза перед повтором (типичная строка `[download] Sleeping …`). */
  const sleepingMatch = t.match(/\[download\]\s+Sleeping\s+([\d.]+)\s+seconds/i)
  if (sleepingMatch) {
    const sec = sleepingMatch[1]
    if (sec !== undefined) {
      return { percent: null, speed: `пауза ${sec} с`, eta: null }
    }
  }

  if (/\[download\]\s+Waiting\s+for\s+reconnect/i.test(t)) {
    return { percent: null, speed: 'ожидание переподключения', eta: null }
  }

  /** Некоторые версии пишут общее «ожидание …» без явного reconnect/sleep. */
  if (
    /\[download\]\s+Waiting\s+for\s+/i.test(t) &&
    !/\[download\]\s+Waiting\s+for\s+reconnect/i.test(t)
  ) {
    return { percent: null, speed: 'ожидание', eta: null }
  }

  /** Продолжение частично скачанного файла — без процентов в строке §6.4. */
  if (/\[download\]\s+Resuming download at byte\s+\d+/i.test(t)) {
    return { percent: null, speed: 'продолжение загрузки', eta: null }
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
    case 'exit_bad_options':
      return ' · ошибка параметров'
    case 'exit_needs_restart':
      return ' · нужен перезапуск yt-dlp'
    case 'exit_download_limit':
      return ' · лимит загрузок'
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
  'live stream has ended',
  'premiere will begin',
  'scheduled stream',
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
  'blocked it on copyright',
  'not available in your country',
  'geo restricted',
  'geo-blocked',
  'drm protected',
  'requested format is not available',
  'no video formats found',
  'unsupported url'
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
  'request timeout',
  'too many requests',
  'got server http error',
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
