import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import { parseFfmpegExportExtraArgsLine } from '../../src/shared/ffmpeg-export-extra-args'

describe('ffmpeg-export-extra-args', () => {
  it('parseFfmpegExportExtraArgsLine принимает безопасные токены', () => {
    expect(parseFfmpegExportExtraArgsLine('-shortest -max_muxing_queue_size 1024').ok).toBe(true)
  })

  it('parseFfmpegExportExtraArgsLine отклоняет -i', () => {
    const r = parseFfmpegExportExtraArgsLine('-i other.mp4')
    expect(r.ok).toBe(false)
  })

  it('buildFfmpegExportArgv вставляет extraArgs перед output', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4',
      extraArgs: ['-shortest']
    })
    const short = argv.indexOf('-shortest')
    const mov = argv.indexOf('-movflags')
    expect(short).toBeGreaterThan(0)
    expect(mov).toBe(short + 1)
  })
})
