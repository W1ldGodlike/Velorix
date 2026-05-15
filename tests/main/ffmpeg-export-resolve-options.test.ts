import { describe, expect, it } from 'vitest'

import { resolveFfmpegExportJobOptionsFromAppSettings } from '../../src/main/ffmpeg-export-resolve-from-settings'
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
})
