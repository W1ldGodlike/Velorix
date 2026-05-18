import { describe, expect, it } from 'vitest'

import type { FfmpegExportBatchRow } from '../../src/shared/ffmpeg-export-batch-contract'
import {
  ffmpegExportBatchRowErrorDescribedById,
  resolveFfmpegExportBatchRowErrorDetail,
  resolveFfmpegExportBatchRowProgressDisplay
} from '../../src/shared/ffmpeg-export-batch-row-display'

const baseRow: FfmpegExportBatchRow = {
  id: 1,
  inputPath: 'C:\\in\\a.mp4',
  shortLabel: 'a.mp4',
  status: 'waiting',
  progress: '—'
}

describe('ffmpeg-export-batch-row-display', () => {
  it('ffmpegExportBatchRowErrorDescribedById is stable per row id', () => {
    expect(ffmpegExportBatchRowErrorDescribedById(7)).toBe('batch-export-row-7-error')
  })

  it('resolveFfmpegExportBatchRowErrorDetail prefers row.error', () => {
    const row: FfmpegExportBatchRow = {
      ...baseRow,
      status: 'error',
      progress: 'fallback from progress',
      error: 'codec failed'
    }
    expect(resolveFfmpegExportBatchRowErrorDetail(row)).toBe('codec failed')
  })

  it('resolveFfmpegExportBatchRowErrorDetail falls back to progress on error', () => {
    const row: FfmpegExportBatchRow = {
      ...baseRow,
      status: 'error',
      progress: 'only in progress'
    }
    expect(resolveFfmpegExportBatchRowErrorDetail(row)).toBe('only in progress')
  })

  it('resolveFfmpegExportBatchRowErrorDetail is null for done rows', () => {
    expect(
      resolveFfmpegExportBatchRowErrorDetail({ ...baseRow, status: 'done', progress: '100%' })
    ).toBeNull()
  })

  it('resolveFfmpegExportBatchRowProgressDisplay shows error text', () => {
    const row: FfmpegExportBatchRow = {
      ...baseRow,
      status: 'error',
      progress: '—',
      error: 'disk full'
    }
    expect(resolveFfmpegExportBatchRowProgressDisplay(row)).toBe('disk full')
  })

  it('resolveFfmpegExportBatchRowProgressDisplay keeps progress for running', () => {
    const row: FfmpegExportBatchRow = {
      ...baseRow,
      status: 'running',
      progress: '42%'
    }
    expect(resolveFfmpegExportBatchRowProgressDisplay(row)).toBe('42%')
  })
})
