import { describe, expect, it } from 'vitest'

import {
  inferVideoFpsFromNbFrames,
  parseFfprobeRationalFps,
  resolveVideoFpsApprox
} from '../../src/shared/ffprobe-video-fps'

describe('parseFfprobeRationalFps', () => {
  it('24000/1001 и дробные', () => {
    expect(parseFfprobeRationalFps('24000/1001')).toBeCloseTo(24000 / 1001, 9)
    expect(parseFfprobeRationalFps('30/1')).toBe(30)
    expect(parseFfprobeRationalFps('0/0')).toBe(null)
    expect(parseFfprobeRationalFps(undefined)).toBe(null)
  })
})

describe('inferVideoFpsFromNbFrames', () => {
  it('nb_frames / duration', () => {
    expect(inferVideoFpsFromNbFrames('300', 10)).toBe(30)
    expect(inferVideoFpsFromNbFrames(undefined, 10)).toBe(null)
    expect(inferVideoFpsFromNbFrames('1', 10)).toBe(null)
  })
})

describe('resolveVideoFpsApprox', () => {
  it('приоритет avg над fallback по кадрам', () => {
    expect(
      resolveVideoFpsApprox({
        avgFrameRate: '30/1',
        rFrameRate: '60/1',
        nbFrames: '300',
        durationSec: 10
      })
    ).toBe(30)
  })

  it('при отсутствии дробей — nb_frames/duration', () => {
    expect(
      resolveVideoFpsApprox({
        avgFrameRate: '0/0',
        rFrameRate: '0/0',
        nbFrames: '750',
        durationSec: 30
      })
    ).toBe(25)
  })
})
