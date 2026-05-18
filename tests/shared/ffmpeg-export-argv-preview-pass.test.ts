import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_AUDIO_GAIN_DB_CASES,
  FFMPEG_EXPORT_SHOULD_APPLY_TRIM_CASES,
  FFMPEG_EXPORT_SUBTITLE_COPY_CODEC_CASES
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportSubtitleCopyCodec,
  shouldApplyFfmpegExportTrim
} from '../../src/shared/ffmpeg-export-argv'

describe('shared ffmpeg export argv — preview command and two-pass', () => {
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

  it('buildFfmpegExportPreviewCommand включает внешний скрипт в -vf', () => {
    const preview = buildFfmpegExportPreviewCommand({
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      externalFilterKind: 'vapoursynth',
      externalFilterScriptAbsPath: 'C:/scripts/x.vpy'
    })
    const vfIdx = preview.argv.indexOf('-vf')
    expect(vfIdx).toBeGreaterThan(-1)
    expect(preview.argv[vfIdx + 1]).toContain('vapoursynth=filename=')
  })
})
