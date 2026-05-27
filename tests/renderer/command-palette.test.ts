import { describe, expect, it } from 'vitest'

import { filterCommandPaletteItems } from '../../src/renderer/src/app/command-palette'

describe('filterCommandPaletteItems', () => {
  it('returns all items for empty query', () => {
    const items = filterCommandPaletteItems('', [
      { id: 'a', label: 'Alpha', action: { type: 'toggle-rail' } }
    ])
    expect(items).toHaveLength(1)
  })

  it('filters by label and hint', () => {
    const items = filterCommandPaletteItems('загруз', [
      { id: 'a', label: 'Обработка', action: { type: 'toggle-rail' } },
      { id: 'b', label: 'Загрузки', hint: 'Перейти', action: { type: 'toggle-rail' } }
    ])
    expect(items.map((i) => i.id)).toEqual(['b'])
  })
})
