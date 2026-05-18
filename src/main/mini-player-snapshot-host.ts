import { buildMiniPlayerSnapshot } from '../shared/mini-player-snapshot-build'
import type { MiniPlayerSnapshot } from '../shared/mini-player-snapshot-contract'
import { getCachedMiniPlayerSession } from './app-session-store'
import { getDownloadsQueueRowById } from './downloads-queue'
import { downloadsQueueRunnerState } from './downloads-queue-runner-state'
import { activeExportAbort } from './main-window-runtime-state'

export function buildMiniPlayerSnapshotFromMain(): MiniPlayerSnapshot {
  const exportActive = activeExportAbort !== null
  const rowId = downloadsQueueRunnerState.activeRunnerRowId
  const downloadActive = rowId !== null
  const row = rowId !== null ? getDownloadsQueueRowById(rowId) : undefined
  return {
    ...buildMiniPlayerSnapshot({
      exportActive,
      downloadActive,
      downloadProgress: row?.progress ?? null,
      downloadSpeed: row?.queueSpeed ?? null,
      downloadStatus: row?.status ?? null
    }),
    alwaysOnTop: getCachedMiniPlayerSession().alwaysOnTop
  }
}
