import { describe, expect, it } from 'vitest'

import {
  coerceUiLocaleBroadcastPayload,
  formatUiLocaleIpcDiagnosticLines
} from '../../src/shared/ui-locale-runtime'

describe('ui-locale-runtime', () => {
  it('coerceUiLocaleBroadcastPayload', () => {
    expect(coerceUiLocaleBroadcastPayload('en')).toBe('en')
    expect(coerceUiLocaleBroadcastPayload('ru')).toBe('ru')
    expect(coerceUiLocaleBroadcastPayload('de')).toBeUndefined()
    expect(coerceUiLocaleBroadcastPayload(null)).toBeUndefined()
  })

  it('formatUiLocaleIpcDiagnosticLines', () => {
    const lines = formatUiLocaleIpcDiagnosticLines()
    expect(lines.some((l) => l.includes('purged'))).toBe(true)
  })
})
