import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  appendProcessingHistoryEntry,
  clearProcessingHistory,
  findProcessingHistoryEntryById,
  getProcessingHistoryWeeklySummary,
  PROCESSING_HISTORY_SCHEMA,
  readProcessingHistoryNewestFirst
} from '../../src/main/processing-history'

const tempRoots: string[] = []

function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'flux-processing-history-'))
  tempRoots.push(dir)
  return dir
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop()
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
})

describe('processing-history', () => {
  it('добавляет записи и читает новые первыми', () => {
    const root = makeTempRoot()
    appendProcessingHistoryEntry(root, {
      id: 'export-a',
      kind: 'ffmpegExport',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'C:/media/in-a.mp4',
      outputPath: 'C:/media/out-a.mp4',
      outcome: 'success',
      status: 'Экспорт завершён',
      errorHint: null
    })
    appendProcessingHistoryEntry(root, {
      id: 'snap-b',
      kind: 'ffmpegSnapshot',
      startedAt: 3,
      finishedAt: 4,
      inputPath: 'C:/media/in-b.mp4',
      outputPath: 'C:/media/frame-b.png',
      outcome: 'success',
      status: 'Snapshot сохранён',
      errorHint: null
    })

    expect(readProcessingHistoryNewestFirst(root).map((entry) => entry.id)).toEqual([
      'snap-b',
      'export-a'
    ])
  })

  it('фильтрует по kind/outcome/query', () => {
    const root = makeTempRoot()
    appendProcessingHistoryEntry(root, {
      id: 'auto-ok',
      kind: 'autoExport',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'C:/clips/cat.mp4',
      outputPath: 'C:/clips/cat-export.mp4',
      outcome: 'success',
      status: 'Авто-экспорт завершён',
      errorHint: null
    })
    appendProcessingHistoryEntry(root, {
      id: 'export-fail',
      kind: 'ffmpegExport',
      startedAt: 3,
      finishedAt: 4,
      inputPath: 'C:/clips/dog.mp4',
      outputPath: null,
      outcome: 'error',
      status: 'Ошибка',
      errorHint: 'Invalid data found'
    })

    expect(readProcessingHistoryNewestFirst(root, { kind: 'autoExport' }).map((e) => e.id)).toEqual(
      ['auto-ok']
    )
    expect(readProcessingHistoryNewestFirst(root, { outcome: 'error' }).map((e) => e.id)).toEqual([
      'export-fail'
    ])
    expect(
      readProcessingHistoryNewestFirst(root, { query: 'cat-export' }).map((e) => e.id)
    ).toEqual(['auto-ok'])
  })

  it('находит запись по id для безопасного открытия результата из main', () => {
    const root = makeTempRoot()
    appendProcessingHistoryEntry(root, {
      id: 'export-a',
      kind: 'ffmpegExport',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      outcome: 'success',
      status: 'ok',
      errorHint: null
    })

    expect(findProcessingHistoryEntryById(root, 'export-a')?.outputPath).toBe('out.mp4')
    expect(findProcessingHistoryEntryById(root, 'missing')).toBeNull()
  })

  it('считает недельную сводку по исходам, типам и длительности', () => {
    const root = makeTempRoot()
    const now = 10_000_000_000
    appendProcessingHistoryEntry(root, {
      id: 'old',
      kind: 'ffmpegExport',
      startedAt: now - 9 * 24 * 60 * 60 * 1000,
      finishedAt: now - 9 * 24 * 60 * 60 * 1000 + 10,
      inputPath: 'old-in',
      outputPath: 'old-out',
      outcome: 'success',
      status: 'old',
      errorHint: null
    })
    appendProcessingHistoryEntry(root, {
      id: 'ok',
      kind: 'ffmpegExport',
      startedAt: now - 1000,
      finishedAt: now - 500,
      inputPath: 'in-a',
      outputPath: 'out-a',
      outcome: 'success',
      status: 'ok',
      errorHint: null
    })
    appendProcessingHistoryEntry(root, {
      id: 'fail',
      kind: 'ffmpegSnapshot',
      startedAt: now - 300,
      finishedAt: now - 100,
      inputPath: 'in-b',
      outputPath: null,
      outcome: 'error',
      status: 'fail',
      errorHint: 'boom'
    })

    expect(getProcessingHistoryWeeklySummary(root, now)).toMatchObject({
      total: 2,
      success: 1,
      error: 1,
      cancelled: 0,
      ffmpegExport: 1,
      ffmpegSnapshot: 1,
      autoExport: 0,
      totalDurationMs: 700
    })
  })

  it('очищает историю валидным schema-файлом', () => {
    const root = makeTempRoot()
    appendProcessingHistoryEntry(root, {
      id: 'a',
      kind: 'ffmpegExport',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'in',
      outputPath: 'out',
      outcome: 'success',
      status: 'ok',
      errorHint: null
    })
    clearProcessingHistory(root)

    const raw = JSON.parse(readFileSync(join(root, 'processing', 'history.json'), 'utf-8')) as {
      schema: unknown
      entries: unknown
    }
    expect(raw).toEqual({ schema: PROCESSING_HISTORY_SCHEMA, entries: [] })
    expect(readProcessingHistoryNewestFirst(root)).toEqual([])
  })
})
