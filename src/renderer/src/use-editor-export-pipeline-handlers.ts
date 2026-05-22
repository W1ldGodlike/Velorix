import type { MutableRefObject, RefObject } from 'react'

import { buildFfmpegExportPreviewCommand } from '../../shared/ffmpeg-export-argv'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import {
  buildEditorExtractFramesPayload,
  DEFAULT_EDITOR_EXTRACT_FRAMES_UI,
  runEditorExtractFrames
} from './editor-extract-frames-action'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

export type EditorExportPipelineHandlers = {
  handleSnapshot: () => Promise<void>
  handleExtractFrames: () => Promise<void>
  handleExport: () => Promise<void>
  handleCancelExport: () => Promise<void>
  handleOpenLastExport: (mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleCopyLastExportPath: () => Promise<void>
  handleOpenLastSnapshot: (mode: 'file' | 'folder') => Promise<void>
  handleCopyLastSnapshotPath: () => Promise<void>
  handleCopyExportPreview: () => Promise<void>
}

export function useEditorExportPipelineHandlers({
  setStatusHint,
  preview,
  probeInfo,
  trimSnapshotRef,
  videoRef,
  exportBusy,
  setExportBusy,
  exportCancelBusy,
  setExportCancelBusy,
  batchExportBusy,
  snapshotBusy,
  setSnapshotBusy,
  extractFramesBusy,
  setExtractFramesBusy,
  snapshotFormat,
  refreshProcessingHistory,
  buildCurrentFfmpegExportOverrides,
  lastExportPath,
  setLastExportPath,
  lastSnapshotPath,
  setLastSnapshotPath,
  exportPreview,
  exportPreviewCommand
}: {
  setStatusHint: (hint: string | null) => void
  preview: RestoredSourceInfo | null
  probeInfo: MediaProbeSuccess | null
  trimSnapshotRef: MutableRefObject<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>
  videoRef: RefObject<HTMLVideoElement | null>
  exportBusy: boolean
  setExportBusy: (busy: boolean) => void
  exportCancelBusy: boolean
  setExportCancelBusy: (busy: boolean) => void
  batchExportBusy: boolean
  snapshotBusy: boolean
  setSnapshotBusy: (busy: boolean) => void
  extractFramesBusy: boolean
  setExtractFramesBusy: (busy: boolean) => void
  snapshotFormat: FfmpegSnapshotFormatId
  refreshProcessingHistory: () => Promise<void>
  buildCurrentFfmpegExportOverrides: () => Record<string, unknown>
  lastExportPath: string | null
  setLastExportPath: (path: string | null) => void
  lastSnapshotPath: string | null
  setLastSnapshotPath: (path: string | null) => void
  exportPreview: ReturnType<typeof buildFfmpegExportPreviewCommand>
  exportPreviewCommand: string
}): EditorExportPipelineHandlers {
  async function handleSnapshot(): Promise<void> {
    if (!preview || exportBusy || snapshotBusy) {
      return
    }
    const el = videoRef.current
    const timeSec = el && Number.isFinite(el.currentTime) ? Math.max(0, el.currentTime) : 0
    setLastSnapshotPath(null)
    setSnapshotBusy(true)
    setStatusHint(uiText('statusSnapshotInProgress'))
    try {
      const res = await window.velorix.preview.snapshotFrame({
        inputPath: preview.path,
        timeSec,
        uiLocale: getUiLocale()
      })
      void refreshProcessingHistory()
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastSnapshotPath(res.path)
        setStatusHint(uiTextVars('statusSnapshotSaved', { name: savedName }))
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(null)
      } else if ('error' in res) {
        setStatusHint(uiTextVars('statusSnapshotFailedWithDetail', { detail: res.error }))
      } else {
        setStatusHint(uiText('statusSnapshotFailedGeneric'))
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : uiText('statusSnapshotExceptionGeneric'))
    } finally {
      setSnapshotBusy(false)
    }
  }

  async function handleExtractFrames(): Promise<void> {
    if (!preview || exportBusy || batchExportBusy || snapshotBusy || extractFramesBusy) {
      return
    }
    const durationSec = probeInfo?.durationSec ?? 0
    const payload = buildEditorExtractFramesPayload({
      inputPath: preview.path,
      durationSec,
      format: snapshotFormat,
      ui: DEFAULT_EDITOR_EXTRACT_FRAMES_UI
    })
    if (payload === null) {
      return
    }
    setExtractFramesBusy(true)
    setStatusHint(uiText('editorExtractFramesStarting'))
    try {
      await runEditorExtractFrames({ payload, onProgress: () => {}, setStatusHint })
      void refreshProcessingHistory()
    } finally {
      setExtractFramesBusy(false)
    }
  }

  async function handleExport(): Promise<void> {
    if (!preview || exportBusy || batchExportBusy || snapshotBusy) {
      return
    }
    setExportBusy(true)
    setLastExportPath(null)
    setStatusHint(uiText('statusExportPreparing'))
    try {
      const trimSnap =
        trimSnapshotRef.current?.path === preview.path ? trimSnapshotRef.current.range : null
      const res = await window.velorix.export.start({
        inputPath: preview.path,
        uiLocale: getUiLocale(),
        ...(trimSnap != null ? { trim: trimSnap } : {}),
        probeDurationSec: probeInfo?.durationSec ?? null,
        ...buildCurrentFfmpegExportOverrides()
      })
      void refreshProcessingHistory()
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastExportPath(res.path)
        setStatusHint(uiTextVars('statusExportSaved', { name: savedName }))
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(uiText('statusExportCancelled'))
      } else if ('error' in res) {
        setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
      } else {
        setStatusHint(uiText('statusExportFailedGeneric'))
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : uiText('statusExportExceptionGeneric'))
    } finally {
      setExportBusy(false)
      setExportCancelBusy(false)
    }
  }

  async function handleCancelExport(): Promise<void> {
    if (!exportBusy || exportCancelBusy) {
      return
    }
    setExportCancelBusy(true)
    setStatusHint(uiText('statusExportCancelling'))
    const res = await window.velorix.export.cancel()
    if (!res.ok) {
      setExportCancelBusy(false)
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
    }
  }

  async function handleOpenLastExport(mode: 'file' | 'folder' | 'preview'): Promise<void> {
    if (!lastExportPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.velorix.export.openOutput(lastExportPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
    } else if (mode === 'preview') {
      setStatusHint(uiText('statusExportOpenedInPreview'))
    }
  }

  async function handleCopyLastExportPath(): Promise<void> {
    if (!lastExportPath) {
      return
    }
    const res = await window.velorix.clipboard.writeText(lastExportPath)
    setStatusHint(res.ok ? uiText('statusExportPathCopied') : uiText('statusExportPathCopyFailed'))
  }

  async function handleOpenLastSnapshot(mode: 'file' | 'folder'): Promise<void> {
    if (!lastSnapshotPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.velorix.export.openOutput(lastSnapshotPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusSnapshotFailedWithDetail', { detail: res.error }))
    }
  }

  async function handleCopyLastSnapshotPath(): Promise<void> {
    if (!lastSnapshotPath) {
      return
    }
    const res = await window.velorix.clipboard.writeText(lastSnapshotPath)
    setStatusHint(
      res.ok ? uiText('statusSnapshotPathCopied') : uiText('statusSnapshotPathCopyFailed')
    )
  }

  async function handleCopyExportPreview(): Promise<void> {
    const text = exportPreview.pass1Command
      ? `${exportPreview.pass1Command}\n\n${exportPreviewCommand}`
      : exportPreviewCommand
    const r = await window.velorix.clipboard.writeText(text)
    setStatusHint(
      r.ok ? uiText('statusFfmpegCommandCopied') : uiText('statusFfmpegCommandCopyFailed')
    )
  }

  return {
    handleSnapshot,
    handleExtractFrames,
    handleExport,
    handleCancelExport,
    handleOpenLastExport,
    handleCopyLastExportPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    handleCopyExportPreview
  }
}
