import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import {
  FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_DNXHD_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_FFV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_RAV1E_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
} from '../../src/shared/ffmpeg-export-contract'

describe('shared ffmpeg export argv — video codecs and containers', () => {
  it('собирает базовый argv для CRF mode без trim/scale/fps', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:/in/file.mp4',
      outputPath: 'C:/out/file.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source'
    })
    expect(argv).toEqual([
      '-y',
      '-hide_banner',
      '-loglevel',
      'info',
      '-stats',
      '-i',
      'C:/in/file.mp4',
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '23',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-movflags',
      '+faststart',
      'C:/out/file.mp4'
    ])
  })

  it('libx265: -c:v libx265 и -tag:v hvc1 для MP4/MOV; без тега для MKV', () => {
    const mp4 = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx265',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    const i = mp4.indexOf('-c:v')
    expect(mp4.slice(i, i + 6)).toEqual(['-c:v', 'libx265', '-preset', 'fast', '-tag:v', 'hvc1'])
    const mkv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx265',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    expect(mkv.includes('hvc1')).toBe(false)
    expect(mkv[mkv.indexOf('-c:v') + 1]).toBe('libx265')
  })

  it('libvpx-vp9: только MKV; -row-mt, -cpu-used, -deadline, -crf', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'libvpx-vp9',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mp4'
      })
    ).toThrow(FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'quality',
      videoCodec: 'libvpx-vp9',
      crf: 40,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 8)).toEqual([
      '-c:v',
      'libvpx-vp9',
      '-row-mt',
      '1',
      '-cpu-used',
      '0',
      '-deadline',
      'best'
    ])
    expect(argv[argv.indexOf('-crf') + 1]).toBe('40')
  })

  it('libsvtav1: только MKV; -preset и -crf по пресету', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'libsvtav1',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mp4'
      })
    ).toThrow(FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'smaller',
      videoCodec: 'libsvtav1',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 4)).toEqual(['-c:v', 'libsvtav1', '-preset', '12'])
    expect(argv[argv.indexOf('-crf') + 1]).toBe('40')
  })

  it('libaom-av1: только MKV; -cpu-used и -crf', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'libaom-av1',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mov'
      })
    ).toThrow(FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'quality',
      videoCodec: 'libaom-av1',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 4)).toEqual(['-c:v', 'libaom-av1', '-cpu-used', '2'])
    expect(argv[argv.indexOf('-crf') + 1]).toBe('28')
  })

  it('librav1e: только MKV; -speed и -qp по пресету', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'librav1e',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mp4'
      })
    ).toThrow(FFMPEG_EXPORT_RAV1E_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'librav1e',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 4)).toEqual(['-c:v', 'librav1e', '-speed', '7'])
    expect(argv[argv.indexOf('-qp') + 1]).toBe('95')
  })

  it('prores_ks: только MOV; -profile:v и -vendor', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mkv',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'prores_ks',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mkv'
      })
    ).toThrow(FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mov',
      outputPath: 'out.mov',
      applyTrim: false,
      encodePreset: 'quality',
      videoCodec: 'prores_ks',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mov'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 6)).toEqual([
      '-c:v',
      'prores_ks',
      '-profile:v',
      '4',
      '-vendor',
      'apl0'
    ])
    expect(argv.includes('-pix_fmt')).toBe(false)
  })

  it('dnxhd: только MOV; DNxHR -profile:v', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'dnxhd',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mp4'
      })
    ).toThrow(FFMPEG_EXPORT_DNXHD_MOV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mov',
      outputPath: 'out.mov',
      applyTrim: false,
      encodePreset: 'smaller',
      videoCodec: 'dnxhd',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mov'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 4)).toEqual(['-c:v', 'dnxhd', '-profile:v', 'dnxhr_lb'])
    expect(argv.includes('-pix_fmt')).toBe(false)
  })

  it('ffv1: только MKV; -level -slicecrc -slices', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mov',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'ffv1',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mov'
      })
    ).toThrow(FFMPEG_EXPORT_FFV1_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'smaller',
      videoCodec: 'ffv1',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const j = argv.indexOf('-c:v')
    expect(argv.slice(j, j + 8)).toEqual([
      '-c:v',
      'ffv1',
      '-level',
      '1',
      '-slicecrc',
      '1',
      '-slices',
      '24'
    ])
    expect(argv.includes('-pix_fmt')).toBe(true)
  })

})
