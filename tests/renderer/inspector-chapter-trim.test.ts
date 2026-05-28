import { describe, expect, it } from 'vitest'

import {
  findChapterIndexMatchingTrim,
  trimFromProbeChapter,
  trimFromProbeDuration
} from '../../src/renderer/src/lib/inspector-chapter-trim'

describe('trimFromProbeDuration', () => {
  it('returns full-file range', () => {
    expect(trimFromProbeDuration(120)).toEqual({ inSec: 0, outSec: 120 })
  })

  it('rejects invalid duration', () => {
    expect(trimFromProbeDuration(null)).toBeNull()
    expect(trimFromProbeDuration(0)).toBeNull()
  })
})

describe('trimFromProbeChapter', () => {
  it('uses chapter start and explicit end', () => {
    const chapters = [{ index: 1, title: 'A', startSec: 0, endSec: 30 }]
    expect(trimFromProbeChapter(chapters[0]!, chapters, 120)).toEqual({
      inSec: 0,
      outSec: 30
    })
  })

  it('finds chapter index for matching trim', () => {
    const chapters = [
      { index: 1, title: 'A', startSec: 0, endSec: 30 },
      { index: 2, title: 'B', startSec: 30, endSec: 90 }
    ]
    expect(findChapterIndexMatchingTrim({ inSec: 30, outSec: 90 }, chapters, 120)).toBe(2)
    expect(findChapterIndexMatchingTrim({ inSec: 0, outSec: 10 }, chapters, 120)).toBeNull()
  })

  it('uses next chapter start when end missing', () => {
    const chapters = [
      { index: 1, title: 'A', startSec: 0, endSec: 0 },
      { index: 2, title: 'B', startSec: 45, endSec: 90 }
    ]
    expect(trimFromProbeChapter(chapters[0]!, chapters, 120)).toEqual({
      inSec: 0,
      outSec: 45
    })
  })
})
