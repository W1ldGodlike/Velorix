import { describe, expect, it } from 'vitest'

import {
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  parseYtdlpDownloadProgressLine,
  shouldSkipYtdlpQueueRetriesAfterFailure
} from '../../src/main/ytdlp-progress-parser'

describe('parseYtdlpDownloadProgressLine', () => {
  it('возвращает null для строк без префикса [download]', () => {
    expect(parseYtdlpDownloadProgressLine('[info] some')).toBeNull()
    expect(parseYtdlpDownloadProgressLine('random output')).toBeNull()
    expect(parseYtdlpDownloadProgressLine('')).toBeNull()
  })

  it('игнорирует Destination: без процентов', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Destination: video.mp4')).toBeNull()
  })

  it('парсит процент + скорость + ETA', () => {
    const r = parseYtdlpDownloadProgressLine(
      '[download]  42.1% of   12.34MiB at  1.20MiB/s ETA 00:15'
    )
    expect(r).toEqual({ percent: '42.1%', speed: '1.20MiB/s', eta: '00:15' })
  })

  it('парсит финальную строку «in X at Y» без процента', () => {
    const r = parseYtdlpDownloadProgressLine('[download] 100% of 12.34MiB in 00:10 at 1.20MiB/s')
    expect(r).not.toBeNull()
    expect(r?.percent).toBe('100%')
    expect(r?.speed).toBe('1.20MiB/s')
  })

  it('парсит строку только с процентом', () => {
    const r = parseYtdlpDownloadProgressLine('[download] 7%')
    expect(r).toEqual({ percent: '7%', speed: null, eta: null })
  })

  it('возвращает null если ни процента, ни скорости нет', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Resuming download at byte 0')).toBeNull()
  })
})

describe('formatYtdlpProgressCell', () => {
  it('собирает все три поля', () => {
    expect(formatYtdlpProgressCell({ percent: '42%', speed: '1MiB/s', eta: '00:10' })).toBe(
      '42% · 1MiB/s · ETA 00:10'
    )
  })

  it('пропускает Unknown ETA/speed', () => {
    expect(
      formatYtdlpProgressCell({ percent: '42%', speed: 'Unknown speed', eta: 'Unknown' })
    ).toBe('42%')
  })

  it('возвращает пустую строку, если нет полей', () => {
    expect(formatYtdlpProgressCell({ percent: null, speed: null, eta: null })).toBe('')
  })
})

describe('formatYtdlpQueueFailureStatus', () => {
  it('показывает сигнал, если кода выхода нет', () => {
    expect(formatYtdlpQueueFailureStatus(null, 'SIGTERM', null, null)).toBe(
      'Ошибка (сигнал SIGTERM)'
    )
  })

  it('предпочитает явный ERROR: текст последней строке stderr', () => {
    expect(
      formatYtdlpQueueFailureStatus(1, null, 'Video unavailable', '[foo] last stderr line')
    ).toBe('Ошибка (код 1): Video unavailable')
  })

  it('берёт stderr как подсказку, если ERROR: не распарсился', () => {
    expect(
      formatYtdlpQueueFailureStatus(1, null, null, 'WARNING: [youtube] Sign in to confirm')
    ).toBe('Ошибка (код 1): WARNING: [youtube] Sign in to confirm')
  })

  it('обрезает итог длиннее 200 символов', () => {
    const longHint = 'x'.repeat(220)
    const s = formatYtdlpQueueFailureStatus(2, null, longHint, null)
    expect(s.length).toBe(200)
    expect(s.endsWith('…')).toBe(true)
  })
})

describe('extractYtdlpErrorSummary', () => {
  it('возвращает null для строк без ERROR:', () => {
    expect(extractYtdlpErrorSummary('[download] 50%')).toBeNull()
    expect(extractYtdlpErrorSummary('')).toBeNull()
  })

  it('извлекает текст после ERROR:', () => {
    expect(extractYtdlpErrorSummary('ERROR: HTTP Error 403: Forbidden')).toBe(
      'HTTP Error 403: Forbidden'
    )
  })

  it('обрезает слишком длинные сообщения', () => {
    const long = `ERROR: ${'x'.repeat(500)}`
    const r = extractYtdlpErrorSummary(long)
    expect(r?.length).toBeLessThanOrEqual(200)
    expect(r?.endsWith('…')).toBe(true)
  })

  it('возвращает null для пустого хвоста', () => {
    expect(extractYtdlpErrorSummary('ERROR:    ')).toBeNull()
  })
})

describe('shouldSkipYtdlpQueueRetriesAfterFailure', () => {
  it('true для типичных отказов источника (ERROR: или stderr)', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Private video', null)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, '[youtube] Video unavailable')).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('HTTP Error 403: Forbidden', null)).toBe(true)
  })

  it('false для транзиентных/неопределённых ошибок', () => {
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure('Unable to download webpage', 'Connection timed out')
    ).toBe(false)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null)).toBe(false)
  })
})

describe('extractYtdlpOutputPath', () => {
  it('извлекает путь из Destination строк', () => {
    expect(extractYtdlpOutputPath('[download] Destination: C:\\Downloads\\video.mp4')).toBe(
      'C:\\Downloads\\video.mp4'
    )
    expect(extractYtdlpOutputPath('[ExtractAudio] Destination: /tmp/audio.m4a')).toBe(
      '/tmp/audio.m4a'
    )
  })

  it('извлекает путь из merge/already-downloaded строк', () => {
    expect(extractYtdlpOutputPath('[Merger] Merging formats into "C:\\Downloads\\final.mp4"')).toBe(
      'C:\\Downloads\\final.mp4'
    )
    expect(extractYtdlpOutputPath('[download] /tmp/final.mp4 has already been downloaded')).toBe(
      '/tmp/final.mp4'
    )
  })

  it('возвращает null для обычных строк прогресса', () => {
    expect(extractYtdlpOutputPath('[download] 50% of 1MiB at 1MiB/s')).toBeNull()
  })
})
