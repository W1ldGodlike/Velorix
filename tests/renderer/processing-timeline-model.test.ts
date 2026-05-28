import { describe, expect, it } from 'vitest'

import {
  buildTrimSpanStyle,
  timelineSecFromPointer
} from '../../src/renderer/src/features/processing/processing-timeline-model'

describe('buildTrimSpanStyle', () => {
  it('returns null without trim or duration', () => {
    expect(buildTrimSpanStyle(null, 120)).toBeNull()
    expect(buildTrimSpanStyle({ inSec: 0, outSec: 10 }, null)).toBeNull()
  })

  it('maps trim to percent left/width', () => {
    expect(buildTrimSpanStyle({ inSec: 10, outSec: 30 }, 100)).toEqual({
      left: '10%',
      width: '20%'
    })
  })
})

describe('timelineSecFromPointer', () => {
  it('returns null for invalid duration', () => {
    expect(timelineSecFromPointer(50, { left: 0, width: 100 }, 0)).toBeNull()
  })

  it('maps click X to seconds', () => {
    expect(timelineSecFromPointer(50, { left: 0, width: 100 }, 200)).toBe(100)
    expect(timelineSecFromPointer(0, { left: 0, width: 100 }, 200)).toBe(0)
    expect(timelineSecFromPointer(100, { left: 0, width: 100 }, 200)).toBe(200)
  })
})
