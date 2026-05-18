import { describe, expect, it } from 'vitest'

import { EDITOR_EXPORT_PREVIEW_HINT_KEYS } from '../../src/shared/editor-export-preview-hint-keys'
import { resolveEditorExportPreviewHint } from '../../src/shared/editor-export-preview-hint-resolve'

const base = {
  extraArgsOk: true,
  hasPreviewSource: true,
  externalFilterKind: 'off' as const,
  externalFilterScriptAbsPath: null,
  pass1Command: null,
  appliedTrim: false,
  trimRange: null,
  probeDurationSec: 60
}

describe('resolveEditorExportPreviewHint', () => {
  it('covers every registry key', () => {
    const seen = new Set<string>()
    const cases: Array<{
      label: string
      input: Parameters<typeof resolveEditorExportPreviewHint>[0]
    }> = [
      { label: 'no source', input: { ...base, hasPreviewSource: false } },
      {
        label: 'external avisynth',
        input: {
          ...base,
          externalFilterKind: 'avisynth',
          externalFilterScriptAbsPath: 'C:\\filter.avs'
        }
      },
      { label: 'two pass', input: { ...base, pass1Command: 'ffmpeg -pass 1' } },
      {
        label: 'trim applied',
        input: {
          ...base,
          appliedTrim: true,
          trimRange: { inSec: 1, outSec: 5 }
        }
      },
      {
        label: 'trim full',
        input: {
          ...base,
          trimRange: { inSec: 0, outSec: 10 },
          probeDurationSec: 30
        }
      },
      {
        label: 'trim waiting',
        input: { ...base, trimRange: { inSec: 0, outSec: 10 }, probeDurationSec: null }
      }
    ]
    for (const { input } of cases) {
      const r = resolveEditorExportPreviewHint(input)
      expect(r.kind).toBe('hint')
      if (r.kind === 'hint') {
        seen.add(r.key)
      }
    }
    for (const key of EDITOR_EXPORT_PREVIEW_HINT_KEYS) {
      expect(seen.has(key), `scenario for ${key}`).toBe(true)
    }
  })

  it('extra args error takes precedence', () => {
    expect(resolveEditorExportPreviewHint({ ...base, extraArgsOk: false }).kind).toBe(
      'extraArgsError'
    )
  })
})
