import { describe, expect, it } from 'vitest'

import {
  batchExportCanStart,
  formatBatchExportSummary
} from '../../src/renderer/src/lib/format-batch-export-summary'
import { FFMPEG_EXPORT_BATCH_STATUS_WAITING } from '../../src/shared/ffmpeg-export-batch-contract'

describe('formatBatchExportSummary', () => {
  it('describes empty queue', () => {
    expect(
      formatBatchExportSummary({
        rows: [],
        running: false,
        concurrency: 1,
        completedOk: 0,
        completedError: 0,
        completedCancelled: 0
      })
    ).toBe('Пакетная очередь пуста')
  })

  it('describes running batch', () => {
    const line = formatBatchExportSummary({
      rows: [
        {
          id: 1,
          inputPath: '/a.mp4',
          shortLabel: 'a.mp4',
          status: 'done',
          progress: '100%'
        },
        {
          id: 2,
          inputPath: '/b.mp4',
          shortLabel: 'b.mp4',
          status: 'running',
          progress: '12%'
        }
      ],
      running: true,
      concurrency: 2,
      completedOk: 1,
      completedError: 0,
      completedCancelled: 0
    })
    expect(line).toContain('1/2')
    expect(line).toContain('выполняется')
  })
})

describe('batchExportCanStart', () => {
  it('is true when waiting rows and not running', () => {
    expect(
      batchExportCanStart({
        rows: [
          {
            id: 1,
            inputPath: '/a.mp4',
            shortLabel: 'a.mp4',
            status: FFMPEG_EXPORT_BATCH_STATUS_WAITING,
            progress: '—'
          }
        ],
        running: false,
        concurrency: 1,
        completedOk: 0,
        completedError: 0,
        completedCancelled: 0
      })
    ).toBe(true)
  })

  it('is false while running', () => {
    expect(
      batchExportCanStart({
        rows: [
          {
            id: 1,
            inputPath: '/a.mp4',
            shortLabel: 'a.mp4',
            status: FFMPEG_EXPORT_BATCH_STATUS_WAITING,
            progress: '—'
          }
        ],
        running: true,
        concurrency: 1,
        completedOk: 0,
        completedError: 0,
        completedCancelled: 0
      })
    ).toBe(false)
  })
})
