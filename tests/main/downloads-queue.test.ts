import { afterEach, describe, expect, it } from 'vitest'

import {
  appendUrlsFromMultilineBlock,
  clearDownloadsQueue,
  clearFinishedDownloadsQueueRows,
  enqueueFirstWaitingUrlFromBlock,
  extractFirstQueueUrlLine,
  getDownloadsQueueSnapshot,
  resetDownloadsQueueRowForRetry,
  updateDownloadsRow
} from '../../src/main/services/downloads/downloads-queue'

afterEach(() => {
  clearDownloadsQueue()
})

describe('enqueue first URL from block', () => {
  it('extractFirstQueueUrlLine берёт первую подходящую строку', () => {
    expect(extractFirstQueueUrlLine(' \nhttps://a.test/x\nhttps://b.test/y')).toBe(
      'https://a.test/x'
    )
    expect(extractFirstQueueUrlLine('not a url')).toBeNull()
  })

  it('enqueueFirstWaitingUrlFromBlock добавляет одну строку', () => {
    const r = enqueueFirstWaitingUrlFromBlock('https://only.one/here\nhttps://ignored')
    expect(r?.url).toBe('https://only.one/here')
    expect(getDownloadsQueueSnapshot()).toHaveLength(1)
    expect(getDownloadsQueueSnapshot()[0]!.id).toBe(r!.id)
  })
})

describe('downloads queue cleanup', () => {
  it('удаляет завершённые строки и оставляет ожидание/активную паузу', () => {
    appendUrlsFromMultilineBlock(
      [
        'https://example.com/waiting',
        'https://example.com/done',
        'https://example.com/error',
        'https://example.com/cancelled',
        'https://example.com/pause'
      ].join('\n')
    )
    const rows = getDownloadsQueueSnapshot()
    expect(rows.length).toBeGreaterThanOrEqual(5)
    updateDownloadsRow(rows[1]!.id, { status: 'Готово' })
    updateDownloadsRow(rows[2]!.id, { status: 'Ошибка (код 1)' })
    updateDownloadsRow(rows[3]!.id, { status: 'Отменено' })
    updateDownloadsRow(rows[4]!.id, { status: 'Пауза перед повтором (1/2)…' })

    expect(clearFinishedDownloadsQueueRows()).toBe(3)
    expect(getDownloadsQueueSnapshot().map((row) => row.url)).toEqual([
      'https://example.com/waiting',
      'https://example.com/pause'
    ])
  })
})

describe('downloads queue output path', () => {
  it('сохраняет путь готового файла и очищает его при retry', () => {
    appendUrlsFromMultilineBlock('https://example.com/video')
    const row = getDownloadsQueueSnapshot()[0]
    expect(row).toBeDefined()

    updateDownloadsRow(row!.id, { status: 'Готово', outputPath: 'C:\\Downloads\\video.mp4' })
    expect(getDownloadsQueueSnapshot()[0]!.outputPath).toBe('C:\\Downloads\\video.mp4')

    expect(resetDownloadsQueueRowForRetry(row!.id)).toBe(true)
    const reset = getDownloadsQueueSnapshot()[0]
    expect(reset).toBeDefined()
    expect(reset!.status).toBe('Ожидание')
    expect(reset!.outputPath).toBeUndefined()
  })

  it('частичный patch не затирает queue* поля, если их не передали', () => {
    appendUrlsFromMultilineBlock('https://example.com/x')
    const row = getDownloadsQueueSnapshot()[0]
    expect(row).toBeDefined()
    updateDownloadsRow(row!.id, {
      queueSpeed: '3.2 MB/s',
      queueEta: '00:01',
      progress: '50%'
    })
    updateDownloadsRow(row!.id, { status: 'Готово', progress: '100%' })
    const r = getDownloadsQueueSnapshot()[0]
    expect(r?.queueSpeed).toBe('3.2 MB/s')
    expect(r?.queueEta).toBe('00:01')
  })

  it('очищает вспомогательные поля таблицы v0 при retry', () => {
    appendUrlsFromMultilineBlock('https://example.com/x')
    const row = getDownloadsQueueSnapshot()[0]
    expect(row).toBeDefined()
    updateDownloadsRow(row!.id, {
      queueFmt: '398',
      queueSize: '10MiB',
      queueSpeed: '1MiB/s',
      queueEta: '00:12'
    })
    expect(resetDownloadsQueueRowForRetry(row!.id)).toBe(true)
    const r = getDownloadsQueueSnapshot()[0]
    expect(r?.queueFmt).toBeUndefined()
    expect(r?.queueSize).toBeUndefined()
    expect(r?.queueSpeed).toBeUndefined()
    expect(r?.queueEta).toBeUndefined()
  })
})
