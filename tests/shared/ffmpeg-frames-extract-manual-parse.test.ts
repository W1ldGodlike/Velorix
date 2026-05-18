import { describe, expect, it } from 'vitest'

import { parseFfmpegManualTimesText } from '../../src/shared/ffmpeg-frames-extract-manual-parse'

describe('parseFfmpegManualTimesText', () => {
  it('splits comma and newline lists', () => {
    expect(parseFfmpegManualTimesText('0, 1.5\n10; 12')).toEqual([0, 1.5, 10, 12])
  })

  it('ignores invalid tokens', () => {
    expect(parseFfmpegManualTimesText('0, x, 3')).toEqual([0, 3])
  })
})
