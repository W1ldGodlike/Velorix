import { describe, expect, it } from 'vitest'

import { outcomeFromQueueStatus } from '../../src/main/ytdlp-download-history'

describe('outcomeFromQueueStatus', () => {
  it('маппит финальные статусы очереди §6.1', () => {
    expect(outcomeFromQueueStatus('Готово')).toBe('success')
    expect(outcomeFromQueueStatus('Отменено')).toBe('cancelled')
    expect(outcomeFromQueueStatus('Ошибка (код 1)')).toBe('error')
    expect(outcomeFromQueueStatus('Ошибка: spawn failed')).toBe('error')
  })

  it('игнорирует пробелы по краям', () => {
    expect(outcomeFromQueueStatus('  Готово  ')).toBe('success')
    expect(outcomeFromQueueStatus('\tОтменено\n')).toBe('cancelled')
  })
})
