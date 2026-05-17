import { describe, expect, it } from 'vitest'

import { formatFfprobeStreamTimeBaseDetail } from '../../src/shared/ffprobe-stream-time-base'

describe('formatFfprobeStreamTimeBaseDetail', () => {
  it('shows non-trivial time_base', () => {
    expect(formatFfprobeStreamTimeBaseDetail('1/90000', false)).toBe('tb 1/90000')
  })

  it('skips trivial and redundant', () => {
    expect(formatFfprobeStreamTimeBaseDetail('1/1', false)).toBeNull()
    expect(formatFfprobeStreamTimeBaseDetail('1/90000', true)).toBeNull()
  })
})
