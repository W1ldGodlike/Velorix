import { describe, expect, it } from 'vitest'

import {
  parseYtdlpQueueRetryProfile,
  resolveYtdlpQueueRetryPlan
} from '../../src/main/services/ytdlp/ytdlp-queue-retry'

describe('parseYtdlpQueueRetryProfile', () => {
  it('распознаёт корректные значения', () => {
    expect(parseYtdlpQueueRetryProfile('off')).toBe('off')
    expect(parseYtdlpQueueRetryProfile('light')).toBe('light')
    expect(parseYtdlpQueueRetryProfile('normal')).toBe('normal')
    expect(parseYtdlpQueueRetryProfile('persistent')).toBe('persistent')
  })

  it('падает в off для мусора и неправильных типов', () => {
    expect(parseYtdlpQueueRetryProfile('aggressive')).toBe('off')
    expect(parseYtdlpQueueRetryProfile(undefined)).toBe('off')
    expect(parseYtdlpQueueRetryProfile(null)).toBe('off')
    expect(parseYtdlpQueueRetryProfile(123)).toBe('off')
  })
})

describe('resolveYtdlpQueueRetryPlan', () => {
  it('off — нет повторов', () => {
    expect(resolveYtdlpQueueRetryPlan('off')).toEqual({ extraAttempts: 0, delaysMs: [] })
  })

  it('light — один повтор с одной задержкой', () => {
    const p = resolveYtdlpQueueRetryPlan('light')
    expect(p.extraAttempts).toBe(1)
    expect(p.delaysMs).toHaveLength(1)
    expect(p.delaysMs[0]).toBeGreaterThan(0)
  })

  it('normal — два повтора, длина задержек = extraAttempts', () => {
    const p = resolveYtdlpQueueRetryPlan('normal')
    expect(p.extraAttempts).toBe(2)
    expect(p.delaysMs).toHaveLength(2)
    expect(p.delaysMs).toHaveLength(2)
    expect(p.delaysMs[1]!).toBeGreaterThanOrEqual(p.delaysMs[0]!)
  })

  it('persistent — три повтора с растущими паузами', () => {
    const p = resolveYtdlpQueueRetryPlan('persistent')
    expect(p.extraAttempts).toBe(3)
    expect(p.delaysMs).toEqual([5000, 15000, 45000])
  })
})
