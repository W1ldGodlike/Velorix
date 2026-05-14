import { describe, expect, it } from 'vitest'

import { formatFfprobeCreationTimeBrief } from '../../src/shared/ffprobe-creation-time-brief'

describe('formatFfprobeCreationTimeBrief', () => {
  it('ISO с T → только дата', () => {
    expect(formatFfprobeCreationTimeBrief({ creation_time: '2024-03-15T18:22:11.000000Z' })).toBe(
      'created 2024-03-15'
    )
  })

  it('дата без T → дата', () => {
    expect(formatFfprobeCreationTimeBrief({ creation_time: '2021-01-02 03:04:05' })).toBe(
      'created 2021-01-02'
    )
  })

  it('нестандартная строка — компактно с префиксом', () => {
    expect(formatFfprobeCreationTimeBrief({ creation_time: 'unknown stamp' })).toBe(
      'created unknown stamp'
    )
  })

  it('длинная строка обрезается', () => {
    const long = `${'x'.repeat(80)}end`
    const s = formatFfprobeCreationTimeBrief({ creation_time: long })
    expect(s).toMatch(/^created x+…$/)
    expect(s).not.toContain('end')
  })

  it('без тега — null', () => {
    expect(formatFfprobeCreationTimeBrief(undefined)).toBeNull()
    expect(formatFfprobeCreationTimeBrief({})).toBeNull()
  })
})
