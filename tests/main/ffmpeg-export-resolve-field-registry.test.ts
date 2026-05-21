import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_RESOLVE_FIELD_SPECS,
  resolveFfmpegExportFieldFromSettings
} from '../../src/main/services/ffmpeg/ffmpeg-export-resolve-field-registry'
import type { ResolvedFfmpegExportJobOptions } from '../../src/shared/ffmpeg-export-resolve-contract'
import { createAppSettingsBase } from '../fixtures/app-settings-base'

type ResolveRegistryKey = Exclude<keyof ResolvedFfmpegExportJobOptions, 'twoPass' | 'extraArgsLine'>

const base = createAppSettingsBase()

describe('ffmpeg-export-resolve-field-registry', () => {
  it('реестр покрывает все ключи ResolvedFfmpegExportJobOptions кроме twoPass/extraArgsLine', () => {
    const keys = new Set(FFMPEG_EXPORT_RESOLVE_FIELD_SPECS.map((s) => s.resultKey))
    const expected: ResolveRegistryKey[] = [
      'encodePreset',
      'videoCodec',
      'container',
      'crf',
      'videoBitrate',
      'audioMode',
      'audioBitrate',
      'fps',
      'scalePreset',
      'videoTransform',
      'cropPreset',
      'economyMode',
      'hwDecode',
      'audioGainDb',
      'stripMetadata',
      'stripChapters',
      'subtitleMode',
      'videoDenoise',
      'videoDeband',
      'videoHisteq',
      'videoLut3d',
      'videoSharpen',
      'videoEqPreset',
      'videoHue',
      'videoGrain',
      'videoVignette',
      'videoBlur',
      'videoDeinterlace',
      'audioNormalize'
    ]
    for (const key of expected) {
      expect(keys.has(key)).toBe(true)
    }
    expect(FFMPEG_EXPORT_RESOLVE_FIELD_SPECS.length).toBe(expected.length)
  })

  it('resolveFfmpegExportFieldFromSettings — strip overrideOnUndefined', () => {
    const spec = FFMPEG_EXPORT_RESOLVE_FIELD_SPECS.find((s) => s.overrideKey === 'stripMetadata')!
    expect(
      resolveFfmpegExportFieldFromSettings<boolean | null>(
        { stripMetadata: false },
        { ...base, ffmpegExportStripMetadata: true },
        spec
      )
    ).toBe(false)
    expect(
      resolveFfmpegExportFieldFromSettings<boolean | null>(
        {},
        { ...base, ffmpegExportStripMetadata: true },
        spec
      )
    ).toBe(true)
  })
})
