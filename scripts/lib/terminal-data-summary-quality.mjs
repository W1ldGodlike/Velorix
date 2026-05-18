/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §8 фаза E — качество русских `summary` в `Data/*_commands.json`.
 */

export const TERMINAL_DATA_COMMAND_FILES = [
  'ffmpeg_commands.json',
  'ffprobe_commands.json',
  'ytdlp_commands.json'
]

/** Индексы ffmpeg-потоков, не `res:720` / `threads:1`. */
const STREAM_INDEX_RE = /(?<![a-z_])[vas]:\d+/i

/** Слова-пояснения рядом с v:0 / a:0 / s:0 в summary. */
const STREAM_GLOSS_RE = /дорож|видео|аудио|субтит|индекс/i

/**
 * «поток» без контекста медиа-дорожки (допускаем CPU-потоки, графы, CDN, Apple TV и т.п.).
 */
const POTOK_OK_RE =
  /дорож|видео|медиа|аудио|CDN|скачив|потоков|потока|потоки|MP4|Apple|браузер|CPU|ресурс|граф|ffmpeg/i

/**
 * @param {string} summary
 * @returns {string | null} reason if invalid
 */
export function terminalDataSummaryQualityIssue(summary) {
  const s = summary.trim()
  if (s.length === 0) {
    return 'пустой summary'
  }
  if (STREAM_INDEX_RE.test(s) && !STREAM_GLOSS_RE.test(s)) {
    return 'индекс дорожки (v:0/a:0/s:0) без пояснения'
  }
  if (/\bпоток/i.test(s) && !POTOK_OK_RE.test(s)) {
    return 'слово «поток» без поясняющего контекста'
  }
  return null
}

/**
 * @param {unknown} row
 * @returns {{ file: string, token: string, reason: string } | null}
 */
export function terminalDataRowQualityIssue(file, row) {
  if (!row || typeof row !== 'object') {
    return null
  }
  const token = typeof row.token === 'string' ? row.token : '?'
  const summary = typeof row.summary === 'string' ? row.summary : ''
  const reason = terminalDataSummaryQualityIssue(summary)
  if (reason === null) {
    return null
  }
  return { file, token, reason }
}
