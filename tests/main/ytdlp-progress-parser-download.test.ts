import { describe, expect, it } from 'vitest'

import {
  YTDLP_PROGRESS_EQUAL_CASES,
  YTDLP_PROGRESS_NULL_LINES
} from '../fixtures/ytdlp-progress-parse-cases'
import { YTDLP_PROGRESS_RARE_CASES } from '../fixtures/ytdlp-progress-parser-rare-cases'
import {
  parseYtdlpDownloadProgressLine,
  parseYtdlpQueueFormatHint
} from '../../src/main/services/ytdlp/ytdlp-progress-parser'

describe('parseYtdlpDownloadProgressLine', () => {
  it.each(YTDLP_PROGRESS_NULL_LINES)('null для %s', (line) => {
    expect(parseYtdlpDownloadProgressLine(line)).toBeNull()
  })

  it.each(YTDLP_PROGRESS_EQUAL_CASES)('$label', ({ line, expected }) => {
    expect(parseYtdlpDownloadProgressLine(line)).toEqual(expected)
  })

  it.each(YTDLP_PROGRESS_RARE_CASES)('редкие §6.4: $label', ({ line, locale, expected }) => {
    expect(parseYtdlpDownloadProgressLine(line, locale ?? 'ru')).toEqual(expected)
  })

  it('парсит размер с отдельным символом приблизительности "~"', () => {
    const r = parseYtdlpDownloadProgressLine(
      '[download]  10.0% of ~ 5.00MiB at 1.00MiB/s ETA 00:01'
    )
    expect(r?.sizeTotal).toBe('5.00MiB')
  })

  it('парсит финальную строку «in X at Y» без процента', () => {
    const r = parseYtdlpDownloadProgressLine('[download] 100% of 12.34MiB in 00:10 at 1.20MiB/s')
    expect(r).not.toBeNull()
    expect(r?.percent).toBe('100%')
    expect(r?.speed).toBe('1.20MiB/s')
    expect(r?.sizeTotal).toBe('12.34MiB')
  })

  it('парсит вариант (frag N/M) со строкой с %', () => {
    const withPct = parseYtdlpDownloadProgressLine(
      '[download] 10.0% of ~ 5.00MiB at 1.00MiB/s ETA 00:01 (frag 12/120)'
    )
    expect(withPct?.percent).toBe('10.0%')
    expect(withPct?.speed).toBe('1.00MiB/s')
  })

  it('парсит retry-счётчик yt-dlp', () => {
    expect(
      parseYtdlpDownloadProgressLine(
        '[download] Got server HTTP error: HTTP Error 503. Retrying (2/10)...'
      )
    ).toEqual({
      percent: null,
      speed: 'повтор 2/10',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Got error: timeout. Retrying fragment 7 (3/10)...')
    ).toEqual({
      percent: null,
      speed: 'повтор фрагмента 7 · 3/10',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Got error: timeout. Retrying (attempt 4 of 10)...')
    ).toEqual({
      percent: null,
      speed: 'повтор 4/10',
      eta: null
    })
    expect(parseYtdlpDownloadProgressLine('[download] Retrying in 5.00 seconds...')).toEqual({
      percent: null,
      speed: 'повтор через 5.00 с',
      eta: null
    })
  })
})

describe('parseYtdlpDownloadProgressLine (en)', () => {
  it('playlist / fragment / merge hint', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Downloading item 3 of 25', 'en')?.speed).toBe(
      'playlist 3/25'
    )
    expect(parseYtdlpDownloadProgressLine('[download] fragment 5 of 120', 'en')?.speed).toBe(
      'fragment 5/120'
    )
    expect(
      parseYtdlpQueueFormatHint('[Merger] Merging formats into "C:\\Downloads\\final.mkv"', 'en')
    ).toContain('merge')
  })
})
