import { describe, expect, it } from 'vitest'

import { FFMPEG_EXPORT_ENCODE_PRESET_CASES } from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  resolveFfmpegExportEncodeParams
} from '../../src/shared/ffmpeg-export-argv'
import {
  FFMPEG_EXPORT_AUDIO_FLAC_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBVORBIS_MKV_ONLY_ERROR
} from '../../src/shared/ffmpeg-export-contract'

describe('shared ffmpeg export argv — encode preset and audio modes', () => {
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
})
