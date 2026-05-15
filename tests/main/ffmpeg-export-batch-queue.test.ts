import { describe, expect, it, beforeEach } from 'vitest'

import {
  FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
  FFMPEG_EXPORT_BATCH_STATUS_DONE,
  FFMPEG_EXPORT_BATCH_STATUS_ERROR,
  FFMPEG_EXPORT_BATCH_STATUS_WAITING
} from '../../src/shared/ffmpeg-export-batch-contract'
import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot,
  listFfmpegExportBatchInputPaths,
  removeWaitingFfmpegExportBatchRows,
  moveFfmpegExportBatchRow,
  removeCompletedFfmpegExportBatchRows,
  removeFfmpegExportBatchRows,
  reorderFfmpegExportBatchRowAt,
  retryFailedFfmpegExportBatchRows,
  retryFfmpegExportBatchRows,
  setFfmpegExportBatchConcurrency,
  setFfmpegExportBatchRunnerBusy,
  takeNextFfmpegExportBatchWaitingRow,
  updateFfmpegExportBatchRow
} from '../../src/main/ffmpeg-export-batch-queue'

describe('ffmpeg-export-batch-queue', () => {
  beforeEach(() => {
    clearFfmpegExportBatchQueue()
    setFfmpegExportBatchConcurrency(1)
  })

  it('addFfmpegExportBatchPaths и takeNext', () => {
    expect(addFfmpegExportBatchPaths(['C:\\a.mp4', 'C:\\b.mkv'])).toBe(2)
    const next = takeNextFfmpegExportBatchWaitingRow()
    expect(next?.inputPath).toBe('C:\\a.mp4')
    expect(getFfmpegExportBatchSnapshot().rows).toHaveLength(2)
  })

  it('moveFfmpegExportBatchRow меняет порядок', () => {
    addFfmpegExportBatchPaths(['a.mp4', 'b.mp4'])
    const rows = getFfmpegExportBatchSnapshot().rows
    const secondId = rows[1]?.id
    expect(secondId).toBeDefined()
    expect(moveFfmpegExportBatchRow(secondId!, 'up')).toBe(true)
    expect(takeNextFfmpegExportBatchWaitingRow()?.inputPath).toBe('b.mp4')
  })

  it('removeFfmpegExportBatchRows удаляет waiting', () => {
    addFfmpegExportBatchPaths(['a.mp4'])
    const id = getFfmpegExportBatchSnapshot().rows[0]!.id
    removeFfmpegExportBatchRows([id])
    expect(getFfmpegExportBatchSnapshot().rows).toHaveLength(0)
  })

  it('addFfmpegExportBatchPaths пропускает дубликаты', () => {
    expect(addFfmpegExportBatchPaths(['a.mp4', 'A.MP4'])).toBe(1)
  })

  it('reorderFfmpegExportBatchRowAt', () => {
    addFfmpegExportBatchPaths(['a.mp4', 'b.mp4', 'c.mp4'])
    const id = getFfmpegExportBatchSnapshot().rows[2]!.id
    expect(reorderFfmpegExportBatchRowAt(id, 0)).toBe(true)
    expect(takeNextFfmpegExportBatchWaitingRow()?.inputPath).toContain('c.mp4')
  })

  it('snapshot считает завершённые', () => {
    addFfmpegExportBatchPaths(['a.mp4'])
    const id = getFfmpegExportBatchSnapshot().rows[0]!.id
    updateFfmpegExportBatchRow(id, { status: FFMPEG_EXPORT_BATCH_STATUS_DONE, progress: '100%' })
    const snap = getFfmpegExportBatchSnapshot()
    expect(snap.completedOk).toBe(1)
    expect(snap.rows[0]?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_DONE)
  })

  it('retryFailed сбрасывает error в waiting без outputPath', () => {
    addFfmpegExportBatchPaths(['a.mp4', 'b.mp4'])
    const [a, b] = getFfmpegExportBatchSnapshot().rows
    updateFfmpegExportBatchRow(a!.id, {
      status: FFMPEG_EXPORT_BATCH_STATUS_ERROR,
      progress: 'boom',
      outputPath: 'out.mp4',
      error: 'boom'
    })
    updateFfmpegExportBatchRow(b!.id, {
      status: FFMPEG_EXPORT_BATCH_STATUS_DONE,
      progress: '100%',
      outputPath: 'ok.mp4'
    })
    expect(retryFailedFfmpegExportBatchRows()).toBe(1)
    const rows = getFfmpegExportBatchSnapshot().rows
    expect(rows.find((r) => r.id === a!.id)?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_WAITING)
    expect(rows.find((r) => r.id === a!.id)?.outputPath).toBeUndefined()
    expect(rows.find((r) => r.id === b!.id)?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_DONE)
    expect(takeNextFfmpegExportBatchWaitingRow()?.inputPath).toContain('a.mp4')
  })

  it('retryFfmpegExportBatchRows по id включает cancelled', () => {
    addFfmpegExportBatchPaths(['x.mp4'])
    const id = getFfmpegExportBatchSnapshot().rows[0]!.id
    updateFfmpegExportBatchRow(id, {
      status: FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
      progress: '—'
    })
    expect(retryFfmpegExportBatchRows({ ids: [id], includeCancelled: true })).toBe(1)
    expect(getFfmpegExportBatchSnapshot().rows[0]?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_WAITING)
  })

  it('retry не работает при runnerBusy', () => {
    addFfmpegExportBatchPaths(['a.mp4'])
    const id = getFfmpegExportBatchSnapshot().rows[0]!.id
    updateFfmpegExportBatchRow(id, { status: FFMPEG_EXPORT_BATCH_STATUS_ERROR, progress: 'e' })
    setFfmpegExportBatchRunnerBusy(true)
    expect(retryFailedFfmpegExportBatchRows()).toBe(0)
    setFfmpegExportBatchRunnerBusy(false)
  })

  it('removeCompletedFfmpegExportBatchRows', () => {
    addFfmpegExportBatchPaths(['a.mp4', 'b.mp4'])
    const rows = getFfmpegExportBatchSnapshot().rows
    updateFfmpegExportBatchRow(rows[0]!.id, {
      status: FFMPEG_EXPORT_BATCH_STATUS_DONE,
      progress: '100%'
    })
    expect(removeCompletedFfmpegExportBatchRows()).toBe(1)
    expect(getFfmpegExportBatchSnapshot().rows).toHaveLength(1)
  })

  it('listFfmpegExportBatchInputPaths сохраняет порядок', () => {
    addFfmpegExportBatchPaths(['z.mp4', 'a.mp4'])
    expect(listFfmpegExportBatchInputPaths()).toEqual(['z.mp4', 'a.mp4'])
  })

  it('removeWaitingFfmpegExportBatchRows', () => {
    addFfmpegExportBatchPaths(['a.mp4', 'b.mp4'])
    const rows = getFfmpegExportBatchSnapshot().rows
    updateFfmpegExportBatchRow(rows[0]!.id, {
      status: FFMPEG_EXPORT_BATCH_STATUS_DONE,
      progress: '100%'
    })
    expect(removeWaitingFfmpegExportBatchRows()).toBe(1)
    expect(getFfmpegExportBatchSnapshot().rows).toHaveLength(1)
  })
})
