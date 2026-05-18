import type { FfmpegExportBatchSnapshot } from './ffmpeg-export-batch-contract'

export type FfmpegExportBatchCompletionAnnouncement =
  | { kind: 'none' }
  | { kind: 'all_ok'; ok: number; total: number }
  | { kind: 'with_errors'; failed: number; total: number }
  | { kind: 'cancelled_only'; cancelled: number; total: number }
  | { kind: 'mixed_done_cancelled'; ok: number; cancelled: number; total: number }

export function resolveFfmpegExportBatchCompletionAnnouncement(
  snap: Pick<
    FfmpegExportBatchSnapshot,
    'running' | 'completedOk' | 'completedError' | 'completedCancelled'
  >
): FfmpegExportBatchCompletionAnnouncement {
  if (snap.running) {
    return { kind: 'none' }
  }
  const total = snap.completedOk + snap.completedError + snap.completedCancelled
  if (total === 0) {
    return { kind: 'none' }
  }
  if (snap.completedError > 0) {
    return { kind: 'with_errors', failed: snap.completedError, total }
  }
  if (snap.completedOk > 0 && snap.completedCancelled === 0) {
    return { kind: 'all_ok', ok: snap.completedOk, total }
  }
  if (snap.completedOk === 0 && snap.completedCancelled > 0) {
    return { kind: 'cancelled_only', cancelled: snap.completedCancelled, total }
  }
  return {
    kind: 'mixed_done_cancelled',
    ok: snap.completedOk,
    cancelled: snap.completedCancelled,
    total
  }
}
