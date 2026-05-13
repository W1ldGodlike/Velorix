import { describe, expect, it } from 'vitest'

import { compareYtdlpHintCategoryKeys } from '../../src/shared/ytdlp-hint-category-order'

describe('ytdlp-hint-category-order §6.3', () => {
  it('compareYtdlpHintCategoryKeys: фиксированный порядок известных групп', () => {
    expect(compareYtdlpHintCategoryKeys('Форматы и кодеки', 'Справка')).toBeGreaterThan(0)
    expect(compareYtdlpHintCategoryKeys('Справка', 'Форматы и кодеки')).toBeLessThan(0)
  })

  it('en: Help sorts before Formats & codecs', () => {
    expect(compareYtdlpHintCategoryKeys('Formats & codecs', 'Help', 'en')).toBeGreaterThan(0)
    expect(compareYtdlpHintCategoryKeys('Help', 'Formats & codecs', 'en')).toBeLessThan(0)
  })

  it('одинаковый rank неизвестных — по ru', () => {
    expect(compareYtdlpHintCategoryKeys('Бета', 'Альфа')).toBeGreaterThan(0)
  })
})
