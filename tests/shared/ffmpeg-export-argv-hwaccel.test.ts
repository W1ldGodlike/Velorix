import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'

describe('shared ffmpeg export argv — hwaccel and hardware encode', () => {
  it('hwaccelDecode вставляется перед -i с output format', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
      hwaccelDecode: 'cuda',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual(['-hwaccel', 'cuda', '-hwaccel_output_format', 'cuda'])
  })

  it('hwaccelDecode qsv: output format qsv перед -i', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_qsv',
      hwaccelDecode: 'qsv',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual(['-hwaccel', 'qsv', '-hwaccel_output_format', 'qsv'])
  })

  it('h264_vaapi: -vf начинается с hwupload', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_vaapi',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4',
      videoTransform: 'hflip'
    })
    const vfIdx = argv.indexOf('-vf')
    const vf = argv[vfIdx + 1] ?? ''
    expect(vf.startsWith('format=nv12,hwupload,')).toBe(true)
    expect(vf).toContain('hflip')
  })

  it('h264_qsv: -vf начинается с QSV hwupload-цепочки', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_qsv',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4',
      videoTransform: 'hflip'
    })
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith('format=nv12,hwupload=extra_hw_frames=64,format=qsv,')).toBe(true)
    expect(vf).toContain('hflip')
  })

  it('h264_amf: -vf начинается с AMF hwupload-цепочки', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_amf',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: '720p',
      container: 'mp4'
    })
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith('format=nv12,hwupload,format=d3d11,')).toBe(true)
    expect(vf).toContain('scale=')
  })

  it('h264_nvenc + CPU -vf: префикс hwupload_cuda', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4',
      videoTransform: 'hflip'
    })
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith('format=nv12,hwupload_cuda,')).toBe(true)
    expect(vf).toContain('hflip')
  })

  it('h264_nvenc без -vf: без hwupload_cuda', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    expect(argv.includes('-vf')).toBe(false)
  })

  it('§16 регрессия: nvenc + cuda hwaccel + CPU vf — output format и hwupload_cuda', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
      hwaccelDecode: 'cuda',
      crf: null,
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
    expect(vf.startsWith('format=nv12,hwupload_cuda,')).toBe(true)
    expect(vf).toContain('hflip')
    expect(argv).toContain('h264_nvenc')
  })

  it('§16 регрессия: vaapi encode + vaapi hwaccel + crop', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_vaapi',
      hwaccelDecode: 'vaapi',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv',
      cropPreset: 'center-square'
    })
    const i = argv.indexOf('-i')
    expect(argv.slice(i - 4, i)).toEqual(['-hwaccel', 'vaapi', '-hwaccel_output_format', 'vaapi'])
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf.startsWith('format=nv12,hwupload,')).toBe(true)
    expect(vf).toContain('crop=')
  })

  it('h264_nvenc: без libx264-preset, VBR + cq; hevc_nvenc + mp4 даёт hvc1', () => {
    const h264 = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    const cv = h264.indexOf('-c:v')
    expect(h264.slice(cv, cv + 2)).toEqual(['-c:v', 'h264_nvenc'])
    expect(h264).toContain('-preset')
    expect(h264).toContain('-rc:v')
    expect(h264).toContain('vbr')
    expect(h264).toContain('-cq:v')
    expect(h264[h264.indexOf('-cq:v') + 1]).toBe('23')
    expect(h264.includes('libx264')).toBe(false)

    const hevc = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'smaller',
      videoCodec: 'hevc_nvenc',
      crf: 30,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    expect(hevc).toContain('-tag:v')
    expect(hevc).toContain('hvc1')
    expect(hevc[hevc.indexOf('-cq:v') + 1]).toBe('30')
  })

  it('h264_nvenc + videoBitrate: -b:v без -cq', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
      crf: null,
      videoBitrate: '5M',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    expect(argv).toContain('-b:v')
    expect(argv[argv.indexOf('-b:v') + 1]).toBe('5M')
    expect(argv.includes('-cq:v')).toBe(false)
  })

  it('h264_videotoolbox: -q:v при CRF-режиме', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mov',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'h264_videotoolbox',
      crf: 23,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mov'
    })
    expect(argv[argv.indexOf('-c:v') + 1]).toBe('h264_videotoolbox')
    expect(argv).toContain('-q:v')
    expect(typeof argv[argv.indexOf('-q:v') + 1]).toBe('string')
  })
})
