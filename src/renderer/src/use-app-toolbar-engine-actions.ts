import { useCallback, type Dispatch, type SetStateAction } from 'react'

import {
  formatEngineUpdateCompareOnlyHint,
  formatEngineUpdateStatusHint,
  type EnginePathsDraft
} from './app-engines-ui'
import {
  getUiLocale,
  setUiLocaleForSession,
  syncDocumentUiLocale,
  uiText,
  uiTextVars
} from './locales/ui-text'
import type { EngineId } from '../../shared/engine-contract'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'

export type UseAppToolbarEngineActionsDeps = {
  applyPreview: (payload: RestoredSourceInfo) => void
  setStatusHint: Dispatch<SetStateAction<string | null>>
  setUiLocaleRenderTick: Dispatch<SetStateAction<number>>
  refreshEngineUi: () => Promise<void>
  setEngineDownloadBusy: Dispatch<SetStateAction<boolean>>
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  setAppSettingsOpen: Dispatch<SetStateAction<boolean>>
  setEnginePathsSaving: Dispatch<SetStateAction<boolean>>
}

export function useAppToolbarEngineActions(deps: UseAppToolbarEngineActionsDeps): {
  handleUiLocaleToggle: () => void
  handleOpenToolbar: () => Promise<void>
  handleOpenVideoFolderToolbar: () => Promise<void>
  handleEnginesDownload: () => Promise<void>
  handleEnginesCheckUpdates: () => Promise<void>
  handleClearDownloadedEngines: () => Promise<void>
  handleSaveEnginePaths: () => Promise<void>
  handlePickEngine: (id: EngineId) => Promise<void>
} {
  const {
    applyPreview,
    setStatusHint,
    setUiLocaleRenderTick,
    refreshEngineUi,
    setEngineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    setAppSettingsOpen,
    setEnginePathsSaving
  } = deps

  const handleUiLocaleToggle = useCallback((): void => {
    const next: AppUiLocale = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.velorix.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        syncDocumentUiLocale(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [setUiLocaleRenderTick])

  const handleOpenToolbar = useCallback(async (): Promise<void> => {
    const result = await window.velorix.preview.openFileDialog(getUiLocale() as AppUiLocale)
    if (result.ok) {
      applyPreview(result)
    }
  }, [applyPreview])

  const handleOpenVideoFolderToolbar = useCallback(async (): Promise<void> => {
    const result = await window.velorix.preview.openVideoFolderDialog(getUiLocale() as AppUiLocale)
    if (result.ok) {
      applyPreview(result)
    } else if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
      setStatusHint(result.error)
    }
  }, [applyPreview, setStatusHint])

  const handleEnginesDownload = useCallback(async (): Promise<void> => {
    setEngineDownloadBusy(true)
    setStatusHint(uiText('statusEnginesDownloadPreparing'))
    try {
      const res = await window.velorix.engines.download(getUiLocale() as AppUiLocale)
      if (!res.ok) {
        setStatusHint(uiTextVars('statusErrorWithDetail', { detail: res.error }))
        return
      }

      await refreshEngineUi()
      setStatusHint(uiText('statusEnginesDownloadedOk'))
    } catch (error) {
      setStatusHint(
        error instanceof Error ? error.message : uiText('statusEnginesDownloadFailedGeneric')
      )
    } finally {
      setEngineDownloadBusy(false)
    }
  }, [refreshEngineUi, setEngineDownloadBusy, setStatusHint])

  const handleEnginesCheckUpdates = useCallback(async (): Promise<void> => {
    setEngineDownloadBusy(true)
    setStatusHint(uiText('statusEnginesUpdateChecking'))
    try {
      const res = await window.velorix.engines.checkUpdatesAndDownload(getUiLocale() as AppUiLocale)
      if (!res.ok) {
        setStatusHint(uiTextVars('statusErrorWithDetail', { detail: res.error }))
        return
      }
      if (!res.platformSupported) {
        await refreshEngineUi()
        setStatusHint(formatEngineUpdateCompareOnlyHint(res.items))
        return
      }
      await refreshEngineUi()
      setStatusHint(formatEngineUpdateStatusHint(res.items, res.downloaded))
    } catch (error) {
      setStatusHint(
        error instanceof Error ? error.message : uiText('statusEnginesDownloadFailedGeneric')
      )
    } finally {
      setEngineDownloadBusy(false)
    }
  }, [refreshEngineUi, setEngineDownloadBusy, setStatusHint])

  const handleClearDownloadedEngines = useCallback(async (): Promise<void> => {
    setStatusHint(uiText('statusEnginesClearingUserBin'))
    try {
      const res = await window.velorix.engines.clearUserBin()
      if (!res.ok) {
        setStatusHint(uiTextVars('statusErrorWithDetail', { detail: res.error }))
        return
      }
      await refreshEngineUi()
      setStatusHint(
        res.removed > 0
          ? uiTextVars('statusEnginesUserBinRemovedCount', { n: String(res.removed) })
          : uiText('statusEnginesUserBinNothingRemoved')
      )
    } catch (error) {
      setStatusHint(
        error instanceof Error ? error.message : uiText('statusEnginesClearUserBinFailedGeneric')
      )
    }
  }, [refreshEngineUi, setStatusHint])

  const handleSaveEnginePaths = useCallback(async (): Promise<void> => {
    setEnginePathsSaving(true)
    try {
      await window.velorix.settings.setEngineExecutablePaths({
        ffmpeg: enginePathsDraft.ffmpeg.trim() || null,
        ffprobe: enginePathsDraft.ffprobe.trim() || null,
        'yt-dlp': enginePathsDraft['yt-dlp'].trim() || null
      })
      await refreshEngineUi()
      setAppSettingsOpen(false)
      setStatusHint(uiText('statusEnginePathsSaved'))
    } finally {
      setEnginePathsSaving(false)
    }
  }, [enginePathsDraft, refreshEngineUi, setAppSettingsOpen, setEnginePathsSaving, setStatusHint])

  const handlePickEngine = useCallback(
    async (id: EngineId): Promise<void> => {
      const picked = await window.velorix.settings.pickEngineExecutable(id)
      if (!picked) {
        return
      }
      setEnginePathsDraft((prev) => ({ ...prev, [id]: picked }))
    },
    [setEnginePathsDraft]
  )

  return {
    handleUiLocaleToggle,
    handleOpenToolbar,
    handleOpenVideoFolderToolbar,
    handleEnginesDownload,
    handleEnginesCheckUpdates,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    handlePickEngine
  }
}
