import { describe, expect, it } from 'vitest'

import {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  formatFfmpegArgvForPreview,
  resolveFfmpegExportEncodeParams,
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportVideoTransformFilters,
  shouldApplyFfmpegExportTrim
} from '../../src/shared/ffmpeg-export-argv'

describe('shared ffmpeg export argv', () => {
  it('даёт CRF и x264 preset под системные пресеты §7.2', () => {
    expect(resolveFfmpegExportEncodeParams('balance')).toEqual({ crf: '23', x264preset: 'fast' })
    expect(resolveFfmpegExportEncodeParams('smaller')).toEqual({ crf: '28', x264preset: 'fast' })
    expect(resolveFfmpegExportEncodeParams('quality')).toEqual({ crf: '18', x264preset: 'medium' })
  })

  it('возвращает scale-фильтр только для непустых пресетов', () => {
    expect(resolveFfmpegExportScaleFilter('source')).toBeNull()
    expect(resolveFfmpegExportScaleFilter('480p')).toBe('scale=-2:480')
    expect(resolveFfmpegExportScaleFilter('1080p')).toBe('scale=-2:1080')
  })

  it('whitelist videoTransform — только известные фрагменты -vf', () => {
    expect(resolveFfmpegExportVideoTransformFilters('none')).toEqual([])
    expect(resolveFfmpegExportVideoTransformFilters('cw90')).toEqual(['transpose=1'])
    expect(resolveFfmpegExportVideoTransformFilters('ccw90')).toEqual(['transpose=2'])
    expect(resolveFfmpegExportVideoTransformFilters('r180')).toEqual(['transpose=1', 'transpose=1'])
    expect(resolveFfmpegExportVideoTransformFilters('hflip')).toEqual(['hflip'])
    expect(resolveFfmpegExportVideoTransformFilters('vflip')).toEqual(['vflip'])
  })

  it('whitelist cropPreset — только предустановленные crop-фильтры §7.2', () => {
    expect(resolveFfmpegExportCropFilter('none')).toBeNull()
    expect(resolveFfmpegExportCropFilter('center-square')).toBe('crop=min(iw\\,ih):min(iw\\,ih)')
    expect(resolveFfmpegExportCropFilter('center-16-9')).toBe(
      'crop=min(iw\\,ih*16/9):min(ih\\,iw*9/16)'
    )
  })

  it('трансформ и crop идут в -vf перед scale и fps §7.2', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p',
      videoTransform: 'cw90',
      cropPreset: 'center-square'
    })
    expect(argv[argv.indexOf('-vf') + 1]).toBe(
      'transpose=1,crop=min(iw\\,ih):min(iw\\,ih),scale=-2:720,fps=30'
    )
  })

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

  it('shouldApplyFfmpegExportTrim фильтрует вырожденные и почти полные диапазоны', () => {
    // Базовый диапазон без длительности — применяем.
    expect(shouldApplyFfmpegExportTrim({ inSec: 1, outSec: 4 }, null)).toBe(true)
    // Слишком короткий — нет.
    expect(shouldApplyFfmpegExportTrim({ inSec: 2, outSec: 2.01 }, null)).toBe(false)
    // Маркеры покрывают весь файл (с допуском) — нет.
    expect(shouldApplyFfmpegExportTrim({ inSec: 0, outSec: 19.9 }, 20)).toBe(false)
    // Сдвинутый In > 0.08 при близкой длине — применяем (ffmpeg реально режет).
    expect(shouldApplyFfmpegExportTrim({ inSec: 0.5, outSec: 19.9 }, 20)).toBe(true)
    // Без маркеров — нет.
    expect(shouldApplyFfmpegExportTrim(null, 20)).toBe(false)
    // NaN маркеры — нет, без падения.
    expect(shouldApplyFfmpegExportTrim({ inSec: Number.NaN, outSec: 5 }, null)).toBe(false)
  })

  it('buildFfmpegExportPreviewCommand с probeDurationSec повторяет логику main-сервиса', () => {
    // Маркеры почти на весь файл — preview должен пропустить -ss/-t, как и spawn.
    const fullClip = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-export.mp4',
      trim: { inSec: 0, outSec: 19.9 },
      probeDurationSec: 20
    })
    expect(fullClip.argv).not.toContain('-ss')
    expect(fullClip.appliedTrim).toBe(false)

    // Реальный фрагмент в середине файла — -ss/-t появляются.
    const midClip = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-export.mp4',
      trim: { inSec: 5, outSec: 12 },
      probeDurationSec: 20
    })
    expect(midClip.argv).toContain('-ss')
    expect(midClip.argv[midClip.argv.indexOf('-ss') + 1]).toBe('5')
    expect(midClip.argv[midClip.argv.indexOf('-t') + 1]).toBe('7')
    expect(midClip.appliedTrim).toBe(true)
  })

  it('buildFfmpegExportPreviewCommand передаёт container в argv (MKV без movflags)', () => {
    const mkvPreview = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      container: 'mkv',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/x.mp4',
      outputPath: '/x-export.mkv'
    })
    expect(mkvPreview.argv).not.toContain('-movflags')
  })
})
