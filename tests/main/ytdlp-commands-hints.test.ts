import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({
  app: {
    getAppPath: () => process.cwd()
  }
}))
vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

import { sortYtdlpCommandHintsForUi } from '../../src/main/ytdlp-commands-hints'

describe('sortYtdlpCommandHintsForUi §6.3', () => {
  it('ставит «Справка» перед «Форматы и кодеки», токены внутри группы — по алфавиту', () => {
    const sorted = sortYtdlpCommandHintsForUi([
      { token: '-f', summary: 'x', category: 'Форматы и кодеки' },
      { token: '--help', summary: 'x', category: 'Справка' },
      { token: '-F', summary: 'x', category: 'Форматы и кодеки' }
    ])
    expect(sorted.map((e) => e.token)).toEqual(['--help', '-f', '-F'])
  })

  it('неизвестная категория сортируется рядом с хвостом списка', () => {
    const sorted = sortYtdlpCommandHintsForUi([
      { token: '--z', summary: '', category: 'ZZZ-нет-в-порядке' },
      { token: '--help', summary: '', category: 'Справка' }
    ])
    expect(sorted[0]?.token).toBe('--help')
  })
})
