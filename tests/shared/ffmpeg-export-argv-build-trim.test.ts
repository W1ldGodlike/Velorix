import { describe, expect, it } from 'vitest'

import {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  formatFfmpegArgvForPreview
} from '../../src/shared/ffmpeg-export-argv'

describe('shared ffmpeg export argv — argv build, trim, preview helpers', () => {
  it('подставляет trim, override CRF, scale, fps и audio-none', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: '/src/clip.mov',
      outputPath: '/out/clip.mp4',
      trim: { inSec: 2.5, outSec: 7.5 },
      applyTrim: true,
      encodePreset: 'quality',
      crf: 20,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p'
    })
    // -ss до -i — обязательная позиция для быстрого seek через ключевые кадры в нашем варианте
    expect(argv.slice(0, 11)).toEqual([
      '-y',
      '-hide_banner',
      '-loglevel',
      'info',
      '-stats',
      '-ss',
      '2.5',
      '-i',
      '/src/clip.mov',
      '-t',
      '5'
    ])
    expect(argv).toContain('-crf')
    expect(argv[argv.indexOf('-crf') + 1]).toBe('20')
    expect(argv).toContain('-vf')
    expect(argv[argv.indexOf('-vf') + 1]).toBe('scale=-2:720,fps=30')
    expect(argv).toContain('-an')
    expect(argv).not.toContain('-c:a')
  })

  it('переключается на bitrate mode при заданном videoBitrate и оставляет crf вне argv', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mkv',
      container: 'mkv',
      applyTrim: false,
      encodePreset: 'balance',
      crf: 18,
      videoBitrate: '5000k',
      audioMode: 'aac',
      audioBitrate: '160k',
      fps: null,
      scalePreset: 'source'
    })
    expect(argv).not.toContain('-crf')
    expect(argv).toContain('-b:v')
    expect(argv[argv.indexOf('-b:v') + 1]).toBe('5000k')
    expect(argv[argv.indexOf('-b:a') + 1]).toBe('160k')
    expect(argv).not.toContain('-movflags')
    expect(argv[argv.length - 1]).toBe('out.mkv')
  })

  it('для MKV не добавляет -movflags; для MP4/MOV — faststart', () => {
    const mkv = buildFfmpegExportArgv({
      inputPath: 'a.mp4',
      outputPath: 'b.mkv',
      container: 'mkv',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source'
    })
    expect(mkv).not.toContain('-movflags')
    const mp4 = buildFfmpegExportArgv({
      inputPath: 'a.mp4',
      outputPath: 'b.mp4',
      container: 'mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source'
    })
    expect(mp4).toContain('-movflags')
    expect(mp4).toContain('+faststart')
  })

  it('formatFfmpegArgvForPreview оборачивает токены с пробелами/кавычками в кавычки', () => {
    const line = formatFfmpegArgvForPreview([
      '-i',
      'C:/with spaces/in.mp4',
      '-vf',
      'scale=-2:720',
      '"quoted"'
    ])
    expect(line).toBe('-i "C:/with spaces/in.mp4" -vf scale=-2:720 "\\"quoted\\""')
  })

  it('buildFfmpegExportPreviewCommand подставляет плейсхолдеры без путей', () => {
    const result = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source'
    })
    expect(result.command.startsWith('ffmpeg ')).toBe(true)
    expect(result.argv).toContain('<input>')
    expect(result.argv).toContain('<output>')
  })

  it('buildFfmpegExportPreviewCommand включает -ss/-t только при разумном trim', () => {
    const withTrim = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-export.mp4',
      trim: { inSec: 1, outSec: 4 }
    })
    expect(withTrim.argv).toContain('-ss')
    expect(withTrim.argv).toContain('-t')
    expect(withTrim.appliedTrim).toBe(true)

    const tooShort = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-export.mp4',
      trim: { inSec: 2, outSec: 2.01 }
    })
    expect(tooShort.argv).not.toContain('-ss')
    expect(tooShort.argv).not.toContain('-t')
    expect(tooShort.appliedTrim).toBe(false)

    const explicitOff = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-export.mp4',
      trim: { inSec: 1, outSec: 4 },
      applyTrim: false
    })
    expect(explicitOff.argv).not.toContain('-ss')
    expect(explicitOff.argv).not.toContain('-t')
    expect(explicitOff.appliedTrim).toBe(false)
  })

})
