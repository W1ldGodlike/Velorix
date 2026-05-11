import { describe, expect, it } from 'vitest'

import { groupYtdlpCommandHintsByCategory } from '../../src/shared/ytdlp-command-hints-group'

describe('groupYtdlpCommandHintsByCategory §6.3', () => {
  it('возвращает пустой массив без подсказок', () => {
    expect(groupYtdlpCommandHintsByCategory(undefined)).toEqual([])
    expect(groupYtdlpCommandHintsByCategory([])).toEqual([])
  })

  it('группирует по категории и сортирует неизвестные категории по ru', () => {
    const g = groupYtdlpCommandHintsByCategory([
      { token: '--b', summary: '', category: 'Бета' },
      { token: '--a', summary: '', category: 'Альфа' }
    ])
    expect(g.map(([c]) => c)).toEqual(['Альфа', 'Бета'])
    expect(g[0]?.[1].map((h) => h.token)).toEqual(['--a'])
  })

  it('известные категории §6.3 — порядок как в main, не по алфавиту', () => {
    const g = groupYtdlpCommandHintsByCategory([
      { token: '-f', summary: '', category: 'Форматы и кодеки' },
      { token: '--help', summary: '', category: 'Справка' }
    ])
    expect(g.map(([c]) => c)).toEqual(['Справка', 'Форматы и кодеки'])
  })

  it('пустая категория → «Прочее»', () => {
    const g = groupYtdlpCommandHintsByCategory([{ token: '-x', summary: '', category: '  ' }])
    expect(g[0]?.[0]).toBe('Прочее')
  })

  it('фильтр по подстроке токена или summary', () => {
    const g = groupYtdlpCommandHintsByCategory(
      [
        { token: '--cookies', summary: 'browser', category: 'Сеть' },
        { token: '-f', summary: 'format', category: 'Форматы' }
      ],
      'cookie'
    )
    expect(g.flatMap(([, rows]) => rows).map((h) => h.token)).toEqual(['--cookies'])
  })
})
