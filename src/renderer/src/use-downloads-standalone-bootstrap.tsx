import { useEffect, useId } from 'react'

import { sanitizeDownloadsRows } from './downloads-queue-view'
import { bindDownloadsStoreIpc } from './stores/downloads-store-ipc'
import { useAppShellStore } from './stores/app-shell-store'

/** IPC и очередь yt-dlp для окна `#downloads` (отдельный экземпляр Zustand). */
export function DownloadsStandaloneStoreBootstrap(): null {
  const downloadsMainUrlFieldId = useId()

  useEffect(() => {
    useAppShellStore.getState().setDownloadsMainUrlFieldId(downloadsMainUrlFieldId)
  }, [downloadsMainUrlFieldId])

  useEffect(() => {
    const cleanups = [bindDownloadsStoreIpc()]
    let mounted = true
    void window.fluxalloy.downloads.getSnapshot().then((rows) => {
      if (mounted) {
        useAppShellStore.getState().setDownloadsRows(sanitizeDownloadsRows(rows))
      }
    })
    const offSnapshot = window.fluxalloy.downloads.onSnapshot((rows) => {
      useAppShellStore.getState().setDownloadsRows(sanitizeDownloadsRows(rows))
    })
    return () => {
      mounted = false
      offSnapshot()
      for (const off of cleanups) {
        off()
      }
    }
  }, [])

  return null
}
