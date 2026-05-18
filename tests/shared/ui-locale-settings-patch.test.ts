import { describe, expect, it } from 'vitest'

import { getBuiltinFfmpegExportUserPresets } from '../../src/shared/builtin-ffmpeg-export-user-presets'
import { patchAppSettingsUiLocale } from '../../src/shared/ui-locale-settings-patch'

describe('ui-locale-settings-patch §2.2', () => {
  it('patchAppSettingsUiLocale relabels builtin presets without restart', () => {
    const ru = getBuiltinFfmpegExportUserPresets('ru')
    const ruFirst = ru[0]!
    const custom = {
      id: 'user-custom',
      label: 'My preset',
      hint: 'unchanged',
      snapshot: ruFirst.snapshot
    }
    const patched = patchAppSettingsUiLocale(
      { theme: 'dark', ffmpegExportUserPresets: [...ru, custom] },
      'en'
    )
    expect(patched.uiLocale).toBe('en')
    const enBuiltin = getBuiltinFfmpegExportUserPresets('en')
    expect(patched.ffmpegExportUserPresets?.[0]?.label).toBe(enBuiltin[0]!.label)
    expect(patched.ffmpegExportUserPresets?.find((p) => p.id === 'user-custom')?.label).toBe(
      'My preset'
    )
  })
})
