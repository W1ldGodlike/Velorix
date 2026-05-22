import { describe, expect, it } from 'vitest'

import {
  isMediaUtilitiesHeifInputPath,
  mediaUtilitiesSlideshowPickExtensions,
  parseFfmpegHeifDecoderAvailable
} from '../../src/shared/ffmpeg-heif-decoder-probe'

describe('ffmpeg-heif-decoder-probe §7.5', () => {
  it('detects libheif line in -decoders output', () => {
    const sample = `
 V..... libheif_heif       Heif image
 V..... png                PNG (Portable Network Graphics) image
`
    expect(parseFfmpegHeifDecoderAvailable(sample)).toBe(true)
  })

  it('returns false without video heif decoder', () => {
    expect(parseFfmpegHeifDecoderAvailable(' V..... png  PNG image\n')).toBe(false)
  })

  it('recognizes .heic paths', () => {
    expect(isMediaUtilitiesHeifInputPath('C:/photos/shot.HEIC')).toBe(true)
    expect(isMediaUtilitiesHeifInputPath('C:/photos/shot.jpg')).toBe(false)
  })

  it('slideshow pick extensions omit heic when libheif missing', () => {
    expect(mediaUtilitiesSlideshowPickExtensions(false)).not.toContain('heic')
    expect(mediaUtilitiesSlideshowPickExtensions(true)).toContain('heic')
  })
})
