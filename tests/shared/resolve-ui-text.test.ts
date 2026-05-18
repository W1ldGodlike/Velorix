import { describe, expect, it } from 'vitest'

import { resolveUiTextKey, type UiTextTablesLike } from '../../src/shared/resolve-ui-text'

function miniTables(ru: Record<string, string>, en: Record<string, string>): UiTextTablesLike {
  return { ru, en }
}

describe('resolveUiTextKey §6.4', () => {
  it('returns primary locale string', () => {
    const tables = miniTables({ foo: 'Привет' }, { foo: 'Hello' })
    expect(resolveUiTextKey(tables, 'ru', 'foo')).toBe('Привет')
  })

  it('falls back to EN when RU missing', () => {
    const tables = miniTables({}, { bar: 'English only' })
    expect(resolveUiTextKey(tables, 'ru', 'bar')).toBe('English only')
  })

  it('returns key when both locales missing', () => {
    const tables = miniTables({}, {})
    expect(resolveUiTextKey(tables, 'ru', 'missingKey')).toBe('missingKey')
  })
})
