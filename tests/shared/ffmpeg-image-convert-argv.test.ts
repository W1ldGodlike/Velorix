import { describe, expect, it } from 'vitest'

import { buildFfmpegConvertImageArgv } from '../../src/shared/ffmpeg-image-convert-argv'
import {
  isMediaUtilitiesImageInputPath,
  mediaUtilitiesImageOutputExtension,
  parseMediaUtilitiesImageFormatId
} from '../../src/shared/ffmpeg-image-convert-parse'

describe('ffmpeg-image-convert', () => {
  it('parseMediaUtilitiesImageFormatId', () => {
    expect(parseMediaUtilitiesImageFormatId('jpeg')).toBe('jpg')
    expect(parseMediaUtilitiesImageFormatId('webp')).toBe('webp')
    expect(parseMediaUtilitiesImageFormatId('gif')).toBeNull()
  })

  it('isMediaUtilitiesImageInputPath', () => {
    expect(isMediaUtilitiesImageInputPath('C:/a/photo.PNG')).toBe(true)
    expect(isMediaUtilitiesImageInputPath('C:/a/clip.mp4')).toBe(false)
  })

  it('mediaUtilitiesImageOutputExtension', () => {
    expect(mediaUtilitiesImageOutputExtension('jpg')).toBe('.jpg')
    expect(mediaUtilitiesImageOutputExtension('webp')).toBe('.webp')
  })

  it('buildFfmpegConvertImageArgv webp uses libwebp', () => {
    const argv = buildFfmpegConvertImageArgv('in.png', 'out.webp', 'webp')
    expect(argv).toContain('-c:v')
    expect(argv).toContain('libwebp')
    expect(argv.at(-1)).toBe('out.webp')
  })
})
