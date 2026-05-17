import { useCallback, type Dispatch, type SetStateAction } from 'react'

import type { EnginePathsDraft } from './app-engines-ui'
import { getUiLocale, setUiLocaleForSession, uiText, uiTextVars } from './locales/ui-text'
import type { EngineId } from '../../shared/engine-contract'
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'

export type UseAppToolbarEngineActionsDeps = {
  applyPreview: (payload: RestoredSourceInfo) => void
  setStatusHint: Dispatch<SetStateAction<string | null>>
  setUiLocaleRenderTick: Dispatch<SetStateAction<number>>
  refreshEngineUi: () => Promise<void>
  setEngineDownloadBusy: Dispatch<SetStateAction<boolean>>
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  setEnginePathsOpen: Dispatch<SetStateAction<boolean>>
  setEnginePathsSaving: Dispatch<SetStateAction<boolean>>
}

export function useAppToolbarEngineActions(deps: UseAppToolbarEngineActionsDeps): {
  toggleTheme: () => Promise<void>
  handleUiLocaleToggle: () => void
  handleOpenToolbar: () => Promise<void>
  handleOpenVideoFolderToolbar: () => Promise<void>
  handleEnginesDownload: () => Promise<void>
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
    setEnginePathsOpen,
    setEnginePathsSaving
  } = deps

  const toggleTheme = useCallback(async (): Promise<void> => {
    const s = await window.fluxalloy.settings.get()
    if (s.theme === 'system') {
      void window.fluxalloy.settings.setTheme(s.effectiveTheme === 'dark' ? 'light' : 'dark')
    } else {
      void window.fluxalloy.settings.setTheme(s.theme === 'dark' ? 'light' : 'dark')
    }
  }, [])

  const handleUiLocaleToggle = useCallback((): void => {
    const next: DownloadsWindowUiLocale = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [setUiLocaleRenderTick])

  const handleOpenToolbar = useCallback(async (): Promise<void> => {
    const result = await window.fluxalloy.preview.openFileDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      applyPreview(result)
    }
  }, [applyPreview])

  const handleOpenVideoFolderToolbar = useCallback(async (): Promise<void> => {
    const result = await window.fluxalloy.preview.openVideoFolderDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
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
      const res = await window.fluxalloy.engines.download(getUiLocale() as DownloadsWindowUiLocale)
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

  const handleClearDownloadedEngines = useCallback(async (): Promise<void> => {
    setStatusHint(uiText('statusEnginesClearingUserBin'))
    try {
      const res = await window.fluxalloy.engines.clearUserBin()
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
      await window.fluxalloy.settings.setEngineExecutablePaths({
        ffmpeg: enginePathsDraft.ffmpeg.trim() || null,
        ffprobe: enginePathsDraft.ffprobe.trim() || null,
        'yt-dlp': enginePathsDraft['yt-dlp'].trim() || null
      })
      await refreshEngineUi()
      setEnginePathsOpen(false)
      setStatusHint(uiText('statusEnginePathsSaved'))
    } finally {
      setEnginePathsSaving(false)
    }
  }, [enginePathsDraft, refreshEngineUi, setEnginePathsOpen, setEnginePathsSaving, setStatusHint])

  const handlePickEngine = useCallback(
    async (id: EngineId): Promise<void> => {
      const picked = await window.fluxalloy.settings.pickEngineExecutable(id)
      if (!picked) {
        return
      }
      setEnginePathsDraft((prev) => ({ ...prev, [id]: picked }))
    },
    [setEnginePathsDraft]
  )

  return {
    toggleTheme,
    handleUiLocaleToggle,
    handleOpenToolbar,
    handleOpenVideoFolderToolbar,
    handleEnginesDownload,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    handlePickEngine
  }
}
