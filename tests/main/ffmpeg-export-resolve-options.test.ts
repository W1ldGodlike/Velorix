import { join } from 'path'
import { tmpdir } from 'os'
import { describe, expect, it } from 'vitest'

import {
  resolveFfmpegExportBatchOutputDirectoryFromSettings,
  resolveFfmpegExportBatchOutputSuffixFromSettings,
  resolveFfmpegExportJobOptionsFromAppSettings
} from '../../src/main/ffmpeg-export-resolve-from-settings'
import {
  buildFfmpegExportBatchOutputBasename,
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
} from '../../src/shared/ffmpeg-export-batch-output-suffix'
import { createAppSettingsBase } from '../fixtures/app-settings-base'

const base = createAppSettingsBase()

describe('resolveFfmpegExportJobOptionsFromAppSettings', () => {
  it('economyMode из settings и overrides', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportEconomyMode: true
      }).economyMode
    ).toBe(true)
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(base, { economyMode: true }).economyMode
    ).toBe(true)
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportEconomyMode: true },
        { economyMode: false }
      ).economyMode
    ).toBe(false)
  })

  it('twoPass только для libx264', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportTwoPass: true, ffmpegExportVideoBitrate: '2500k' },
        { videoCodec: 'libx265' }
      ).twoPass
    ).toBe(false)
  })

  it('пакет полей export settings + overrides (§7.2/§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoCodec: 'libx264',
        ffmpegExportContainer: 'mkv',
        ffmpegExportEncodePreset: 'quality',
        ffmpegExportCrf: 22,
        ffmpegExportScalePreset: '1080p',
        ffmpegExportStripMetadata: true,
        ffmpegExportVideoSharpen: 'light',
        ffmpegExportAudioNormalize: 'loudnorm',
        ffmpegExportVideoDeband: 'medium',
        ffmpegExportVideoHisteq: 'light',
        ffmpegExportVideoLut3d: 'film-warm',
        ffmpegExportVideoHue: 'warmShift',
        ffmpegExportVideoVignette: 'light',
        ffmpegExportVideoEqPreset: 'warm',
        ffmpegExportVideoGrain: 'light',
        ffmpegExportVideoBlur: 'medium',
        ffmpegExportVideoDeinterlace: 'frame',
        ffmpegExportAudioGainDb: 6,
        ffmpegExportVideoDenoise: 'medium',
        ffmpegExportAudioBitrate: '128k',
        ffmpegExportVideoBitrate: '2500k',
        ffmpegExportSubtitleMode: 'copy',
        ffmpegExportCropPreset: 'center-16-9',
        ffmpegExportVideoTransform: 'cw90',
        ffmpegExportExtraArgsLine: '-map 0',
        ffmpegExportStripChapters: true,
        ffmpegExportFps: 30,
        ffmpegExportTwoPass: true,
        ffmpegExportAudioMode: 'copy',
        ffmpegExportHwDecode: true
      })
    ).toMatchObject({
      videoCodec: 'libx264',
      container: 'mkv',
      encodePreset: 'quality',
      crf: 22,
      scalePreset: '1080p',
      stripMetadata: true,
      videoSharpen: 'light',
      audioNormalize: 'loudnorm',
      videoDeband: 'medium',
      videoHisteq: 'light',
      videoLut3d: 'film-warm',
      videoHue: 'warmShift',
      videoVignette: 'light',
      videoEqPreset: 'warm',
      videoGrain: 'light',
      videoBlur: 'medium',
      videoDeinterlace: 'frame',
      audioGainDb: 6,
      videoDenoise: 'medium',
      audioBitrate: '128k',
      videoBitrate: '2500k',
      subtitleMode: 'copy',
      cropPreset: 'center-16-9',
      videoTransform: 'cw90',
      extraArgsLine: '-map 0',
      stripChapters: true,
      fps: 30,
      twoPass: true,
      audioMode: 'copy',
      hwDecode: true
    })

    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportVideoCodec: 'libx265', ffmpegExportCrf: 22 },
        {
          videoCodec: 'h264_nvenc',
          container: 'mov',
          encodePreset: 'smaller',
          crf: 18,
          scalePreset: '720p',
          stripMetadata: false,
          videoSharpen: 'strong',
          audioNormalize: 'off',
          videoDeband: 'off',
          videoHisteq: 'strong',
          videoLut3d: 'punch',
          videoHue: 'satBoost',
          videoVignette: 'off',
          videoEqPreset: 'vivid',
          videoGrain: 'off',
          videoBlur: 'off',
          videoDeinterlace: 'field',
          audioGainDb: -3,
          videoDenoise: 'off',
          audioBitrate: '320k',
          videoBitrate: '4000k',
          subtitleMode: 'drop',
          cropPreset: 'none',
          videoTransform: 'hflip',
          extraArgsLine: '-tag:v hvc1',
          stripChapters: false,
          fps: 24,
          audioMode: 'none',
          hwDecode: false
        }
      )
    ).toMatchObject({
      videoCodec: 'h264_nvenc',
      container: 'mov',
      encodePreset: 'smaller',
      crf: 18,
      scalePreset: '720p',
      stripMetadata: false,
      videoSharpen: 'strong',
      audioNormalize: 'off',
      videoDeband: 'off',
      videoHisteq: 'strong',
      videoLut3d: 'punch',
      videoHue: 'satBoost',
      videoVignette: 'off',
      videoEqPreset: 'vivid',
      videoGrain: 'off',
      videoBlur: 'off',
      videoDeinterlace: 'field',
      audioGainDb: -3,
      videoDenoise: 'off',
      audioBitrate: '320k',
      videoBitrate: '4000k',
      subtitleMode: 'drop',
      cropPreset: 'none',
      videoTransform: 'hflip',
      extraArgsLine: '-tag:v hvc1',
      stripChapters: false,
      fps: 24,
      audioMode: 'none',
      hwDecode: false
    })
  })

  it('batch output suffix: default и кастомный шаблон (§7.3)', () => {
    expect(resolveFfmpegExportBatchOutputSuffixFromSettings(base)).toBe(
      DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
    )
    expect(
      resolveFfmpegExportBatchOutputSuffixFromSettings({
        ...base,
        ffmpegExportBatchOutputSuffix: '{stem}_out'
      })
    ).toBe('{stem}_out')
    expect(
      resolveFfmpegExportBatchOutputSuffixFromSettings({
        ...base,
        ffmpegExportBatchOutputSuffix: 'bad/path'
      })
    ).toBe(DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX)
  })

  it('batch suffix из settings → buildFfmpegExportBatchOutputBasename (§7.3)', () => {
    const suffix = resolveFfmpegExportBatchOutputSuffixFromSettings({
      ...base,
      ffmpegExportBatchOutputSuffix: '{stem}_done.{ext}'
    })
    expect(buildFfmpegExportBatchOutputBasename('D:\\v\\clip.mp4', suffix)).toBe('clip_done.mp4')
    const def = resolveFfmpegExportBatchOutputSuffixFromSettings(base)
    expect(buildFfmpegExportBatchOutputBasename('/v/clip.webm', def)).toBe('clip-export')
  })

  it('batch output directory: только абсолютный путь', () => {
    expect(resolveFfmpegExportBatchOutputDirectoryFromSettings(base)).toBeNull()
    expect(
      resolveFfmpegExportBatchOutputDirectoryFromSettings({
        ...base,
        ffmpegExportBatchOutputDirectory: 'relative/out'
      })
    ).toBeNull()
    const abs = join(tmpdir(), 'fa-batch-out')
    expect(
      resolveFfmpegExportBatchOutputDirectoryFromSettings({
        ...base,
        ffmpegExportBatchOutputDirectory: abs
      })
    ).toBe(abs)
  })
})
