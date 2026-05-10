import { describe, expect, it } from 'vitest'

import { formatFfprobeDispositionSummary } from '../../src/shared/ffprobe-disposition'

describe('ffprobe-disposition', () => {
  it('пустое / не объект → ""', () => {
    expect(formatFfprobeDispositionSummary(undefined)).toBe('')
    expect(formatFfprobeDispositionSummary(null)).toBe('')
    expect(formatFfprobeDispositionSummary([])).toBe('')
  })

  it('собирает известные флаги по-русски', () => {
    const s = formatFfprobeDispositionSummary({
      default: 1,
      forced: 0,
      original: 1
    })
    expect(s).toContain('по умолчанию')
    expect(s).toContain('оригинал')
    expect(s).not.toContain('принудительно')
  })

  it('добавляет неизвестный truthy ключ', () => {
    expect(formatFfprobeDispositionSummary({ future_flag_xyz: 1 })).toBe('future_flag_xyz')
  })
})
