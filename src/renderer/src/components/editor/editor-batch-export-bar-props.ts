import type { Dispatch, SetStateAction } from 'react'

import type { FfmpegExportBatchSnapshot } from '../../../../shared/ffmpeg-export-batch-contract'

export type EditorBatchExportBarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  batchExportBusy: boolean
  batchSnapshot: FfmpegExportBatchSnapshot | null
  batchOutputSuffix: string
  setBatchOutputSuffix: Dispatch<SetStateAction<string>>
  batchOutputDirectory: string
  batchDragRowId: number | null
  setBatchDragRowId: (id: number | null) => void
  previewPath: string | undefined
  setStatusHint: (hint: string | null) => void
  handleBatchDropFiles: (files: FileList | null) => Promise<void>
  handleBatchPickOutputFolder: () => Promise<void>
  handleBatchRevealSharedOutputFolder: () => Promise<void>
  handleBatchClearOutputDirectory: () => Promise<void>
  handleBatchPickFiles: () => Promise<void>
  handleBatchPickFolder: () => Promise<void>
  handleBatchAddCurrentPreview: () => Promise<void>
  handleBatchAddDownloadsDone: () => void
  handleBatchStart: () => Promise<void>
  handleBatchCancel: () => Promise<void>
  handleBatchRetryFailed: () => Promise<void>
  handleBatchRetryFailedAndStart: () => Promise<void>
  handleBatchClearCompleted: () => Promise<void>
  handleBatchCopyInputPaths: () => Promise<void>
  handleBatchCopyOutputPaths: () => Promise<void>
  handleBatchSaveReport: () => Promise<void>
  handleBatchRemoveWaiting: () => Promise<void>
  handleBatchOpenOutput: (outputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchOpenInput: (inputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchCopyRowPath: (path: string, kind: 'in' | 'out') => Promise<void>
}
