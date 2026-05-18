import { describe, expect, it } from 'vitest'

import { buildFfmpegVideoSpriteArgv } from '../../src/shared/ffmpeg-video-sprite-argv'

describe('buildFfmpegVideoSpriteArgv', () => {
  it('builds fps+scale+tile filter for png output', () => {
    const r = buildFfmpegVideoSpriteArgv({
      inputPath: 'C:\\in\\clip.mp4',
      outputPath: 'C:\\out\\sprite.png',
      request: { durationSec: 30, columns: 3, rows: 2, format: 'png' }
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.argv).toContain('-vf')
      const vf = r.argv[r.argv.indexOf('-vf') + 1]
      expect(vf).toBe('fps=0.2,scale=320:-2:flags=lanczos,tile=3x2')
      expect(r.argv.at(-1)).toBe('C:\\out\\sprite.png')
    }
  })

  it('uses jpg quality flags', () => {
    const r = buildFfmpegVideoSpriteArgv({
      inputPath: '/in/a.mp4',
      outputPath: '/out/s.jpg',
      request: { durationSec: 10, columns: 2, rows: 2, format: 'jpg' }
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.argv).toContain('-q:v')
      expect(r.argv).toContain('2')
    }
  })
})
