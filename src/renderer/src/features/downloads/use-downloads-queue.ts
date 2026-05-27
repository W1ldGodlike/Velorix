import { useEffect, useState } from 'react'

import {
  parseDownloadsQueueSnapshot,
  type DownloadsQueueRowView
} from '../../lib/parse-downloads-queue-row'

export function useDownloadsQueue(): DownloadsQueueRowView[] {
  const [rows, setRows] = useState<DownloadsQueueRowView[]>([])

  useEffect(() => {
    const downloads = window.velorix?.downloads
    if (downloads == null) {
      return
    }
    void downloads.getSnapshot().then((snapshot) => {
      setRows(parseDownloadsQueueSnapshot(snapshot))
    })
    return downloads.onSnapshot((snapshot) => {
      setRows(parseDownloadsQueueSnapshot(snapshot))
    })
  }, [])

  return rows
}
