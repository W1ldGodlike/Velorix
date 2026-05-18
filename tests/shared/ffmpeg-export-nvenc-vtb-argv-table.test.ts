import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import type { FfmpegExportVideoCodecId } from '../../src/shared/ffmpeg-export-contract'
import { FFMPEG_EXPORT_NVENC_HWUPLOAD_FILTER } from '../../src/shared/ffmpeg-export-vaapi-vf'

const NVENC_CODECS = [
  'h264_nvenc',
  'hevc_nvenc',
  'av1_nvenc'
] as const satisfies readonly FfmpegExportVideoCodecId[]
const VTB_CODECS = [
  'h264_videotoolbox',
  'hevc_videotoolbox'
] as const satisfies readonly FfmpegExportVideoCodecId[]

describe('ffmpeg-export NVENC argv smoke (table)', () => {
  it.each(NVENC_CODECS)('%s: cuda decode + hwupload_cuda при CPU vf + VBR cq', (videoCodec) => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:\\media\\in.mp4',
      outputPath: 'C:\\media\\out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec,
      hwaccelDecode: 'cuda',
      crf: 23,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4',
      videoTransform: 'hflip'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual(['-hwaccel', 'cuda', '-hwaccel_output_format', 'cuda'])
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith(`${FFMPEG_EXPORT_NVENC_HWUPLOAD_FILTER},`)).toBe(true)
    expect(vf).toContain('hflip')
    expect(argv).toContain(videoCodec)
    expect(argv).toContain('-rc:v')
    expect(argv).toContain('vbr')
    expect(argv).toContain('-cq:v')
  })

  it.each(NVENC_CODECS)('%s: без CPU vf — без hwupload_cuda', (videoCodec) => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:\\media\\in.mp4',
      outputPath: 'C:\\media\\out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec,
      hwaccelDecode: 'cuda',
      crf: null,
      videoBitrate: '6M',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    expect(argv.includes('-vf')).toBe(false)
    expect(argv).toContain('-b:v')
    expect(argv.includes('-cq:v')).toBe(false)
    expect(argv).toContain(videoCodec)
  })
})

describe('ffmpeg-export VideoToolbox argv smoke (table)', () => {
  it.each(VTB_CODECS)('%s: videotoolbox decode + -q:v', (videoCodec) => {
    const argv = buildFfmpegExportArgv({
      inputPath: '/media/in.mp4',
      outputPath: '/media/out.mov',
      applyTrim: false,
      encodePreset: 'quality',
      videoCodec,
      hwaccelDecode: 'videotoolbox',
      crf: 22,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mov',
      cropPreset: 'center-square'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 2, i)).toEqual(['-hwaccel', 'videotoolbox'])
    expect(argv.includes('-hwaccel_output_format')).toBe(false)
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf).toContain('crop=')
    expect(vf.includes('hwupload')).toBe(false)
    expect(argv[argv.indexOf('-c:v') + 1]).toBe(videoCodec)
    expect(argv).toContain('-q:v')
    const qv = argv[argv.indexOf('-q:v') + 1]
    expect(Number(qv)).toBeGreaterThan(0)
  })
})
