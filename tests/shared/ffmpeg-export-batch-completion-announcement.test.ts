import { describe, expect, it } from 'vitest'

import { resolveFfmpegExportBatchCompletionAnnouncement } from '../../src/shared/ffmpeg-export-batch-completion-announcement'

describe('resolveFfmpegExportBatchCompletionAnnouncement', () => {
  it('returns none while running', () => {
    expect(
      resolveFfmpegExportBatchCompletionAnnouncement({
        running: true,
        completedOk: 2,
        completedError: 0,
        completedCancelled: 0
      })
    ).toEqual({ kind: 'none' })
  })

  it('returns none when no completed rows', () => {
    expect(
      resolveFfmpegExportBatchCompletionAnnouncement({
        running: false,
        completedOk: 0,
        completedError: 0,
        completedCancelled: 0
      })
    ).toEqual({ kind: 'none' })
  })

  it('returns all_ok when every row succeeded', () => {
    expect(
      resolveFfmpegExportBatchCompletionAnnouncement({
        running: false,
        completedOk: 3,
        completedError: 0,
        completedCancelled: 0
      })
    ).toEqual({ kind: 'all_ok', ok: 3, total: 3 })
  })

  it('returns with_errors when any row failed', () => {
    expect(
      resolveFfmpegExportBatchCompletionAnnouncement({
        running: false,
        completedOk: 1,
        completedError: 2,
        completedCancelled: 0
      })
    ).toEqual({ kind: 'with_errors', failed: 2, total: 3 })
  })

  it('returns cancelled_only when only cancellations', () => {
    expect(
      resolveFfmpegExportBatchCompletionAnnouncement({
        running: false,
        completedOk: 0,
        completedError: 0,
        completedCancelled: 2
      })
    ).toEqual({ kind: 'cancelled_only', cancelled: 2, total: 2 })
  })

  it('returns mixed_done_cancelled for ok plus cancelled', () => {
    expect(
      resolveFfmpegExportBatchCompletionAnnouncement({
        running: false,
        completedOk: 2,
        completedError: 0,
        completedCancelled: 1
      })
    ).toEqual({ kind: 'mixed_done_cancelled', ok: 2, cancelled: 1, total: 3 })
  })
})
