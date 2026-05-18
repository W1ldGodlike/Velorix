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
    expect(LOCALE_JSON_SHARDS.length).toBe(25)
    expect(LOCALE_JSON_SHARDS).toContain('maintenance')
    expect(LOCALE_JSON_SHARDS).toContain('formatting')
    expect(LOCALE_JSON_SHARDS).toContain('knowledge')
    expect(LOCALE_JSON_SHARDS).toContain('terminal')
    expect(LOCALE_JSON_SHARDS).toContain('processing')
    expect(LOCALE_JSON_SHARDS).toContain('downloads')
    expect(LOCALE_JSON_SHARDS).toContain('workspace')
    expect(LOCALE_JSON_SHARDS).toContain('editor')
    expect(LOCALE_JSON_SHARDS).toContain('video')
    expect(LOCALE_JSON_SHARDS).toContain('mini')
    expect(LOCALE_JSON_SHARDS).toContain('downloads-settings')
    expect(LOCALE_JSON_SHARDS).toContain('shell')
    expect(LOCALE_JSON_SHARDS).toContain('editor-ffmpeg')
    expect(LOCALE_JSON_SHARDS).toContain('status')
    expect(LOCALE_JSON_SHARDS).toContain('batch-export')
    expect(LOCALE_JSON_SHARDS).toContain('settings')
    expect(LOCALE_JSON_SHARDS).toContain('inspector')
    expect(LOCALE_JSON_SHARDS).toContain('inspector-probe')
    expect(LOCALE_JSON_SHARDS).toContain('hw-manual-smoke')
    expect(LOCALE_JSON_SHARDS).toContain('win-packaged-manual-smoke')
    expect(LOCALE_JSON_SHARDS).toContain('linux-packaged-manual-smoke')
    expect(LOCALE_JSON_SHARDS).toContain('macos-packaged-manual-smoke')
    expect(LOCALE_JSON_SHARDS).toContain('workflow')
  })
})
