import { describe, expect, it } from 'vitest'

import {
  buildFfmpegImageSlideshowArgv,
  resolveSlideshowTransitionDurationSec
} from '../../src/shared/ffmpeg-image-slideshow-argv'

describe('buildFfmpegImageSlideshowArgv §7.5.4', () => {
  it('builds xfade filter for two images (fade)', () => {
    const argv = buildFfmpegImageSlideshowArgv({
      imagePaths: ['C:/a/one.png', 'C:/b/two.jpg'],
      outputPath: 'C:/out/slide.mp4',
      slideDurationSec: 2.5,
      transition: 'fade'
    })
    expect(argv).toContain('-loop')
    expect(argv).toContain('-t')
    expect(argv).toContain('2.5')
    expect(argv).toContain('-filter_complex')
    const fc = argv.find((arg) => arg.includes('xfade=transition=fade')) ?? ''
    expect(fc).toContain('xfade=transition=fade')
    expect(fc).toContain(`offset=${2.5 - resolveSlideshowTransitionDurationSec(2.5)}`)
    expect(argv.some((arg) => arg.includes('concat=n='))).toBe(false)
    expect(argv.at(-1)).toBe('C:/out/slide.mp4')
  })

  it('chains xfade for three images with cumulative offset', () => {
    const d = 3
    const t = resolveSlideshowTransitionDurationSec(d)
    const argv = buildFfmpegImageSlideshowArgv({
      imagePaths: ['a.png', 'b.png', 'c.png'],
      outputPath: 'out.mp4',
      slideDurationSec: d,
      transition: 'wipeleft'
    })
    const fc = argv.find((arg) => arg.includes('xfade')) ?? ''
    expect(fc).toContain('xfade=transition=wipeleft')
    expect(fc).toContain(`offset=${d - t}`)
    expect(fc).toContain(`offset=${2 * (d - t)}`)
  })

  it('builds concat filter when transition is none', () => {
    const argv = buildFfmpegImageSlideshowArgv({
      imagePaths: ['a.png', 'b.png'],
      outputPath: 'out.mp4',
      slideDurationSec: 2,
      transition: 'none'
    })
    expect(argv.some((arg) => arg.includes('concat=n=2:v=1:a=0'))).toBe(true)
    expect(argv.some((arg) => arg.includes('xfade'))).toBe(false)
  })
})
