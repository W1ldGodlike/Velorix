import { useEffect, useState } from 'react'

import type { FfmpegExportBatchSnapshot } from '../../shared/ffmpeg-export-batch-contract'

export function useFfmpegExportBatchSnapshot(onBatchRunFinished: () => void): {
  batchSnapshot: FfmpegExportBatchSnapshot | null
  batchDragRowId: number | null
  setBatchDragRowId: (id: number | null) => void
  batchExportBusy: boolean
} {
  const [batchSnapshot, setBatchSnapshot] = useState<FfmpegExportBatchSnapshot | null>(null)
  const [batchDragRowId, setBatchDragRowId] = useState<number | null>(null)
  const batchExportBusy = batchSnapshot?.running === true

  useEffect(() => {
    void window.fluxalloy.batchExport.getSnapshot().then(setBatchSnapshot).catch(console.error)
    return window.fluxalloy.batchExport.onSnapshot((snap) => {
      setBatchSnapshot((prev) => {
        if (prev?.running === true && snap.running === false) {
          onBatchRunFinished()
        }
        return snap
      })
    })
  }, [onBatchRunFinished])

  return { batchSnapshot, batchDragRowId, setBatchDragRowId, batchExportBusy }
}
