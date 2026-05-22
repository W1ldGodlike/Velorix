import { useCallback } from 'react'

import type { FfmpegExportBatchSnapshot } from '../../shared/ffmpeg-export-batch-contract'
import { formatFfmpegExportBatchReportText } from '../../shared/ffmpeg-export-batch-report'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'
import type { WorkspaceTab } from './app-terminal-hint-ui'

export function useFfmpegExportBatchHandlersRun({
  setStatusHint,
  setWorkspaceTab,
  buildExportOverrides,
  pipelineBusy,
  batchSnapshot
}: {
  setStatusHint: (hint: string | null) => void
  setWorkspaceTab: (tab: WorkspaceTab) => void
  buildExportOverrides: () => Record<string, unknown>
  pipelineBusy: boolean
  batchSnapshot: FfmpegExportBatchSnapshot | null
}): {
  handleBatchOpenOutput: (outputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchOpenInput: (inputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchStart: () => Promise<void>
  handleBatchCancel: () => Promise<void>
  handleBatchRetryFailed: () => Promise<void>
  handleBatchClearCompleted: () => Promise<void>
  handleBatchRetryFailedAndStart: () => Promise<void>
  handleBatchCopyInputPaths: () => Promise<void>
  handleBatchCopyOutputPaths: () => Promise<void>
  handleBatchCopyRowPath: (path: string, kind: 'in' | 'out') => Promise<void>
  handleBatchSaveReport: () => Promise<void>
  handleBatchRemoveWaiting: () => Promise<void>
} {
  const handleBatchOpenOutput = useCallback(
    async (outputPath: string, mode: 'file' | 'folder' | 'preview'): Promise<void> => {
      const res = await window.velorix.export.openOutput(outputPath, mode)
      if (!res.ok) {
        setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
        return
      }
      if (mode === 'preview') {
        setWorkspaceTab('editor')
      }
    },
    [setStatusHint, setWorkspaceTab]
  )

  const handleBatchOpenInput = useCallback(
    async (inputPath: string, mode: 'file' | 'folder' | 'preview'): Promise<void> => {
      const res = await window.velorix.batchExport.openInput(inputPath, mode)
      if (!res.ok) {
        setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
        return
      }
      if (mode === 'preview') {
        setWorkspaceTab('editor')
        setStatusHint(uiText('processingHistoryOpenInputDone'))
      }
    },
    [setStatusHint, setWorkspaceTab]
  )

  const handleBatchStart = useCallback(async (): Promise<void> => {
    if (pipelineBusy) {
      return
    }
    const res = await window.velorix.batchExport.start(buildExportOverrides())
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setStatusHint(uiText('batchExportStarted'))
  }, [buildExportOverrides, pipelineBusy, setStatusHint])

  const handleBatchCancel = useCallback(async (): Promise<void> => {
    await window.velorix.batchExport.cancel()
    setStatusHint(uiText('batchExportCancelled'))
  }, [setStatusHint])

  const handleBatchRetryFailed = useCallback(async (): Promise<void> => {
    const res = await window.velorix.batchExport.retryFailed()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.reset === 0) {
      setStatusHint(uiText('batchExportNothingToRetry'))
      return
    }
    setStatusHint(uiTextVars('batchExportRetriedFailed', { count: String(res.reset) }))
  }, [setStatusHint])

  const handleBatchClearCompleted = useCallback(async (): Promise<void> => {
    const res = await window.velorix.batchExport.clearCompleted()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.removed > 0) {
      setStatusHint(uiTextVars('batchExportClearedCompleted', { count: String(res.removed) }))
    }
  }, [setStatusHint])

  const handleBatchRetryFailedAndStart = useCallback(async (): Promise<void> => {
    if (pipelineBusy) {
      return
    }
    const res = await window.velorix.batchExport.retryFailedAndStart(buildExportOverrides())
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setStatusHint(uiText('batchExportStarted'))
  }, [buildExportOverrides, pipelineBusy, setStatusHint])

  const handleBatchCopyInputPaths = useCallback(async (): Promise<void> => {
    const listed = await window.velorix.batchExport.listInputPaths()
    if (listed.paths.length === 0) {
      setStatusHint(uiText('batchExportEmpty'))
      return
    }
    const text = listed.paths.join('\r\n')
    const written = await window.velorix.clipboard.writeText(text)
    if (!written.ok) {
      setStatusHint(uiText('batchExportCopyPathsFailed'))
      return
    }
    setStatusHint(uiTextVars('batchExportCopiedPaths', { count: String(listed.paths.length) }))
  }, [setStatusHint])

  const handleBatchCopyOutputPaths = useCallback(async (): Promise<void> => {
    const listed = await window.velorix.batchExport.listOutputPaths()
    if (listed.paths.length === 0) {
      setStatusHint(uiText('batchExportNoOutputPaths'))
      return
    }
    const text = listed.paths.join('\r\n')
    const written = await window.velorix.clipboard.writeText(text)
    if (!written.ok) {
      setStatusHint(uiText('batchExportCopyPathsFailed'))
      return
    }
    setStatusHint(
      uiTextVars('batchExportCopiedOutputPaths', { count: String(listed.paths.length) })
    )
  }, [setStatusHint])

  const handleBatchCopyRowPath = useCallback(
    async (path: string, kind: 'in' | 'out'): Promise<void> => {
      const written = await window.velorix.clipboard.writeText(path)
      if (!written.ok) {
        setStatusHint(uiText('batchExportCopyPathsFailed'))
        return
      }
      setStatusHint(
        kind === 'in'
          ? uiText('batchExportCopiedRowInputPath')
          : uiText('batchExportCopiedRowOutputPath')
      )
    },
    [setStatusHint]
  )

  const handleBatchSaveReport = useCallback(async (): Promise<void> => {
    const snap = batchSnapshot ?? (await window.velorix.batchExport.getSnapshot())
    if (snap.rows.length === 0) {
      setStatusHint(uiText('batchExportEmpty'))
      return
    }
    const loc = getUiLocale() === 'en' ? 'en' : 'ru'
    const res = await window.velorix.saveTextWithDialog({
      title: uiText('batchExportSaveReportTitle'),
      defaultFileName: uiText('batchExportSaveReportDefaultName'),
      content: formatFfmpegExportBatchReportText(snap, loc)
    })
    if (res.ok) {
      setStatusHint(uiTextVars('batchExportReportSaved', { path: res.path }))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [batchSnapshot, setStatusHint])

  const handleBatchRemoveWaiting = useCallback(async (): Promise<void> => {
    const res = await window.velorix.batchExport.removeWaiting()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.removed > 0) {
      setStatusHint(uiTextVars('batchExportRemovedWaiting', { count: String(res.removed) }))
    }
  }, [setStatusHint])

  return {
    handleBatchOpenOutput,
    handleBatchOpenInput,
    handleBatchStart,
    handleBatchCancel,
    handleBatchRetryFailed,
    handleBatchClearCompleted,
    handleBatchRetryFailedAndStart,
    handleBatchCopyInputPaths,
    handleBatchCopyOutputPaths,
    handleBatchCopyRowPath,
    handleBatchSaveReport,
    handleBatchRemoveWaiting
  }
}
