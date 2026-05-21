import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({
  app: {
    getAppPath: () => process.cwd()
  }
}))
vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

import {
  getYtdlpCommandHints,
  sortYtdlpCommandHintsForUi
} from '../../src/main/services/ytdlp/ytdlp-commands-hints'

describe('sortYtdlpCommandHintsForUi §6.3', () => {
  it('ставит «Справка» перед «Форматы и кодеки», токены внутри группы — по алфавиту', () => {
    const sorted = sortYtdlpCommandHintsForUi(
      [
        { token: '-f', summary: 'x', category: 'Форматы и кодеки' },
        { token: '--help', summary: 'x', category: 'Справка' },
        { token: '-F', summary: 'x', category: 'Форматы и кодеки' }
      ],
      'ru'
    )
    expect(sorted.map((e) => e.token)).toEqual(['--help', '-f', '-F'])
  })

  it('неизвестная категория сортируется рядом с хвостом списка', () => {
    const sorted = sortYtdlpCommandHintsForUi(
      [
        { token: '--z', summary: '', category: 'ZZZ-нет-в-порядке' },
        { token: '--help', summary: '', category: 'Справка' }
      ],
      'ru'
    )
    expect(sorted[0]?.token).toBe('--help')
  })

  it('en: Help before Formats & codecs', () => {
    const sorted = sortYtdlpCommandHintsForUi(
      [
        { token: '-f', summary: 'x', category: 'Formats & codecs' },
        { token: '--help', summary: 'x', category: 'Help' }
      ],
      'en'
    )
    expect(sorted.map((e) => e.token)).toEqual(['--help', '-f'])
  })
})

describe('getYtdlpCommandHints §6.3', () => {
  it('maps token categories and summaries to English when locale is en', () => {
    const hints = getYtdlpCommandHints('en')
    const help = hints.find((h) => h.token === '--help')
    expect(help?.category).toBe('Help')
    expect(help?.summary).toMatch(/^Show help/)
    const proxy = hints.find((h) => h.token === '--proxy')
    expect(proxy?.category).toBe('Network & HTTP')
    expect(proxy?.summary).toContain('HTTP')
  })
})
