import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_AUDIO_GAIN_DB_CASES,
  FFMPEG_EXPORT_CROP_FILTER_CASES,
  FFMPEG_EXPORT_ENCODE_PRESET_CASES,
  FFMPEG_EXPORT_FILTER_RESOLVE_CASES,
  FFMPEG_EXPORT_LUT_ESCAPE_CASES,
  FFMPEG_EXPORT_SCALE_FILTER_CASES,
  FFMPEG_EXPORT_SHOULD_APPLY_TRIM_CASES,
  FFMPEG_EXPORT_SUBTITLE_COPY_CODEC_CASES,
  FFMPEG_EXPORT_VIDEO_TRANSFORM_CASES,
  type FfmpegExportArgvFilterResolver
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  buildFfmpegExportLut3dFilter,
  buildFfmpegExportPreviewCommand,
  escapeFilePathForFfmpegFilter,
  formatFfmpegArgvForPreview,
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportEncodeParams,
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportSubtitleCopyCodec,
  resolveFfmpegExportVideoDebandFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter,
  resolveFfmpegExportVideoTransformFilters,
  shouldApplyFfmpegExportTrim
} from '../../src/shared/ffmpeg-export-argv'
import {
  FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_FLAC_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBVORBIS_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_DNXHD_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_FFV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_RAV1E_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
} from '../../src/shared/ffmpeg-export-contract'

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

describe('shared ffmpeg export argv', () => {
  it.each(FFMPEG_EXPORT_ENCODE_PRESET_CASES)(
    'resolveFfmpegExportEncodeParams($preset)',
    ({ preset, crf, x264preset }) => {
      expect(resolveFfmpegExportEncodeParams(preset)).toEqual({ crf, x264preset })
    }
  )

  it('economyMode: добавляет -threads 1 после баннера', () => {
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
      economyMode: true
    })
    const i = argv.indexOf('-threads')
    expect(argv.slice(i, i + 2)).toEqual(['-threads', '1'])
  })

  it('audioMode pcm_s16le: -c:a pcm_s16le без -b:a', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'pcm_s16le',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const i = argv.indexOf('-c:a')
    expect(argv.slice(i, i + 2)).toEqual(['-c:a', 'pcm_s16le'])
    expect(argv.includes('-b:a')).toBe(false)
  })

  it('audioMode libopus: только MKV; -c:a libopus -b:a', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'libx264',
        crf: null,
        videoBitrate: null,
        audioMode: 'libopus',
        audioBitrate: '128k',
        fps: null,
        scalePreset: 'source',
        container: 'mp4'
      })
    ).toThrow(FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'libopus',
      audioBitrate: '128k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const i = argv.indexOf('-c:a')
    expect(argv.slice(i, i + 4)).toEqual(['-c:a', 'libopus', '-b:a', '128k'])
  })

  it('audioMode flac: только MKV; -c:a flac без -b:a', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mov',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'libx264',
        crf: null,
        videoBitrate: null,
        audioMode: 'flac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        container: 'mov'
      })
    ).toThrow(FFMPEG_EXPORT_AUDIO_FLAC_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'flac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const i = argv.indexOf('-c:a')
    expect(argv.slice(i, i + 2)).toEqual(['-c:a', 'flac'])
    expect(argv.includes('-b:a')).toBe(false)
  })

  it('audioMode copy: -c:a copy без -filter:a', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'copy',
      audioBitrate: '192k',
      audioGainDb: 6,
      audioNormalize: 'loudnorm',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    const i = argv.indexOf('-c:a')
    expect(argv.slice(i, i + 2)).toEqual(['-c:a', 'copy'])
    expect(argv.includes('-filter:a')).toBe(false)
    expect(argv.includes('-b:a')).toBe(false)
  })

  it('audioMode libvorbis: только MKV; -c:a libvorbis -b:a', () => {
    expect(() =>
      buildFfmpegExportArgv({
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        applyTrim: false,
        encodePreset: 'balance',
        videoCodec: 'libx264',
        crf: null,
        videoBitrate: null,
        audioMode: 'libvorbis',
        audioBitrate: '160k',
        fps: null,
        scalePreset: 'source',
        container: 'mp4'
      })
    ).toThrow(FFMPEG_EXPORT_AUDIO_LIBVORBIS_MKV_ONLY_ERROR)

    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mkv',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'libvorbis',
      audioBitrate: '160k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const i = argv.indexOf('-c:a')
    expect(argv.slice(i, i + 4)).toEqual(['-c:a', 'libvorbis', '-b:a', '160k'])
  })

  it('audioMode libmp3lame и ac3: -c:a с -b:a', () => {
    const mp3 = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'libmp3lame',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mp4'
    })
    const mp3i = mp3.indexOf('-c:a')
    expect(mp3.slice(mp3i, mp3i + 4)).toEqual(['-c:a', 'libmp3lame', '-b:a', '192k'])

    const ac3 = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mkv',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'ac3',
      audioBitrate: '256k',
      fps: null,
      scalePreset: 'source',
      container: 'mkv'
    })
    const ac3i = ac3.indexOf('-c:a')
    expect(ac3.slice(ac3i, ac3i + 4)).toEqual(['-c:a', 'ac3', '-b:a', '256k'])
  })

  it('audioMode alac: -c:a alac без -b:a', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mov',
      outputPath: 'out.mov',
      applyTrim: false,
      encodePreset: 'balance',
      videoCodec: 'libx264',
      crf: null,
      videoBitrate: null,
      audioMode: 'alac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      container: 'mov'
    })
    const i = argv.indexOf('-c:a')
    expect(argv.slice(i, i + 2)).toEqual(['-c:a', 'alac'])
    expect(argv.includes('-b:a')).toBe(false)
  })

  it.each(FFMPEG_EXPORT_SCALE_FILTER_CASES)(
    'resolveFfmpegExportScaleFilter($preset)',
    ({ preset, filter }) => {
      expect(resolveFfmpegExportScaleFilter(preset)).toBe(filter)
    }
  )

  it.each(FFMPEG_EXPORT_VIDEO_TRANSFORM_CASES)(
    'resolveFfmpegExportVideoTransformFilters($id)',
    ({ id, filters }) => {
      expect(resolveFfmpegExportVideoTransformFilters(id)).toEqual(filters)
    }
  )

  it.each(FFMPEG_EXPORT_CROP_FILTER_CASES)(
    'resolveFfmpegExportCropFilter($preset)',
    ({ preset, filter }) => {
      expect(resolveFfmpegExportCropFilter(preset)).toBe(filter)
    }
  )

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
    expect(argv.slice(i - 4, i)).toEqual([
      '-hwaccel',
      'cuda',
      '-hwaccel_output_format',
      'cuda'
    ])
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
    expect(argv.slice(i - 4, i)).toEqual([
      '-hwaccel',
      'cuda',
      '-hwaccel_output_format',
      'cuda'
    ])
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
    expect(argv.slice(i - 4, i)).toEqual([
      '-hwaccel',
      'vaapi',
      '-hwaccel_output_format',
      'vaapi'
    ])
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

  it.each(FFMPEG_EXPORT_SHOULD_APPLY_TRIM_CASES)(
    'shouldApplyFfmpegExportTrim(%j, %j)',
    ({ trim, duration, expected }) => {
      expect(shouldApplyFfmpegExportTrim(trim, duration)).toBe(expected)
    }
  )

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

  it('buildFfmpegExportArgv §7 two-pass: первый проход только видеостатистика в null-sink', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:/in/file.mp4',
      outputPath: 'C:/out/file.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      twoPass: { pass: 1, passlogfile: 'Z:/tmp/ffpass', nullDevice: 'NUL' }
    })
    const pi = argv.indexOf('-pass')
    expect(argv[pi + 1]).toBe('1')
    expect(argv).toContain('-passlogfile')
    expect(argv[argv.indexOf('-passlogfile') + 1]).toBe('Z:/tmp/ffpass')
    expect(argv).toContain('-an')
    expect(argv[argv.indexOf('-f') + 1]).toBe('mp4')
    expect(argv.at(-1)).toBe('NUL')
    expect(argv).not.toContain('-movflags')
  })

  it('buildFfmpegExportArgv §7 two-pass: второй проход — обычный вывод с аудио', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'C:/in/file.mp4',
      outputPath: 'C:/out/file.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      twoPass: { pass: 2, passlogfile: 'Z:/tmp/ffpass', nullDevice: 'NUL' }
    })
    expect(argv[argv.indexOf('-pass') + 1]).toBe('2')
    expect(argv).toContain('-c:a')
    expect(argv.at(-1)).toBe('C:/out/file.mp4')
  })

  it.each(FFMPEG_EXPORT_AUDIO_GAIN_DB_CASES)(
    'normalizeFfmpegExportAudioGainDb(%j)',
    ({ raw, expected }) => {
      expect(normalizeFfmpegExportAudioGainDb(raw)).toBe(expected)
    }
  )

  it.each(FFMPEG_EXPORT_SUBTITLE_COPY_CODEC_CASES)(
    'resolveFfmpegExportSubtitleCopyCodec($container)',
    ({ container, codec }) => {
      expect(resolveFfmpegExportSubtitleCopyCodec(container)).toBe(codec)
    }
  )

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
