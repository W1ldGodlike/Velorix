import { describe, expect, it } from 'vitest'

import { buildMiniPlayerSnapshot } from '../../src/shared/mini-player-snapshot-build'

describe('buildMiniPlayerSnapshot §4.3', () => {
  it('idle when no tasks', () => {
    const s = buildMiniPlayerSnapshot({
      exportActive: false,
      downloadActive: false,
      downloadProgress: null,
      downloadSpeed: null,
      downloadStatus: null
    })
    expect(s.hasActiveWork).toBe(false)
    expect(s.progressPercent).toBeNull()
  })

  it('parses download percent', () => {
    const s = buildMiniPlayerSnapshot({
      exportActive: false,
      downloadActive: true,
      downloadProgress: '42.5%',
      downloadSpeed: '1.2MiB/s',
      downloadStatus: 'Загрузка'
    })
    expect(s.hasActiveWork).toBe(true)
    expect(s.progressPercent).toBe(42.5)
    expect(s.detailLine).toContain('42.5%')
  })
})
