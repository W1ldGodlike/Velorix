import { describe, expect, it } from 'vitest'

import { resolveExternalFilterScriptForPreview } from '../../src/shared/external-filter-script-resolve-preview'

describe('resolveExternalFilterScriptForPreview', () => {
  it('returns off when kind is off', () => {
    expect(
      resolveExternalFilterScriptForPreview({
        ffmpegExportExternalFilterKind: 'off',
        ffmpegExportExternalFilterScriptPath: 'C:\\x\\a.vpy'
      })
    ).toEqual({ kind: 'off', scriptAbsPath: null })
  })

  it('accepts matching extension without exists check', () => {
    const r = resolveExternalFilterScriptForPreview({
      ffmpegExportExternalFilterKind: 'vapoursynth',
      ffmpegExportExternalFilterScriptPath: 'D:\\scripts\\filter.vpy'
    })
    expect(r.kind).toBe('vapoursynth')
    expect(r.scriptAbsPath).toMatch(/filter\.vpy$/i)
  })
})
