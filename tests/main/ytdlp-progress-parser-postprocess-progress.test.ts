import { describe, expect, it } from 'vitest'

import { parseYtdlpQueuePostProcessProgressLine } from '../../src/main/services/ytdlp/ytdlp-progress-parser-postprocess-progress'
import { YTDLP_PROGRESS_POST_PROCESS_CASES } from '../fixtures/ytdlp-progress-parser-postprocess-cases'

describe('parseYtdlpQueuePostProcessProgressLine §6.4', () => {
  it.each(YTDLP_PROGRESS_POST_PROCESS_CASES)(
    'post-process: $label',
    ({ line, locale, expected }) => {
      expect(parseYtdlpQueuePostProcessProgressLine(line, locale ?? 'ru')).toEqual(expected)
    }
  )

  it('returns null for ordinary download progress', () => {
    expect(parseYtdlpQueuePostProcessProgressLine('[download] 42% of 10MiB at 1MiB/s')).toBeNull()
  })
})
