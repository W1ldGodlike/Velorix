import { describe, expect, it, beforeEach } from 'vitest'

import {
  FFMPEG_EXPORT_BATCH_STATUS_DONE
} from '../../src/shared/ffmpeg-export-batch-contract'
import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot,
  moveFfmpegExportBatchRow,
  removeFfmpegExportBatchRows,
  setFfmpegExportBatchConcurrency,
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

  it('snapshot считает завершённые', () => {
    addFfmpegExportBatchPaths(['a.mp4'])
    const id = getFfmpegExportBatchSnapshot().rows[0]!.id
    updateFfmpegExportBatchRow(id, { status: FFMPEG_EXPORT_BATCH_STATUS_DONE, progress: '100%' })
    const snap = getFfmpegExportBatchSnapshot()
    expect(snap.completedOk).toBe(1)
    expect(snap.rows[0]?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_DONE)
  })
})
