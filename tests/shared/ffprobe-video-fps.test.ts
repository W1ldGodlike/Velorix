import { describe, expect, it } from 'vitest'

import {
  formatFfprobeVideoFpsDetail,
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

describe('formatFfprobeVideoFpsDetail', () => {
  it('одно значение при совпадении avg и r', () => {
    expect(formatFfprobeVideoFpsDetail('24000/1001', '24000/1001')).toBe(
      `${(24000 / 1001).toFixed(3)} fps`
    )
    expect(formatFfprobeVideoFpsDetail('30/1', '30/1')).toBe('30 fps')
  })

  it('два значения при заметном расхождении', () => {
    expect(formatFfprobeVideoFpsDetail('24000/1001', '30000/1001')).toBe(
      `${(24000 / 1001).toFixed(3)} / ${(30000 / 1001).toFixed(3)} fps`
    )
    expect(formatFfprobeVideoFpsDetail('30/1', '60/1')).toBe('30 / 60 fps')
  })

  it('fallback на одно поле', () => {
    expect(formatFfprobeVideoFpsDetail('0/0', '25/1')).toBe('25 fps')
    expect(formatFfprobeVideoFpsDetail('25/1', '0/0')).toBe('25 fps')
    expect(formatFfprobeVideoFpsDetail(undefined, undefined)).toBe(null)
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
