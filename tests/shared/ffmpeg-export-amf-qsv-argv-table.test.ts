import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import type { FfmpegExportVideoCodecId } from '../../src/shared/ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER,
  FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER
} from '../../src/shared/ffmpeg-export-vaapi-vf'

const AMF_CODECS = ['h264_amf', 'hevc_amf', 'av1_amf'] as const satisfies readonly FfmpegExportVideoCodecId[]
const QSV_CODECS = ['h264_qsv', 'hevc_qsv', 'av1_qsv'] as const satisfies readonly FfmpegExportVideoCodecId[]

describe('ffmpeg-export AMF argv smoke (table)', () => {
  it.each(AMF_CODECS)('%s: d3d11va decode + AMF hwupload + rate control', (videoCodec) => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:\\media\\in.mp4',
      outputPath: 'C:\\media\\out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec,
      hwaccelDecode: 'd3d11va',
      crf: 23,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4',
      cropPreset: 'center-16-9'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual([
      '-hwaccel',
      'd3d11va',
      '-hwaccel_output_format',
      'd3d11'
    ])
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith(`${FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER},`)).toBe(true)
    expect(vf).toContain('crop=')
    expect(argv).toContain(videoCodec)
    expect(argv).toContain('-quality')
    expect(argv).toContain('-rc')
    expect(argv).toContain('cqp')
    expect(argv).toContain('-qp_i')
  })
})

describe('ffmpeg-export QSV argv smoke (table)', () => {
  it.each(QSV_CODECS)('%s: qsv decode + QSV hwupload + global_quality', (videoCodec) => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:\\media\\in.mp4',
      outputPath: 'C:\\media\\out.mp4',
      applyTrim: false,
      encodePreset: 'quality',
      videoCodec,
      hwaccelDecode: 'qsv',
      crf: 20,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: '720p',
      container: 'mp4'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual(['-hwaccel', 'qsv', '-hwaccel_output_format', 'qsv'])
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith(`${FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER},`)).toBe(true)
    expect(vf).toContain('scale=')
    expect(argv).toContain(videoCodec)
    expect(argv).toContain('-preset')
    expect(argv).toContain('-global_quality')
    expect(argv[argv.indexOf('-global_quality') + 1]).toBe('20')
  })
})
