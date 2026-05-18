import { describe, expect, it } from 'vitest'

import { buildFfmpegExportVideoFilterChain } from '../../src/shared/ffmpeg-export-argv-build-vf-chain'

describe('ffmpeg-export-argv external script vf', () => {
  it('inserts external filter after transform', () => {
    const chain = buildFfmpegExportVideoFilterChain({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: 23,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      externalFilterKind: 'vapoursynth',
      externalFilterScriptAbsPath: 'C:/scripts/x.vpy'
    })
    expect(chain[0]).toContain('vapoursynth=filename=')
  })
})
