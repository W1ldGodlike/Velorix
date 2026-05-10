import { describe, expect, it } from 'vitest'

import { formatProbeChapterTimecode } from '../../src/shared/ffprobe-timecode'

describe('ffprobe-timecode', () => {
  it('форматирует часы и дробную часть', () => {
    expect(formatProbeChapterTimecode(3661.5)).toBe('1:01:01.500')
  })

  it('без часов', () => {
    expect(formatProbeChapterTimecode(65)).toBe('1:05')
  })
})
