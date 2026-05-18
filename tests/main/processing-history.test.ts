import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  appendProcessingHistoryEntry,
  clearProcessingHistory,
  findProcessingHistoryEntryById,
  getProcessingHistoryWeeklySummary,
  onProcessingHistoryChanged,
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
    appendProcessingHistoryEntry(root, {
      id: 'scenario-ok',
      kind: 'workflowScenario',
      startedAt: 5,
      finishedAt: 6,
      inputPath: 'C:/watch/in.mp4',
      outputPath: 'C:/watch/out.mp4',
      outcome: 'success',
      status: 'Сценарий завершён',
      errorHint: null
    })

    expect(readProcessingHistoryNewestFirst(root, { kind: 'autoExport' }).map((e) => e.id)).toEqual(
      ['auto-ok']
    )
    expect(
      readProcessingHistoryNewestFirst(root, { kind: 'workflowScenario' }).map((e) => e.id)
    ).toEqual(['scenario-ok'])
    expect(readProcessingHistoryNewestFirst(root, { outcome: 'error' }).map((e) => e.id)).toEqual([
      'export-fail'
    ])
    expect(
      readProcessingHistoryNewestFirst(root, { query: 'cat-export' }).map((e) => e.id)
    ).toEqual(['auto-ok'])
  })

  it('сохраняет exportVideoCodecUsed и ищет по нему', () => {
    const root = makeTempRoot()
    appendProcessingHistoryEntry(root, {
      id: 'with-codec',
      kind: 'ffmpegExport',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'C:/in.mp4',
      outputPath: 'C:/out.mp4',
      outcome: 'success',
      status: 'ok',
      errorHint: null,
      exportVideoCodecUsed: 'h264_nvenc'
    })
    const rows = readProcessingHistoryNewestFirst(root)
    expect(rows[0]?.exportVideoCodecUsed).toBe('h264_nvenc')
    expect(readProcessingHistoryNewestFirst(root, { query: 'nvenc' }).map((e) => e.id)).toEqual([
      'with-codec'
    ])
  })

  it('сохраняет workflowScenarioId и ищет по нему', () => {
    const root = makeTempRoot()
    appendProcessingHistoryEntry(root, {
      id: 'with-scenario',
      kind: 'workflowScenario',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'C:/watch/in.mp4',
      outputPath: 'C:/watch/out.mp4',
      outcome: 'success',
      status: 'workflow demo',
      errorHint: null,
      workflowScenarioId: 'scenario-1'
    })
    expect(readProcessingHistoryNewestFirst(root)[0]?.workflowScenarioId).toBe('scenario-1')
    expect(
      readProcessingHistoryNewestFirst(root, { query: 'scenario-1' }).map((e) => e.id)
    ).toEqual(['with-scenario'])
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
    appendProcessingHistoryEntry(root, {
      id: 'scenario',
      kind: 'workflowScenario',
      startedAt: now - 200,
      finishedAt: now - 50,
      inputPath: 'watch-in',
      outputPath: 'watch-out',
      outcome: 'success',
      status: 'scenario ok',
      errorHint: null
    })

    expect(getProcessingHistoryWeeklySummary(root, now)).toMatchObject({
      total: 3,
      success: 2,
      error: 1,
      cancelled: 0,
      ffmpegExport: 1,
      ffmpegSnapshot: 1,
      autoExport: 0,
      workflowScenario: 1,
      totalDurationMs: 850
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

  it('уведомляет подписчиков при append и clear', () => {
    const root = makeTempRoot()
    let count = 0
    const off = onProcessingHistoryChanged(() => {
      count += 1
    })
    appendProcessingHistoryEntry(root, {
      id: 'notify-a',
      kind: 'workflowScenario',
      startedAt: 1,
      finishedAt: 2,
      inputPath: 'C:/media/in.mp4',
      outputPath: null,
      outcome: 'success',
      status: 'ok',
      errorHint: null,
      workflowScenarioId: 'scenario-1'
    })
    expect(count).toBe(1)
    clearProcessingHistory(root)
    expect(count).toBe(2)
    off()
    appendProcessingHistoryEntry(root, {
      id: 'notify-b',
      kind: 'ffmpegExport',
      startedAt: 3,
      finishedAt: 4,
      inputPath: 'in',
      outputPath: 'out',
      outcome: 'success',
      status: 'ok',
      errorHint: null
    })
    expect(count).toBe(2)
  })
})
