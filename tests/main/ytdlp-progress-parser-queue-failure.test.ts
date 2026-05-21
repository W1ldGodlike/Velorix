import { describe, expect, it } from 'vitest'

import {
  YTDLP_CLASSIFY_EXIT_CODE_CASES,
  YTDLP_CLASSIFY_SOURCE_BLOCK_CASES,
  YTDLP_CLASSIFY_TRANSIENT_CASES,
  YTDLP_ERROR_SUMMARY_CASES,
  YTDLP_QUEUE_FAILURE_STATUS_CASES,
  YTDLP_SKIP_QUEUE_RETRIES_CASES,
  YTDLP_SKIP_RETRIES_FOR_KIND_CASES
} from '../fixtures/ytdlp-progress-parser-queue-failure-cases'
import {
  classifyYtdlpQueueFailureKind,
  extractYtdlpErrorSummary,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure
} from '../../src/main/services/ytdlp/ytdlp-progress-parser'

describe('formatYtdlpQueueFailureStatus', () => {
  it.each(YTDLP_QUEUE_FAILURE_STATUS_CASES)(
    '$label',
    ({ exitCode, signal, errorHint, stderrFallback, failureKind, locale, expected }) => {
      const s = formatYtdlpQueueFailureStatus(
        exitCode,
        signal,
        errorHint,
        stderrFallback,
        failureKind,
        locale
      )
      expect(s).toContain(expected)
    }
  )

  it('обрезает итог длиннее 200 символов', () => {
    const longHint = 'x'.repeat(220)
    const s = formatYtdlpQueueFailureStatus(2, null, longHint, null)
    expect(s.length).toBe(200)
    expect(s.endsWith('…')).toBe(true)
  })

  it('en: progress cell', () => {
    expect(formatYtdlpProgressCell({ percent: '10%', speed: null, eta: '00:01' }, 'en')).toBe(
      '10% · ETA 00:01'
    )
  })
})

describe('extractYtdlpErrorSummary', () => {
  it.each(YTDLP_ERROR_SUMMARY_CASES)('$label', ({ line, expected }) => {
    expect(extractYtdlpErrorSummary(line)).toBe(expected)
  })

  it('обрезает слишком длинные сообщения', () => {
    const long = `ERROR: ${'x'.repeat(500)}`
    const r = extractYtdlpErrorSummary(long)
    expect(r?.length).toBeLessThanOrEqual(200)
    expect(r?.endsWith('…')).toBe(true)
  })
})

describe('shouldSkipYtdlpQueueRetriesAfterFailure', () => {
  it.each(YTDLP_SKIP_QUEUE_RETRIES_CASES)(
    '$label',
    ({ errorHint, stderrFallback, exitCode, expected }) => {
      expect(shouldSkipYtdlpQueueRetriesAfterFailure(errorHint, stderrFallback, exitCode)).toBe(
        expected
      )
    }
  )
})

describe('classifyYtdlpQueueFailureKind', () => {
  it.each(YTDLP_CLASSIFY_TRANSIENT_CASES)(
    'transient: $label',
    ({ errorHint, stderrFallback, exitCode, expected }) => {
      expect(classifyYtdlpQueueFailureKind(errorHint, stderrFallback, exitCode)).toBe(expected)
    }
  )

  it.each(YTDLP_CLASSIFY_SOURCE_BLOCK_CASES)(
    'source: $label',
    ({ errorHint, stderrFallback, exitCode, expected }) => {
      expect(classifyYtdlpQueueFailureKind(errorHint, stderrFallback, exitCode)).toBe(expected)
    }
  )

  it.each(YTDLP_CLASSIFY_EXIT_CODE_CASES)(
    'exit: $label',
    ({ errorHint, stderrFallback, exitCode, expected }) => {
      expect(classifyYtdlpQueueFailureKind(errorHint, stderrFallback, exitCode)).toBe(expected)
    }
  )

  it('unknown если нет явных маркеров', () => {
    expect(classifyYtdlpQueueFailureKind('Something went wrong', null)).toBe('unknown')
  })
})

describe('shouldSkipQueueRetriesForFailureKind', () => {
  it.each(YTDLP_SKIP_RETRIES_FOR_KIND_CASES)('$label', ({ kind, expected }) => {
    expect(shouldSkipQueueRetriesForFailureKind(kind)).toBe(expected)
  })
})
