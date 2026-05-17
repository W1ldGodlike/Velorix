export type { UseFfmpegExportBatchDeps } from './use-ffmpeg-export-batch-deps'

import type { FfmpegExportBatchSnapshot } from '../../shared/ffmpeg-export-batch-contract'
import type { UseFfmpegExportBatchDeps } from './use-ffmpeg-export-batch-deps'
import { useBatchAddStatusHint } from './use-ffmpeg-export-batch-deps'
import { useFfmpegExportBatchHandlersIngest } from './use-ffmpeg-export-batch-handlers-ingest'
import { useFfmpegExportBatchHandlersRun } from './use-ffmpeg-export-batch-handlers-run'
import { useFfmpegExportBatchSnapshot } from './use-ffmpeg-export-batch-snapshot'

export function useFfmpegExportBatch(deps: UseFfmpegExportBatchDeps): {
  batchSnapshot: FfmpegExportBatchSnapshot | null
  batchDragRowId: number | null
  setBatchDragRowId: (id: number | null) => void
  batchExportBusy: boolean
  handleBatchOpenOutput: (outputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchOpenInput: (inputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchPickFiles: () => Promise<void>
  handleBatchPickFolder: () => Promise<void>
  handleBatchPickOutputFolder: () => Promise<void>
  handleBatchClearOutputDirectory: () => Promise<void>
  handleBatchRevealSharedOutputFolder: () => Promise<void>
  handleBatchDropFiles: (files: FileList | null) => Promise<void>
  handleBatchStart: () => Promise<void>
  handleBatchCancel: () => Promise<void>
  handleBatchRetryFailed: () => Promise<void>
  handleBatchClearCompleted: () => Promise<void>
  handleBatchAddCurrentPreview: () => Promise<void>
  handleBatchAddDownloadsDone: (ids?: number[]) => Promise<void>
  handleBatchRetryFailedAndStart: () => Promise<void>
  handleBatchCopyInputPaths: () => Promise<void>
  handleBatchCopyOutputPaths: () => Promise<void>
  handleBatchCopyRowPath: (path: string, kind: 'in' | 'out') => Promise<void>
  handleBatchSaveReport: () => Promise<void>
  handleBatchRemoveWaiting: () => Promise<void>
  reportBatchPathsAdded: (counts: { added: number; skipped: number }, emptyMsg?: string) => void
} {
  const {
    setStatusHint,
    setWorkspaceTab,
    buildExportOverrides,
    previewPath,
    exportBusy,
    setBatchOutputDirectory,
    onBatchRunFinished
  } = deps

  const setBatchAddStatusHint = useBatchAddStatusHint(setStatusHint)
  const { batchSnapshot, batchDragRowId, setBatchDragRowId, batchExportBusy } =
    useFfmpegExportBatchSnapshot(onBatchRunFinished)
  const pipelineBusy = exportBusy || batchExportBusy

  const ingest = useFfmpegExportBatchHandlersIngest({
    setStatusHint,
    setBatchOutputDirectory,
    setBatchAddStatusHint,
    batchExportBusy,
    previewPath
  })

  const run = useFfmpegExportBatchHandlersRun({
    setStatusHint,
    setWorkspaceTab,
    buildExportOverrides,
    pipelineBusy,
    batchSnapshot
  })

  return {
    batchSnapshot,
    batchDragRowId,
    setBatchDragRowId,
    batchExportBusy,
    ...ingest,
    ...run,
    reportBatchPathsAdded: setBatchAddStatusHint
  }
}
