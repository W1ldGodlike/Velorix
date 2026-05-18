import { describe, expect, it } from 'vitest'

import { buildMiniPlayerSnapshot } from '../../src/shared/mini-player-snapshot-build'

const idleExport = {
  exportPercent: null as number | null,
  exportMessage: null as string | null,
  exportSpeed: null as string | null
}

describe('buildMiniPlayerSnapshot §4.3', () => {
  it('idle when no tasks', () => {
    const s = buildMiniPlayerSnapshot({
      exportActive: false,
      downloadActive: false,
      downloadProgress: null,
      downloadSpeed: null,
      downloadStatus: null,
      ...idleExport
    })
    expect(s.hasActiveWork).toBe(false)
    expect(s.progressPercent).toBeNull()
  })

  it('parses download percent and speed', () => {
    const s = buildMiniPlayerSnapshot({
      exportActive: false,
      downloadActive: true,
      downloadProgress: '42.5%',
      downloadSpeed: '1.2MiB/s',
      downloadStatus: 'Загрузка',
      ...idleExport
    })
    expect(s.hasActiveWork).toBe(true)
    expect(s.progressPercent).toBe(42.5)
    expect(s.detailLine).toContain('42.5%')
    expect(s.detailLine).toContain('1.2MiB/s')
  })

  it('shows ffmpeg export percent and speed', () => {
    const s = buildMiniPlayerSnapshot({
      exportActive: true,
      downloadActive: false,
      downloadProgress: null,
      downloadSpeed: null,
      downloadStatus: null,
      exportPercent: 33.3,
      exportMessage: 'frame=100',
      exportSpeed: '1.04x'
    })
    expect(s.detailLine).toBe('33.3% · 1.04x')
    expect(s.progressPercent).toBe(33.3)
  })

  it('merges export and download lines when both active', () => {
    const s = buildMiniPlayerSnapshot({
      exportActive: true,
      downloadActive: true,
      downloadProgress: '10%',
      downloadSpeed: '800KiB/s',
      downloadStatus: 'DL',
      exportPercent: 50,
      exportMessage: null,
      exportSpeed: '2x'
    })
    expect(s.detailLine).toContain('50%')
    expect(s.detailLine).toContain('2x')
    expect(s.detailLine).toContain('10%')
    expect(s.progressPercent).toBe(10)
  })
})
