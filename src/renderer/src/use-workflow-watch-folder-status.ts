import { useEffect } from 'react'

import { uiTextVars } from './locales/ui-text'

/** §10 — статусбар при detect/run watch-folder. */
export function useWorkflowWatchFolderStatus(setStatusHint: (hint: string | null) => void): void {
  useEffect(() => {
    const offDetect = window.fluxalloy.workflows.onWatchFolderDetected((payload) => {
      const base = payload.filePath.replace(/^.*[/\\]/, '')
      setStatusHint(uiTextVars('workflowWatchFolderDetectedStatus', { file: base, task: payload.taskTitle }))
    })
    const offRun = window.fluxalloy.workflows.onWatchFolderRunFinished((payload) => {
      const base = payload.filePath.replace(/^.*[/\\]/, '')
      if (payload.outcome === 'success' && payload.outputPath) {
        setStatusHint(
          uiTextVars('workflowWatchFolderRunSuccessStatus', {
            file: base,
            out: payload.outputPath.replace(/^.*[/\\]/, '')
          })
        )
        return
      }
      if (payload.outcome === 'skipped') {
        setStatusHint(uiTextVars('workflowWatchFolderRunSkippedStatus', { file: base }))
        return
      }
      setStatusHint(uiTextVars('workflowWatchFolderRunErrorStatus', { file: base }))
    })
    return () => {
      offDetect()
      offRun()
    }
  }, [setStatusHint])
}
