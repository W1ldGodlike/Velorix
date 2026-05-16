import { describe, expect, it } from 'vitest'

import {
  parseFfmpegExportEncodePreset,
  parseFfmpegExportVideoDenoise,
  parseFfmpegExportVideoHue,
  parseFfmpegExportVideoLut3d
} from '../../src/shared/ffmpeg-export-parse-registry'

describe('ffmpeg-export-parse-registry', () => {
  it.each([
    ['parseFfmpegExportEncodePreset', parseFfmpegExportEncodePreset, 'quality', 'balance'],
    ['parseFfmpegExportVideoDenoise', parseFfmpegExportVideoDenoise, 'medium', 'off'],
    ['parseFfmpegExportVideoLut3d', parseFfmpegExportVideoLut3d, 'film-warm', 'off'],
    ['parseFfmpegExportVideoHue', parseFfmpegExportVideoHue, 'satBoost', 'off']
  ] as const)('%s — whitelist и fallback', (_name, fn, allowed, fallback) => {
    expect(fn(allowed)).toBe(allowed)
    expect(fn('__invalid__')).toBe(fallback)
  })
})
