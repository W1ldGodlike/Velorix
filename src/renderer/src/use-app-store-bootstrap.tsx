import { useEffect, useId } from 'react'

import { bindBatchExportStoreIpc } from './stores/batch-export-store-ipc'
import { bindDownloadsStoreIpc } from './stores/downloads-store-ipc'
import { bindProcessingHistoryStoreIpc } from './stores/processing-history-store-ipc'
import { bindTerminalStoreIpc } from './stores/terminal-store-ipc'
import { useAppShellStore } from './stores/app-shell-store'

/** IPC subscriptions and one-time store hydration for the main renderer surface. */
export function AppStoreBootstrap(): null {
  const downloadsMainUrlFieldId = useId()

  useEffect(() => {
    useAppShellStore.getState().setDownloadsMainUrlFieldId(downloadsMainUrlFieldId)
  }, [downloadsMainUrlFieldId])

  useEffect(() => {
    const cleanups = [
      bindDownloadsStoreIpc(),
      bindProcessingHistoryStoreIpc(),
      bindBatchExportStoreIpc(),
      bindTerminalStoreIpc()
    ]
    return () => {
      for (const off of cleanups) {
        off()
      }
    }
  }, [])

  return null
}
