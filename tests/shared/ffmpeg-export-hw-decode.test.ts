import { describe, expect, it } from 'vitest'

import {
  FFMPEG_HWACCEL_APPEND_CASES,
  FFMPEG_HWACCEL_DECODE_CASES,
  FFMPEG_HWACCEL_OUTPUT_FORMAT_CASES
} from '../fixtures/ffmpeg-export-hw-decode-cases'
import {
  appendFfmpegHwaccelBeforeInput,
  resolveFfmpegExportHwaccelForDecode,
  resolveFfmpegExportHwaccelOutputFormat
} from '../../src/shared/ffmpeg-export-hw-decode'

describe('ffmpeg-export-hw-decode', () => {
  it.each(FFMPEG_HWACCEL_DECODE_CASES)(
    'resolveFfmpegExportHwaccelForDecode $vcodec',
    ({ vcodec, hwaccels, expected }) => {
      expect(resolveFfmpegExportHwaccelForDecode(vcodec, hwaccels)).toBe(expected)
    }
  )

  it.each(FFMPEG_HWACCEL_OUTPUT_FORMAT_CASES)(
    'resolveFfmpegExportHwaccelOutputFormat $hwaccel',
    ({ hwaccel, expected }) => {
      expect(resolveFfmpegExportHwaccelOutputFormat(hwaccel)).toBe(expected)
    }
  )

  it.each(FFMPEG_HWACCEL_APPEND_CASES)('$label', ({ hwaccel, explicitOut, expected }) => {
    const args = ['-y']
    appendFfmpegHwaccelBeforeInput(args, hwaccel, explicitOut)
    expect(args).toEqual(expected)
  })
})
