import { describe, expect, it } from 'vitest'

import {
  buildPlayheadStyle,
  buildTimelineRulerMarks,
  buildTimelineZoomTrackMinWidthPercent,
  buildTrimSpanStyle,
  clampTimelineZoom,
  timelineKeyboardSeekSec,
  timelineKeyboardZoomLevel,
  timelineRulerTickCountForZoom,
  timelineWheelZoomLevel,
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

describe('buildPlayheadStyle', () => {
  it('maps playhead to left percent', () => {
    expect(buildPlayheadStyle(30, 120)).toEqual({ left: '25%' })
  })

  it('returns null without duration', () => {
    expect(buildPlayheadStyle(1, null)).toBeNull()
  })
})

describe('timeline zoom helpers', () => {
  it('clamps zoom to 1..4', () => {
    expect(clampTimelineZoom(0)).toBe(1)
    expect(clampTimelineZoom(2.4)).toBe(2)
    expect(clampTimelineZoom(99)).toBe(4)
    expect(clampTimelineZoom(Number.NaN)).toBe(1)
  })

  it('maps zoom to tick count and track width', () => {
    expect(timelineRulerTickCountForZoom(1)).toBe(3)
    expect(timelineRulerTickCountForZoom(4)).toBe(9)
    expect(buildTimelineZoomTrackMinWidthPercent(3)).toBe('300%')
  })

  it('handles keyboard zoom controls', () => {
    expect(timelineKeyboardZoomLevel('-', 3)).toBe(2)
    expect(timelineKeyboardZoomLevel('PageDown', 3)).toBe(2)
    expect(timelineKeyboardZoomLevel('+', 3)).toBe(4)
    expect(timelineKeyboardZoomLevel('PageUp', 3)).toBe(4)
    expect(timelineKeyboardZoomLevel('NumpadAdd', 4)).toBe(4)
    expect(timelineKeyboardZoomLevel('0', 4)).toBe(1)
    expect(timelineKeyboardZoomLevel('Enter', 2)).toBeNull()
  })

  it('handles wheel zoom controls', () => {
    expect(timelineWheelZoomLevel(-120, 2)).toBe(3)
    expect(timelineWheelZoomLevel(120, 2)).toBe(1)
    expect(timelineWheelZoomLevel(-120, 4)).toBe(4)
    expect(timelineWheelZoomLevel(120, 1)).toBe(1)
    expect(timelineWheelZoomLevel(0, 3)).toBe(3)
  })
})

describe('buildTimelineRulerMarks', () => {
  it('returns evenly spaced marks', () => {
    expect(buildTimelineRulerMarks(100, 3)).toEqual([
      { left: '0%', sec: 0 },
      { left: '50%', sec: 50 },
      { left: '100%', sec: 100 }
    ])
  })

  it('returns empty without duration', () => {
    expect(buildTimelineRulerMarks(null)).toEqual([])
  })
})

describe('timelineKeyboardSeekSec', () => {
  it('steps by 1s or 5s with shift', () => {
    expect(timelineKeyboardSeekSec('ArrowLeft', false, 10, 100)).toBe(9)
    expect(timelineKeyboardSeekSec('ArrowLeft', true, 10, 100)).toBe(5)
    expect(timelineKeyboardSeekSec('ArrowRight', false, 10, 100)).toBe(11)
    expect(timelineKeyboardSeekSec('ArrowRight', true, 10, 100)).toBe(15)
  })

  it('clamps to range', () => {
    expect(timelineKeyboardSeekSec('ArrowLeft', false, 0, 100)).toBe(0)
    expect(timelineKeyboardSeekSec('ArrowRight', false, 100, 100)).toBe(100)
  })

  it('seeks to start and end', () => {
    expect(timelineKeyboardSeekSec('Home', false, 50, 100)).toBe(0)
    expect(timelineKeyboardSeekSec('End', false, 50, 100)).toBe(100)
  })

  it('ignores other keys', () => {
    expect(timelineKeyboardSeekSec('Enter', false, 10, 100)).toBeNull()
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
