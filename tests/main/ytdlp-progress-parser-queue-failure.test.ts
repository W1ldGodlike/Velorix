import { describe, expect, it } from 'vitest'

import {
  classifyYtdlpQueueFailureKind,
  extractYtdlpErrorSummary,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure
} from '../../src/main/ytdlp-progress-parser'

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

  it('добавляет короткую подпись по классификации §6.4', () => {
    expect(
      formatYtdlpQueueFailureStatus(1, null, 'Private video', null, 'likely_source_block')
    ).toContain('отказ источника')
    expect(
      formatYtdlpQueueFailureStatus(
        1,
        null,
        'Got server HTTP error: HTTP Error 503',
        null,
        'transient_network'
      )
    ).toContain('вероятно сеть')
  })

  it('unknown не добавляет подпись', () => {
    expect(formatYtdlpQueueFailureStatus(1, null, 'Odd message', null, 'unknown')).toBe(
      'Ошибка (код 1): Odd message'
    )
  })

  it('подпись для кодов выхода yt-dlp (2 / 100 / 101)', () => {
    expect(formatYtdlpQueueFailureStatus(2, null, 'bad flag', null, 'exit_bad_options')).toContain(
      'ошибка параметров'
    )
    expect(
      formatYtdlpQueueFailureStatus(100, null, 'restart', null, 'exit_needs_restart')
    ).toContain('перезапуск')
    expect(
      formatYtdlpQueueFailureStatus(101, null, 'max dl', null, 'exit_download_limit')
    ).toContain('лимит загрузок')
  })

  it('en: failure status and progress cell', () => {
    expect(formatYtdlpQueueFailureStatus(null, 'SIGTERM', null, null, undefined, 'en')).toBe(
      'Ошибка (signal SIGTERM)'
    )
    expect(
      formatYtdlpQueueFailureStatus(1, null, 'x', null, 'likely_source_block', 'en')
    ).toContain('source blocked')
    expect(formatYtdlpProgressCell({ percent: '10%', speed: null, eta: '00:01' }, 'en')).toBe(
      '10% · ETA 00:01'
    )
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
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Premature close', 'HTTP Error 408')).toBe(false)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null)).toBe(false)
  })

  it('true для завершённого стрима / премьеры без транзиентного маркера', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Live stream has ended', null)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, 'Premiere will begin in 10 minutes')).toBe(
      true
    )
  })

  it('true для DRM как устойчивого отказа источника', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Video is DRM protected', null)).toBe(true)
  })

  it('true для нехватки места и отсутствия ffmpeg (повтор той же команды бессмысленен)', () => {
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure(null, 'OSError: [Errno 28] No space left on device')
    ).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('ffmpeg: not found', null)).toBe(true)
  })

  it('true если yt-dlp не нашёл форматов или URL не поддерживается', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('No video formats found', null)).toBe(true)
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure(null, 'ERROR: requested format is not available')
    ).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, 'Unsupported URL: foo')).toBe(true)
  })

  it('транзиент имеет приоритет: не skip даже при наличии «video unavailable» в stderr', () => {
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure(
        'ERROR: Video unavailable',
        'ERROR: Unable to download webpage: HTTP Error 503'
      )
    ).toBe(false)
  })

  it('стабильные коды yt-dlp 2/100/101 — отмена повторов очереди даже без маркеров в тексте', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 2)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 100)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 101)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 1)).toBe(false)
  })
})

describe('classifyYtdlpQueueFailureKind', () => {
  it('transient_network для типичной сетевой ошибки', () => {
    expect(classifyYtdlpQueueFailureKind('Got server HTTP error: HTTP Error 503', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind('HTTP Error 504: Gateway Timeout', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'Broken pipe')).toBe('transient_network')
    expect(classifyYtdlpQueueFailureKind(null, '502 Bad Gateway')).toBe('transient_network')
    expect(classifyYtdlpQueueFailureKind('HTTP Error 408: Request Timeout', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'Connection prematurely closed')).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind('Signature extraction failed', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'Rate limit exceeded')).toBe('transient_network')
    expect(classifyYtdlpQueueFailureKind('HTTP Error 521: Web Server Is Down', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'EOF occurred in violation of protocol')).toBe(
      'transient_network'
    )
  })

  it('likely_source_block для приватного видео', () => {
    expect(classifyYtdlpQueueFailureKind('Private video', null)).toBe('likely_source_block')
    expect(classifyYtdlpQueueFailureKind('Not available in your country', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind('Not available from your location', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind("Sign in to confirm you're not a bot", null)).toBe(
      'likely_source_block'
    )
    expect(
      classifyYtdlpQueueFailureKind('This video may be inappropriate for some users', null)
    ).toBe('likely_source_block')
    expect(classifyYtdlpQueueFailureKind('DRM protected video', null)).toBe('likely_source_block')
    expect(classifyYtdlpQueueFailureKind('No video formats found', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'ERROR: No space left on device')).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind('The downloaded file is empty', null)).toBe(
      'likely_source_block'
    )
  })

  it('unknown если нет явных маркеров', () => {
    expect(classifyYtdlpQueueFailureKind('Something went wrong', null)).toBe('unknown')
  })

  it('при неясном тексте использует код выхода yt-dlp (2, 100, 101)', () => {
    expect(classifyYtdlpQueueFailureKind(null, null, 2)).toBe('exit_bad_options')
    expect(classifyYtdlpQueueFailureKind(null, null, 100)).toBe('exit_needs_restart')
    expect(classifyYtdlpQueueFailureKind(null, null, 101)).toBe('exit_download_limit')
    expect(classifyYtdlpQueueFailureKind(null, null, 1)).toBe('unknown')
  })

  it('транзиент по тексту сильнее кода выхода', () => {
    expect(classifyYtdlpQueueFailureKind('Connection timed out', null, 2)).toBe('transient_network')
  })
})

describe('shouldSkipQueueRetriesForFailureKind', () => {
  it('не skip для transient и unknown', () => {
    expect(shouldSkipQueueRetriesForFailureKind('transient_network')).toBe(false)
    expect(shouldSkipQueueRetriesForFailureKind('unknown')).toBe(false)
  })

  it('skip для источника и кодов 2/100/101', () => {
    expect(shouldSkipQueueRetriesForFailureKind('likely_source_block')).toBe(true)
    expect(shouldSkipQueueRetriesForFailureKind('exit_bad_options')).toBe(true)
    expect(shouldSkipQueueRetriesForFailureKind('exit_needs_restart')).toBe(true)
    expect(shouldSkipQueueRetriesForFailureKind('exit_download_limit')).toBe(true)
  })
})
