import type { SetStateAction } from 'react'

import { createRendererStore } from './create-renderer-store'

import type { FfmpegExportBatchSnapshot } from '../../../shared/ffmpeg-export-batch-contract'
import { applySetStateAction } from './store-set-action'

type BatchExportStoreState = {
  batchSnapshot: FfmpegExportBatchSnapshot | null
  batchDragRowId: number | null
}

type BatchExportStoreActions = {
  setBatchSnapshot: (
    next:
      | FfmpegExportBatchSnapshot
      | null
      | ((prev: FfmpegExportBatchSnapshot | null) => FfmpegExportBatchSnapshot | null)
  ) => void
  setBatchDragRowId: (next: SetStateAction<number | null>) => void
  reset: () => void
}

const initialBatchExportState: BatchExportStoreState = {
  batchSnapshot: null,
  batchDragRowId: null
}

export const useBatchExportStore = createRendererStore<
  BatchExportStoreState & BatchExportStoreActions
>('BatchExport', (set) => ({
  ...initialBatchExportState,
  setBatchSnapshot: (next) => {
    set((s) => ({ batchSnapshot: applySetStateAction(next, s.batchSnapshot) }))
  },
  setBatchDragRowId: (next) => {
    set((s) => ({ batchDragRowId: applySetStateAction(next, s.batchDragRowId) }))
  },
  reset: () => {
    set(initialBatchExportState)
  }
}))

export function selectBatchExportBusy(state: BatchExportStoreState): boolean {
  return state.batchSnapshot?.running === true
}
