import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import type { FfmpegExportVideoCodecId } from '../../src/shared/ffmpeg-export-contract'
import { FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER } from '../../src/shared/ffmpeg-export-vaapi-vf'

const VAAPI_CODECS = [
  'h264_vaapi',
  'hevc_vaapi',
  'av1_vaapi'
] as const satisfies readonly FfmpegExportVideoCodecId[]

describe('ffmpeg-export Linux VAAPI argv smoke (table)', () => {
  it.each(VAAPI_CODECS)('%s: hwaccel vaapi + hwupload vf + encoder', (videoCodec) => {
    const argv = buildFfmpegExportArgv({
      inputPath: '/media/in.mp4',
      outputPath: '/media/out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec,
      hwaccelDecode: 'vaapi',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv',
      cropPreset: 'center-16-9'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual(['-hwaccel', 'vaapi', '-hwaccel_output_format', 'vaapi'])
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith(`${FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER},`)).toBe(true)
    expect(vf).toContain('crop=')
    expect(argv).toContain(videoCodec)
  })
})
