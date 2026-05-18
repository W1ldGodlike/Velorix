import {
  resolveFfmpegExportBatchCompletionAnnouncement,
  type FfmpegExportBatchCompletionAnnouncement
} from '../../shared/ffmpeg-export-batch-completion-announcement'
import type { FfmpegExportBatchSnapshot } from '../../shared/ffmpeg-export-batch-contract'
import { uiTextVars } from './locales/ui-text'

export function formatEditorBatchExportCompletionAnnouncement(
  snap: Pick<
    FfmpegExportBatchSnapshot,
    'running' | 'completedOk' | 'completedError' | 'completedCancelled'
  >
): string | null {
  const resolved = resolveFfmpegExportBatchCompletionAnnouncement(snap)
  return formatEditorBatchExportCompletionFromResolved(resolved)
}

export function formatEditorBatchExportCompletionFromResolved(
  resolved: FfmpegExportBatchCompletionAnnouncement
): string | null {
  switch (resolved.kind) {
    case 'none':
      return null
    case 'all_ok':
      return uiTextVars('batchExportCompleteSummary', {
        ok: String(resolved.ok),
        total: String(resolved.total)
      })
    case 'with_errors':
      return uiTextVars('batchExportErrorSummary', {
        failed: String(resolved.failed),
        total: String(resolved.total)
      })
    case 'cancelled_only':
      return uiTextVars('batchExportCompleteCancelledSummary', {
        cancelled: String(resolved.cancelled),
        total: String(resolved.total)
      })
    case 'mixed_done_cancelled':
      return uiTextVars('batchExportCompleteMixedSummary', {
        ok: String(resolved.ok),
        cancelled: String(resolved.cancelled),
        total: String(resolved.total)
      })
  }
}
