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

  it('formatLocaleJsonCatalogDiagnosticLines', () => {
    const lines = formatLocaleJsonCatalogDiagnosticLines()
    expect(lines.some((l) => l.includes('check:locales-json'))).toBe(true)
    expect(lines.some((l) => l.includes('common'))).toBe(true)
    expect(lines.some((l) => l.includes('about'))).toBe(true)
    expect(LOCALE_JSON_SHARDS.length).toBe(11)
    expect(LOCALE_JSON_SHARDS).toContain('maintenance')
    expect(LOCALE_JSON_SHARDS).toContain('formatting')
    expect(LOCALE_JSON_SHARDS).toContain('knowledge')
    expect(LOCALE_JSON_SHARDS).toContain('terminal')
    expect(LOCALE_JSON_SHARDS).toContain('processing')
    expect(LOCALE_JSON_SHARDS).toContain('downloads')
    expect(LOCALE_JSON_SHARDS).toContain('workspace')
    expect(LOCALE_JSON_SHARDS).toContain('editor')
    expect(LOCALE_JSON_SHARDS).toContain('downloads-settings')
  })
})
