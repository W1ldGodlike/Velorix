import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_FILTER_RESOLVE_CASES,
  FFMPEG_EXPORT_LUT_ESCAPE_CASES,
  type FfmpegExportArgvFilterResolver
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  buildFfmpegExportLut3dFilter,
  buildFfmpegExportPreviewCommand,
  escapeFilePathForFfmpegFilter,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoDebandFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter
} from '../../src/shared/ffmpeg-export-argv'

const FFMPEG_EXPORT_FILTER_RESOLVERS: Record<
  FfmpegExportArgvFilterResolver,
  (id: string) => string | null
> = {
  denoise: (id) => resolveFfmpegExportVideoDenoiseFilter(id as 'off'),
  sharpen: (id) => resolveFfmpegExportVideoSharpenFilter(id as 'off'),
  deband: (id) => resolveFfmpegExportVideoDebandFilter(id as 'off'),
  grain: (id) => resolveFfmpegExportVideoGrainFilter(id as 'off'),
  vignette: (id) => resolveFfmpegExportVideoVignetteFilter(id as 'off'),
  blur: (id) => resolveFfmpegExportVideoBlurFilter(id as 'off'),
  deinterlace: (id) => resolveFfmpegExportVideoDeinterlaceFilter(id as 'off'),
  histeq: (id) => resolveFfmpegExportVideoHisteqFilter(id as 'off'),
  hue: (id) => resolveFfmpegExportVideoHueFilter(id as 'off'),
  eq: (id) => resolveFfmpegExportVideoEqFilter(id as 'off'),
  audioNormalize: (id) => resolveFfmpegExportAudioNormalizeFilter(id as 'off')
}

describe('shared ffmpeg export argv — filters, metadata, subtitles, LUT', () => {
  it('audioGainDb добавляет -filter:a volume только при aac и ненулевом сдвиге', () => {
    const withGain = buildFfmpegExportArgv({
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
      audioGainDb: -3
    })
    expect(withGain).toContain('-filter:a')
    expect(withGain[withGain.indexOf('-filter:a') + 1]).toBe('volume=-3dB')

    const zeroGain = buildFfmpegExportArgv({
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
      audioGainDb: 0
    })
    expect(zeroGain).not.toContain('-filter:a')

    const audioOff = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      audioGainDb: 6
    })
    expect(audioOff).toContain('-an')
    expect(audioOff).not.toContain('-filter:a')
  })

  it('stripMetadata/stripChapters добавляют -map_metadata/-map_chapters перед -c:v', () => {
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
      stripMetadata: true,
      stripChapters: true
    })
    const codecIdx = argv.indexOf('-c:v')
    const metaIdx = argv.indexOf('-map_metadata')
    const chapIdx = argv.indexOf('-map_chapters')
    expect(metaIdx).toBeGreaterThanOrEqual(0)
    expect(chapIdx).toBeGreaterThanOrEqual(0)
    expect(metaIdx).toBeLessThan(codecIdx)
    expect(chapIdx).toBeLessThan(codecIdx)
    expect(argv[metaIdx + 1]).toBe('-1')
    expect(argv[chapIdx + 1]).toBe('-1')
  })

  it('subtitleMode=copy маппит дорожки и подбирает codec под контейнер', () => {
    const mkv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      container: 'mkv',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      subtitleMode: 'copy'
    })
    expect(mkv).toContain('-c:s')
    expect(mkv[mkv.indexOf('-c:s') + 1]).toBe('copy')
    expect(mkv).toContain('-map')
    // как минимум 3 -map (video/audio/sub) перед -c:s
    const subIdx = mkv.indexOf('-c:s')
    const beforeSub = mkv.slice(0, subIdx)
    expect(beforeSub.filter((t) => t === '-map').length).toBe(3)

    const mp4 = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      container: 'mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      subtitleMode: 'copy'
    })
    expect(mp4[mp4.indexOf('-c:s') + 1]).toBe('mov_text')
  })

  it('subtitleMode=drop (по умолчанию) не меняет argv для базовой ветки', () => {
    const baseline = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source'
    })
    const dropped = buildFfmpegExportArgv({
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
      subtitleMode: 'drop'
    })
    expect(dropped).toEqual(baseline)
  })

  it('buildFfmpegExportPreviewCommand пробрасывает gain/strip/subtitle в обе строки twoPass', () => {
    const result = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: '5000k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-out.mp4',
      twoPass: true,
      audioGainDb: 6,
      stripMetadata: true,
      stripChapters: true,
      subtitleMode: 'copy'
    })
    expect(result.pass1Command).toBeDefined()
    // В первом проходе нет аудио — gain и subtitle map игнорируются, но strip остаётся.
    expect(result.pass1Command).toContain('-map_metadata')
    expect(result.pass1Command).toContain('-map_chapters')
    expect(result.pass1Command).not.toContain('-filter:a')
    expect(result.pass1Command).not.toContain('-c:s')
    // Второй проход — полный набор фильтров аудио и subtitle copy.
    expect(result.command).toContain('-filter:a')
    expect(result.command).toContain('volume=6dB')
    expect(result.command).toContain('-c:s')
    expect(result.command).toContain('mov_text')
  })

  it.each(FFMPEG_EXPORT_FILTER_RESOLVE_CASES)(
    'filter resolver $resolver $id',
    ({ resolver, id, expected }) => {
      expect(FFMPEG_EXPORT_FILTER_RESOLVERS[resolver](id)).toBe(expected)
    }
  )

  it.each(FFMPEG_EXPORT_LUT_ESCAPE_CASES)(
    'escapeFilePathForFfmpegFilter($path)',
    ({ path, escaped }) => {
      expect(escapeFilePathForFfmpegFilter(path)).toBe(escaped)
    }
  )

  it('buildFfmpegExportLut3dFilter', () => {
    expect(buildFfmpegExportLut3dFilter('D:/luts/film-warm.cube')).toBe(
      "lut3d=file='D\\:/luts/film-warm.cube':interp=trilinear"
    )
  })

  it('denoise и sharpen встают между crop и scale, перед fps', () => {
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
      cropPreset: 'center-square',
      videoDeinterlace: 'frame',
      videoDenoise: 'medium',
      videoDeband: 'light',
      videoHisteq: 'medium',
      videoLut3dCubeAbsPath: 'D:/l/f.cube',
      videoSharpen: 'light',
      videoEqPreset: 'vivid',
      videoHue: 'warmShift',
      videoGrain: 'medium',
      videoVignette: 'strong',
      videoBlur: 'medium'
    })
    const vf = argv[argv.indexOf('-vf') + 1] ?? ''
    expect(vf).toBe(
      "transpose=1,crop=min(iw\\,ih):min(iw\\,ih),yadif,hqdn3d=3:3:6:6,deband=range=12,histeq=strength=0.26,lut3d=file='D\\:/l/f.cube':interp=trilinear,unsharp=5:5:0.6:5:5:0.0,eq=contrast=1.10:saturation=1.20,hue=h=-11:s=1.03,noise=alls=5:allf=u,vignette=angle=PI/10,gblur=sigma=2.5,scale=-2:720,fps=30"
    )
  })

  it('audioNormalize склеивается с gain в один -filter:a и выключается без аудио', () => {
    const withNormalize = buildFfmpegExportArgv({
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
      audioGainDb: 3,
      audioNormalize: 'loudnorm'
    })
    expect(withNormalize).toContain('-filter:a')
    expect(withNormalize[withNormalize.indexOf('-filter:a') + 1]).toBe(
      'volume=3dB,loudnorm=I=-16:LRA=11:TP=-1.5'
    )

    const audioOff = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      audioNormalize: 'dynaudnorm'
    })
    expect(audioOff).toContain('-an')
    expect(audioOff).not.toContain('-filter:a')
  })

  it('off-пресеты denoise/sharpen не меняют baseline argv', () => {
    const baseline = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source'
    })
    const explicit = buildFfmpegExportArgv({
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
      videoDenoise: 'off',
      videoSharpen: 'off'
    })
    expect(explicit).toEqual(baseline)
  })

  it('buildFfmpegExportPreviewCommand пробрасывает denoise/sharpen в обе строки twoPass', () => {
    const result = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: '5000k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-out.mp4',
      twoPass: true,
      videoDenoise: 'strong',
      videoSharpen: 'medium'
    })
    expect(result.pass1Command).toBeDefined()
    expect(result.pass1Command).toContain('hqdn3d=5:5:10:10')
    expect(result.pass1Command).toContain('unsharp=5:5:1.0:5:5:0.0')
    expect(result.command).toContain('hqdn3d=5:5:10:10')
    expect(result.command).toContain('unsharp=5:5:1.0:5:5:0.0')
  })

  it('buildFfmpegExportPreviewCommand даёт две строки при twoPass+birate', () => {
    const r = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      inputPath: '/a.mp4',
      outputPath: '/a-out.mp4',
      twoPass: true
    })
    expect(r.pass1Command).toBeDefined()
    expect(r.pass1Command).toContain('<passlog>')
    expect(r.pass1Command).toContain('<discard>')
    expect(r.command).toContain('-pass')
    expect(r.command).not.toContain('<discard>')
  })
})
