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
