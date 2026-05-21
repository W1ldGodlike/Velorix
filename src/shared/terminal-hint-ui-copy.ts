import type { AppUiLocale } from './app-ui-locale'
import type { TerminalCommandHintEntry } from './terminal-contract'

type StreamLetter = 'v' | 'a' | 's' | 'd' | 't'

function streamTypeLabel(locale: AppUiLocale, letter: StreamLetter, oneBased: number): string {
  if (locale === 'en') {
    const names: Record<StreamLetter, string> = {
      v: 'video',
      a: 'audio',
      s: 'subtitles',
      d: 'data',
      t: 'attachment'
    }
    return `${names[letter]} ${oneBased}`
  }
  const names: Record<StreamLetter, string> = {
    v: 'видео',
    a: 'аудио',
    s: 'субтитры',
    d: 'данные',
    t: 'вложение'
  }
  return `${names[letter]} ${oneBased}`
}

const STREAM_LETTER_CAPTURE = '([vasdt])'
const STREAM_INDEX_CAPTURE = '(\\d+)'

/** Подписи карточек и summary: ffprobe/ffmpeg-индексы → «видео 1», «аудио 2» (команды не меняются). */
export function humanizeTerminalFfprobeStreamSpecifiersInUiCopy(
  text: string,
  locale: AppUiLocale
): string {
  const redundantPairs: ReadonlyArray<readonly [string, StreamLetter]> =
    locale === 'en'
      ? [
          ['video', 'v'],
          ['audio', 'a'],
          ['subtitles', 's'],
          ['data', 'd'],
          ['attachment', 't']
        ]
      : [
          ['видео', 'v'],
          ['аудио', 'a'],
          ['субтитры', 's'],
          ['данные', 'd'],
          ['вложение', 't']
        ]

  let out = text
  for (const [word, letter] of redundantPairs) {
    const re = new RegExp(`${word}\\s+${letter}:${STREAM_INDEX_CAPTURE}`, 'gi')
    out = out.replace(re, (_, index) => `${word} ${Number(index) + 1}`)
  }

  out = out.replace(
    new RegExp(`0:${STREAM_LETTER_CAPTURE}:${STREAM_INDEX_CAPTURE}`, 'g'),
    (_match, letter, index) => streamTypeLabel(locale, letter as StreamLetter, Number(index) + 1)
  )
  out = out.replace(
    new RegExp(`${STREAM_LETTER_CAPTURE}:${STREAM_INDEX_CAPTURE}`, 'g'),
    (_match, letter, index) => streamTypeLabel(locale, letter as StreamLetter, Number(index) + 1)
  )
  return out
}

export function formatTerminalHintRowLabel(
  hint: TerminalCommandHintEntry,
  locale: AppUiLocale
): string {
  return humanizeTerminalFfprobeStreamSpecifiersInUiCopy(hint.token.trim(), locale)
}

export function formatTerminalHintRowSummary(
  hint: TerminalCommandHintEntry,
  locale: AppUiLocale
): string {
  const summary = hint.summary?.trim() ?? ''
  if (summary.length === 0) {
    return summary
  }
  return humanizeTerminalFfprobeStreamSpecifiersInUiCopy(summary, locale)
}
