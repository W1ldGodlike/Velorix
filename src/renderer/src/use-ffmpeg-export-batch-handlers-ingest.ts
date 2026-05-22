import { useCallback } from 'react'

import { isFfmpegExportBatchVideoPath } from '../../shared/ffmpeg-export-batch-video-ext'
import { uiText } from './locales/ui-text'

export function useFfmpegExportBatchHandlersIngest({
  setStatusHint,
  setBatchOutputDirectory,
  setBatchAddStatusHint,
  batchExportBusy,
  previewPath
}: {
  setStatusHint: (hint: string | null) => void
  setBatchOutputDirectory: (path: string) => void
  setBatchAddStatusHint: (counts: { added: number; skipped: number }, emptyMsg?: string) => void
  batchExportBusy: boolean
  previewPath: string | undefined
}): {
  handleBatchPickFiles: () => Promise<void>
  handleBatchPickFolder: () => Promise<void>
  handleBatchPickOutputFolder: () => Promise<void>
  handleBatchClearOutputDirectory: () => Promise<void>
  handleBatchRevealSharedOutputFolder: () => Promise<void>
  handleBatchDropFiles: (files: FileList | null) => Promise<void>
  handleBatchAddCurrentPreview: () => Promise<void>
  handleBatchAddDownloadsDone: (ids?: number[]) => Promise<void>
} {
  const handleBatchPickFiles = useCallback(async (): Promise<void> => {
    const res = await window.velorix.batchExport.pickFiles()
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
    const res = await window.velorix.batchExport.pickFolder()
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
    const picked = await window.velorix.batchExport.pickOutputFolder()
    if (!picked.ok) {
      return
    }
    const s = await window.velorix.settings.setFfmpegExportBatchOutputDirectory(picked.path)
    setBatchOutputDirectory(
      typeof s.ffmpegExportBatchOutputDirectory === 'string'
        ? s.ffmpegExportBatchOutputDirectory
        : ''
    )
  }, [setBatchOutputDirectory])

  const handleBatchClearOutputDirectory = useCallback(async (): Promise<void> => {
    const s = await window.velorix.settings.setFfmpegExportBatchOutputDirectory(null)
    setBatchOutputDirectory(
      typeof s.ffmpegExportBatchOutputDirectory === 'string'
        ? s.ffmpegExportBatchOutputDirectory
        : ''
    )
  }, [setBatchOutputDirectory])

  const handleBatchRevealSharedOutputFolder = useCallback(async (): Promise<void> => {
    const res = await window.velorix.batchExport.revealSharedOutputFolder()
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
        const absolutePath = window.velorix.preview.getPathForFile(file)
        if (absolutePath) {
          paths.push(absolutePath)
        }
      }
      if (paths.length === 0) {
        return
      }
      const res = await window.velorix.batchExport.addPaths(paths)
      if (res.ok) {
        setBatchAddStatusHint(res)
      } else if ('error' in res) {
        setStatusHint(res.error)
      }
    },
    [batchExportBusy, setBatchAddStatusHint, setStatusHint]
  )

  const handleBatchAddCurrentPreview = useCallback(async (): Promise<void> => {
    if (!previewPath || !isFfmpegExportBatchVideoPath(previewPath)) {
      setStatusHint(uiText('batchExportNoVideoPaths'))
      return
    }
    const res = await window.velorix.batchExport.addPaths([previewPath])
    if (res.ok) {
      setBatchAddStatusHint(res)
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [previewPath, setBatchAddStatusHint, setStatusHint])

  const handleBatchAddDownloadsDone = useCallback(
    async (ids?: number[]): Promise<void> => {
      const res = await window.velorix.batchExport.addFromDownloadsDone(ids)
      if (!res.ok) {
        setStatusHint(res.error)
        return
      }
      setBatchAddStatusHint(res)
    },
    [setBatchAddStatusHint, setStatusHint]
  )

  return {
    handleBatchPickFiles,
    handleBatchPickFolder,
    handleBatchPickOutputFolder,
    handleBatchClearOutputDirectory,
    handleBatchRevealSharedOutputFolder,
    handleBatchDropFiles,
    handleBatchAddCurrentPreview,
    handleBatchAddDownloadsDone
  }
}
