import { describe, expect, it } from 'vitest'

import {
  COMMAND_PALETTE_ITEMS,
  filterCommandPaletteItems
} from '../../src/renderer/src/app/command-palette'

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

describe('COMMAND_PALETTE_ITEMS', () => {
  it('includes NEON export/seek actions', () => {
    const ids = new Set(COMMAND_PALETTE_ITEMS.map((item) => item.id))
    expect(ids.has('batch-export-from-downloads')).toBe(true)
    expect(ids.has('export-trim-full-file')).toBe(true)
    expect(ids.has('seek-export-trim-in')).toBe(true)
    expect(ids.has('seek-export-trim-out')).toBe(true)
  })
})
