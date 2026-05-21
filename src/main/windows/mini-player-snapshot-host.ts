import { buildMiniPlayerSnapshot } from '../../shared/mini-player-snapshot-build'
import type { MiniPlayerSnapshot } from '../../shared/mini-player-snapshot-contract'
import { getCachedMiniPlayerSession } from '../core/app-session-store'
import { getMiniPlayerExportProgress } from '../core/export-progress-broadcast'
import { getDownloadsQueueRowById } from '../services/downloads/downloads-queue'
import { downloadsQueueRunnerState } from '../services/downloads/downloads-queue-runner-state'
import { activeExportAbort } from './main-window-runtime-state'

export function buildMiniPlayerSnapshotFromMain(): MiniPlayerSnapshot {
  const exportActive = activeExportAbort !== null
  const rowId = downloadsQueueRunnerState.activeRunnerRowId
  const downloadActive = rowId !== null
  const row = rowId !== null ? getDownloadsQueueRowById(rowId) : undefined
  const exportProgress = getMiniPlayerExportProgress()
  return {
    ...buildMiniPlayerSnapshot({
      exportActive,
      downloadActive,
      downloadProgress: row?.progress ?? null,
      downloadSpeed: row?.queueSpeed ?? null,
      downloadStatus: row?.status ?? null,
      exportPercent: exportProgress?.percent ?? null,
      exportMessage: exportProgress?.message ?? null,
      exportSpeed: exportProgress?.speed ?? null
    }),
    alwaysOnTop: getCachedMiniPlayerSession().alwaysOnTop
  }
}
