import { describe, expect, it } from 'vitest'

import {
  formatFfprobeContainerTimeBaseCompact,
  formatFfprobeStreamTimeBaseDetail,
  parseFfprobeNontrivialTimeBase
} from '../../src/shared/ffprobe-stream-time-base'

describe('parseFfprobeNontrivialTimeBase', () => {
  it('parses and skips trivial', () => {
    expect(parseFfprobeNontrivialTimeBase('1/90000')).toBe('1/90000')
    expect(parseFfprobeNontrivialTimeBase('1/1')).toBeNull()
  })
})

describe('formatFfprobeStreamTimeBaseDetail', () => {
  it('shows non-trivial time_base', () => {
    expect(formatFfprobeStreamTimeBaseDetail('1/90000', false)).toBe('tb 1/90000')
  })

  it('skips trivial and redundant', () => {
    expect(formatFfprobeStreamTimeBaseDetail('1/1', false)).toBeNull()
    expect(formatFfprobeStreamTimeBaseDetail('1/90000', true)).toBeNull()
  })
})

describe('formatFfprobeContainerTimeBaseCompact', () => {
  it('formats container time_base', () => {
    expect(formatFfprobeContainerTimeBaseCompact('1/1000')).toBe('tb 1/1000')
    expect(formatFfprobeContainerTimeBaseCompact(null)).toBeNull()
  })
})
