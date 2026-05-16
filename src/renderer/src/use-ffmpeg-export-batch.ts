import { useCallback, useEffect, useState } from 'react'

import type { FfmpegExportBatchSnapshot } from '../../shared/ffmpeg-export-batch-contract'
import { formatFfmpegExportBatchReportText } from '../../shared/ffmpeg-export-batch-report'
import { isFfmpegExportBatchVideoPath } from '../../shared/ffmpeg-export-batch-video-ext'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'
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

function formatBatchAddStatusHint(
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

export function useFfmpegExportBatch(deps: UseFfmpegExportBatchDeps): {
  batchSnapshot: FfmpegExportBatchSnapshot | null
  batchDragRowId: number | null
  setBatchDragRowId: (id: number | null) => void
  batchExportBusy: boolean
  handleBatchOpenOutput: (outputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchOpenInput: (inputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchPickFiles: () => Promise<void>
  handleBatchPickFolder: () => Promise<void>
  handleBatchPickOutputFolder: () => Promise<void>
  handleBatchClearOutputDirectory: () => Promise<void>
  handleBatchRevealSharedOutputFolder: () => Promise<void>
  handleBatchDropFiles: (files: FileList | null) => Promise<void>
  handleBatchStart: () => Promise<void>
  handleBatchCancel: () => Promise<void>
  handleBatchRetryFailed: () => Promise<void>
  handleBatchClearCompleted: () => Promise<void>
  handleBatchAddCurrentPreview: () => Promise<void>
  handleBatchAddDownloadsDone: (ids?: number[]) => Promise<void>
  handleBatchRetryFailedAndStart: () => Promise<void>
  handleBatchCopyInputPaths: () => Promise<void>
  handleBatchCopyOutputPaths: () => Promise<void>
  handleBatchCopyRowPath: (path: string, kind: 'in' | 'out') => Promise<void>
  handleBatchSaveReport: () => Promise<void>
  handleBatchRemoveWaiting: () => Promise<void>
  reportBatchPathsAdded: (counts: { added: number; skipped: number }, emptyMsg?: string) => void
} {
  const {
    setStatusHint,
    setWorkspaceTab,
    buildExportOverrides,
    previewPath,
    exportBusy,
    setBatchOutputDirectory,
    onBatchRunFinished
  } = deps

  const [batchSnapshot, setBatchSnapshot] = useState<FfmpegExportBatchSnapshot | null>(null)
  const [batchDragRowId, setBatchDragRowId] = useState<number | null>(null)
  const batchExportBusy = batchSnapshot?.running === true

  const setBatchAddStatusHint = useCallback(
    (counts: { added: number; skipped: number }, emptyMsg?: string): void => {
      formatBatchAddStatusHint(setStatusHint, counts, emptyMsg)
    },
    [setStatusHint]
  )

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

  const pipelineBusy = exportBusy || batchExportBusy

  const handleBatchOpenOutput = useCallback(
    async (outputPath: string, mode: 'file' | 'folder' | 'preview'): Promise<void> => {
      const res = await window.fluxalloy.export.openOutput(outputPath, mode)
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
      const res = await window.fluxalloy.batchExport.openInput(inputPath, mode)
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

  const handleBatchPickFiles = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.batchExport.pickFiles()
    if (res.ok) {
      setBatchAddStatusHint(res)
      return
    }
    if ('cancelled' in res && res.cancelled) {
      return
    }
    if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [setBatchAddStatusHint, setStatusHint])

  const handleBatchPickFolder = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.batchExport.pickFolder()
    if (res.ok) {
      setBatchAddStatusHint(res)
      return
    }
    if ('cancelled' in res && res.cancelled) {
      return
    }
    if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [setBatchAddStatusHint, setStatusHint])

  const handleBatchPickOutputFolder = useCallback(async (): Promise<void> => {
    const picked = await window.fluxalloy.batchExport.pickOutputFolder()
    if (!picked.ok) {
      return
    }
    const s = await window.fluxalloy.settings.setFfmpegExportBatchOutputDirectory(picked.path)
    setBatchOutputDirectory(
      typeof s.ffmpegExportBatchOutputDirectory === 'string'
        ? s.ffmpegExportBatchOutputDirectory
        : ''
    )
  }, [setBatchOutputDirectory])

  const handleBatchClearOutputDirectory = useCallback(async (): Promise<void> => {
    const s = await window.fluxalloy.settings.setFfmpegExportBatchOutputDirectory(null)
    setBatchOutputDirectory(
      typeof s.ffmpegExportBatchOutputDirectory === 'string'
        ? s.ffmpegExportBatchOutputDirectory
        : ''
    )
  }, [setBatchOutputDirectory])

  const handleBatchRevealSharedOutputFolder = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.batchExport.revealSharedOutputFolder()
    if (!res.ok) {
      setStatusHint(res.error)
    }
  }, [setStatusHint])

  const handleBatchDropFiles = useCallback(
    async (files: FileList | null): Promise<void> => {
      if (!files || files.length === 0 || batchExportBusy) {
        return
      }
      const paths: string[] = []
      for (let i = 0; i < files.length; i += 1) {
        const file = files.item(i)
        if (!file) {
          continue
        }
        const absolutePath = window.fluxalloy.preview.getPathForFile(file)
        if (absolutePath) {
          paths.push(absolutePath)
        }
      }
      if (paths.length === 0) {
        return
      }
      const res = await window.fluxalloy.batchExport.addPaths(paths)
      if (res.ok) {
        setBatchAddStatusHint(res)
      } else if ('error' in res) {
        setStatusHint(res.error)
      }
    },
    [batchExportBusy, setBatchAddStatusHint, setStatusHint]
  )

  const handleBatchStart = useCallback(async (): Promise<void> => {
    if (pipelineBusy) {
      return
    }
    const res = await window.fluxalloy.batchExport.start(buildExportOverrides())
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setStatusHint(uiText('batchExportStarted'))
  }, [buildExportOverrides, pipelineBusy, setStatusHint])

  const handleBatchCancel = useCallback(async (): Promise<void> => {
    await window.fluxalloy.batchExport.cancel()
    setStatusHint(uiText('batchExportCancelled'))
  }, [setStatusHint])

  const handleBatchRetryFailed = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.batchExport.retryFailed()
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
    const res = await window.fluxalloy.batchExport.clearCompleted()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.removed > 0) {
      setStatusHint(uiTextVars('batchExportClearedCompleted', { count: String(res.removed) }))
    }
  }, [setStatusHint])

  const handleBatchAddCurrentPreview = useCallback(async (): Promise<void> => {
    if (!previewPath || !isFfmpegExportBatchVideoPath(previewPath)) {
      setStatusHint(uiText('batchExportNoVideoPaths'))
      return
    }
    const res = await window.fluxalloy.batchExport.addPaths([previewPath])
    if (res.ok) {
      setBatchAddStatusHint(res)
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [previewPath, setBatchAddStatusHint, setStatusHint])

  const handleBatchAddDownloadsDone = useCallback(
    async (ids?: number[]): Promise<void> => {
      const res = await window.fluxalloy.batchExport.addFromDownloadsDone(ids)
      if (!res.ok) {
        setStatusHint(res.error)
        return
      }
      setBatchAddStatusHint(res)
    },
    [setBatchAddStatusHint, setStatusHint]
  )

  const handleBatchRetryFailedAndStart = useCallback(async (): Promise<void> => {
    if (pipelineBusy) {
      return
    }
    const res = await window.fluxalloy.batchExport.retryFailedAndStart(buildExportOverrides())
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setStatusHint(uiText('batchExportStarted'))
  }, [buildExportOverrides, pipelineBusy, setStatusHint])

  const handleBatchCopyInputPaths = useCallback(async (): Promise<void> => {
    const listed = await window.fluxalloy.batchExport.listInputPaths()
    if (listed.paths.length === 0) {
      setStatusHint(uiText('batchExportEmpty'))
      return
    }
    const text = listed.paths.join('\r\n')
    const written = await window.fluxalloy.clipboard.writeText(text)
    if (!written.ok) {
      setStatusHint(uiText('batchExportCopyPathsFailed'))
      return
    }
    setStatusHint(uiTextVars('batchExportCopiedPaths', { count: String(listed.paths.length) }))
  }, [setStatusHint])

  const handleBatchCopyOutputPaths = useCallback(async (): Promise<void> => {
    const listed = await window.fluxalloy.batchExport.listOutputPaths()
    if (listed.paths.length === 0) {
      setStatusHint(uiText('batchExportNoOutputPaths'))
      return
    }
    const text = listed.paths.join('\r\n')
    const written = await window.fluxalloy.clipboard.writeText(text)
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
      const written = await window.fluxalloy.clipboard.writeText(path)
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
    const snap = batchSnapshot ?? (await window.fluxalloy.batchExport.getSnapshot())
    if (snap.rows.length === 0) {
      setStatusHint(uiText('batchExportEmpty'))
      return
    }
    const loc = getUiLocale() === 'en' ? 'en' : 'ru'
    const res = await window.fluxalloy.saveTextWithDialog({
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
    const res = await window.fluxalloy.batchExport.removeWaiting()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.removed > 0) {
      setStatusHint(uiTextVars('batchExportRemovedWaiting', { count: String(res.removed) }))
    }
  }, [setStatusHint])

  return {
    batchSnapshot,
    batchDragRowId,
    setBatchDragRowId,
    batchExportBusy,
    handleBatchOpenOutput,
    handleBatchOpenInput,
    handleBatchPickFiles,
    handleBatchPickFolder,
    handleBatchPickOutputFolder,
    handleBatchClearOutputDirectory,
    handleBatchRevealSharedOutputFolder,
    handleBatchDropFiles,
    handleBatchStart,
    handleBatchCancel,
    handleBatchRetryFailed,
    handleBatchClearCompleted,
    handleBatchAddCurrentPreview,
    handleBatchAddDownloadsDone,
    handleBatchRetryFailedAndStart,
    handleBatchCopyInputPaths,
    handleBatchCopyOutputPaths,
    handleBatchCopyRowPath,
    handleBatchSaveReport,
    handleBatchRemoveWaiting,
    reportBatchPathsAdded: setBatchAddStatusHint
  }
}
