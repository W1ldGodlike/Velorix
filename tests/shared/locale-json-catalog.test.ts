import { describe, expect, it } from 'vitest'

import {
  formatLocaleJsonCatalogDiagnosticLines,
  LOCALE_JSON_SHARDS,
  parseLocaleJsonShard
} from '../../src/shared/locale-json-catalog'

describe('locale-json-catalog', () => {
  it('parseLocaleJsonShard', () => {
    expect(parseLocaleJsonShard({ a: 'x' })).toEqual({ a: 'x' })
    expect(parseLocaleJsonShard({ a: '' })).toBeNull()
    expect(parseLocaleJsonShard([])).toBeNull()
  })

  it('formatLocaleJsonCatalogDiagnosticLines post-purge', () => {
    const lines = formatLocaleJsonCatalogDiagnosticLines()
    expect(lines.some((l) => l.includes('PURGE v3'))).toBe(true)
    expect(LOCALE_JSON_SHARDS.length).toBe(0)
  })
})
