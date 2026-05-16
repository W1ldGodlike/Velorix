import { join } from 'path'
import { tmpdir } from 'os'
import { describe, expect, it } from 'vitest'

import {
  resolveFfmpegExportBatchOutputDirectoryFromSettings,
  resolveFfmpegExportBatchOutputSuffixFromSettings,
  resolveFfmpegExportJobOptionsFromAppSettings
} from '../../src/main/ffmpeg-export-resolve-from-settings'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../src/shared/ffmpeg-export-batch-output-suffix'
import type { AppSettings } from '../../src/shared/settings-contract'

const base: AppSettings = {
  uiLocale: 'ru',
  theme: 'dark'
}

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

  it('videoCodec и container из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoCodec: 'libx265',
        ffmpegExportContainer: 'mkv'
      }).videoCodec
    ).toBe('libx265')
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoCodec: 'libx265',
        ffmpegExportContainer: 'mkv'
      }).container
    ).toBe('mkv')
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(base, {
        videoCodec: 'h264_nvenc',
        container: 'mov'
      }).videoCodec
    ).toBe('h264_nvenc')
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportVideoCodec: 'libx265' },
        { videoCodec: 'libx264' }
      ).videoCodec
    ).toBe('libx264')
  })

  it('encodePreset, crf, scalePreset и stripMetadata из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportEncodePreset: 'quality',
        ffmpegExportCrf: 22,
        ffmpegExportScalePreset: '1080p',
        ffmpegExportStripMetadata: true
      })
    ).toMatchObject({
      encodePreset: 'quality',
      crf: 22,
      scalePreset: '1080p',
      stripMetadata: true
    })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportEncodePreset: 'quality', ffmpegExportCrf: 22 },
        {
          encodePreset: 'smaller',
          crf: 18,
          scalePreset: '720p',
          stripMetadata: false
        }
      )
    ).toMatchObject({
      encodePreset: 'smaller',
      crf: 18,
      scalePreset: '720p',
      stripMetadata: false
    })
  })

  it('twoPass и audioMode из settings (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoCodec: 'libx264',
        ffmpegExportTwoPass: true,
        ffmpegExportVideoBitrate: '2500k',
        ffmpegExportAudioMode: 'copy'
      })
    ).toMatchObject({ twoPass: true, audioMode: 'copy' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportAudioMode: 'copy' },
        { audioMode: 'none' }
      ).audioMode
    ).toBe('none')
  })

  it('extraArgsLine, stripChapters и fps из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportExtraArgsLine: '-map 0',
        ffmpegExportStripChapters: true,
        ffmpegExportFps: 30
      })
    ).toMatchObject({
      extraArgsLine: '-map 0',
      stripChapters: true,
      fps: 30
    })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportExtraArgsLine: '-map 0', ffmpegExportFps: 30 },
        { extraArgsLine: '-tag:v hvc1', stripChapters: false, fps: 24 }
      )
    ).toMatchObject({
      extraArgsLine: '-tag:v hvc1',
      stripChapters: false,
      fps: 24
    })
  })

  it('videoSharpen и audioNormalize из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoSharpen: 'light',
        ffmpegExportAudioNormalize: 'loudnorm'
      })
    ).toMatchObject({ videoSharpen: 'light', audioNormalize: 'loudnorm' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportAudioNormalize: 'loudnorm' },
        { videoSharpen: 'strong', audioNormalize: 'off' }
      )
    ).toMatchObject({ videoSharpen: 'strong', audioNormalize: 'off' })
  })

  it('videoHue и videoVignette из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoHue: 'warmShift',
        ffmpegExportVideoVignette: 'light'
      })
    ).toMatchObject({ videoHue: 'warmShift', videoVignette: 'light' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportVideoVignette: 'light' },
        { videoHue: 'satBoost', videoVignette: 'off' }
      )
    ).toMatchObject({ videoHue: 'satBoost', videoVignette: 'off' })
  })

  it('videoEqPreset и videoGrain из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoEqPreset: 'warm',
        ffmpegExportVideoGrain: 'light'
      })
    ).toMatchObject({ videoEqPreset: 'warm', videoGrain: 'light' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportVideoEqPreset: 'warm' },
        { videoEqPreset: 'vivid', videoGrain: 'off' }
      )
    ).toMatchObject({ videoEqPreset: 'vivid', videoGrain: 'off' })
  })

  it('videoBlur и videoDeinterlace из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoBlur: 'medium',
        ffmpegExportVideoDeinterlace: 'frame'
      })
    ).toMatchObject({ videoBlur: 'medium', videoDeinterlace: 'frame' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportVideoDeinterlace: 'frame' },
        { videoBlur: 'off', videoDeinterlace: 'field' }
      )
    ).toMatchObject({ videoBlur: 'off', videoDeinterlace: 'field' })
  })

  it('audioGainDb и videoDenoise из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportAudioGainDb: 6,
        ffmpegExportVideoDenoise: 'medium'
      })
    ).toMatchObject({ audioGainDb: 6, videoDenoise: 'medium' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportVideoDenoise: 'medium' },
        { audioGainDb: -3, videoDenoise: 'off' }
      )
    ).toMatchObject({ audioGainDb: -3, videoDenoise: 'off' })
  })

  it('audioBitrate из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportAudioBitrate: '128k'
      }).audioBitrate
    ).toBe('128k')
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportAudioBitrate: '128k' },
        { audioBitrate: '320k' }
      ).audioBitrate
    ).toBe('320k')
  })

  it('videoBitrate и subtitleMode из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportVideoBitrate: '2500k',
        ffmpegExportSubtitleMode: 'copy'
      })
    ).toMatchObject({ videoBitrate: '2500k', subtitleMode: 'copy' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportSubtitleMode: 'copy' },
        { videoBitrate: '4000k', subtitleMode: 'drop' }
      )
    ).toMatchObject({ videoBitrate: '4000k', subtitleMode: 'drop' })
  })

  it('cropPreset и videoTransform из settings и overrides (§7.3)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportCropPreset: 'center-16-9',
        ffmpegExportVideoTransform: 'cw90'
      })
    ).toMatchObject({ cropPreset: 'center-16-9', videoTransform: 'cw90' })
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportCropPreset: 'center-16-9' },
        { cropPreset: 'none', videoTransform: 'hflip' }
      )
    ).toMatchObject({ cropPreset: 'none', videoTransform: 'hflip' })
  })

  it('hwDecode из settings и overrides (§7.3 batch/single)', () => {
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings({
        ...base,
        ffmpegExportHwDecode: true
      }).hwDecode
    ).toBe(true)
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(base, { hwDecode: true }).hwDecode
    ).toBe(true)
    expect(
      resolveFfmpegExportJobOptionsFromAppSettings(
        { ...base, ffmpegExportHwDecode: true },
        { hwDecode: false }
      ).hwDecode
    ).toBe(false)
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
