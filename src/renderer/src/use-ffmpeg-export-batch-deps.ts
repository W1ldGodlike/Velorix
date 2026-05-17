import { useCallback } from 'react'

import { uiText, uiTextVars } from './locales/ui-text'
import type { WorkspaceTab } from './app-terminal-hint-ui'

export type UseFfmpegExportBatchDeps = {
  setStatusHint: (hint: string | null) => void
  setWorkspaceTab: (tab: WorkspaceTab) => void
  buildExportOverrides: () => Record<string, unknown>
  previewPath: string | undefined
  exportBusy: boolean
  setBatchOutputDirectory: (path: string) => void
  onBatchRunFinished: () => void
}

export function formatBatchAddStatusHint(
  setStatusHint: (hint: string | null) => void,
  counts: { added: number; skipped: number },
  emptyMsg?: string
): void {
  if (counts.added === 0 && counts.skipped === 0) {
    setStatusHint(emptyMsg ?? uiText('batchExportNoVideoPaths'))
    return
  }
  if (counts.added === 0 && counts.skipped > 0) {
    setStatusHint(uiTextVars('batchExportSkippedDuplicates', { count: String(counts.skipped) }))
    return
  }
  if (counts.skipped > 0) {
    setStatusHint(
      uiTextVars('batchExportAddedFilesWithSkipped', {
        added: String(counts.added),
        skipped: String(counts.skipped)
      })
    )
    return
  }
  setStatusHint(uiTextVars('batchExportAddedFiles', { count: String(counts.added) }))
}

export function useBatchAddStatusHint(
  setStatusHint: (hint: string | null) => void
): (counts: { added: number; skipped: number }, emptyMsg?: string) => void {
  return useCallback(
    (counts: { added: number; skipped: number }, emptyMsg?: string): void => {
      formatBatchAddStatusHint(setStatusHint, counts, emptyMsg)
    },
    [setStatusHint]
  )
}
