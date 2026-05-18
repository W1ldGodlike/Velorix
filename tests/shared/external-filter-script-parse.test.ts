import { describe, expect, it } from 'vitest'

import {
  externalFilterScriptPathMatchesKind,
  parseExternalFilterScriptKind
} from '../../src/shared/external-filter-script-parse'

describe('external-filter-script-parse', () => {
  it('kind whitelist', () => {
    expect(parseExternalFilterScriptKind('vapoursynth')).toBe('vapoursynth')
    expect(parseExternalFilterScriptKind('bogus')).toBe('off')
  })

  it('extension match', () => {
    expect(externalFilterScriptPathMatchesKind('C:/a/script.vpy', 'vapoursynth')).toBe(true)
    expect(externalFilterScriptPathMatchesKind('C:/a/script.avs', 'vapoursynth')).toBe(false)
  })
})
