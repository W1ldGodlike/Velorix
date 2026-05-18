import { describe, expect, it } from 'vitest'

import {
  formatPackagedVideoSpriteSmokeDiagnosticLines,
  isPackagedVideoSpriteVideoFilterShape,
  isPackagedVideoSpriteVideoFilterWithTimestamps,
  samplePackagedVideoSpriteVideoFilter
} from '../../src/shared/packaged-video-sprite-smoke'
import { buildFfmpegVideoSpriteVideoFilter } from '../../src/shared/ffmpeg-video-sprite-argv'

describe('packaged-video-sprite-smoke', () => {
  it('sample filter matches shape', () => {
    const vf = samplePackagedVideoSpriteVideoFilter()
    expect(isPackagedVideoSpriteVideoFilterShape(vf)).toBe(true)
    expect(vf).toBe('fps=0.2,scale=320:-2:flags=lanczos,tile=4x3')
  })

  it('detects drawtext timestamps branch', () => {
    const vf = buildFfmpegVideoSpriteVideoFilter({
      sampleFps: 1,
      columns: 2,
      rows: 2,
      burnTimestamps: true
    })
    expect(isPackagedVideoSpriteVideoFilterWithTimestamps(vf)).toBe(true)
  })

  it('formatPackagedVideoSpriteSmokeDiagnosticLines', () => {
    const lines = formatPackagedVideoSpriteSmokeDiagnosticLines()
    expect(lines[0]).toContain('§7.5')
    expect(lines.some((l) => l.startsWith('sample-vf:'))).toBe(true)
  })
})
