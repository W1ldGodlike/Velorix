import { useEffect } from 'react'

import type { ResolvedAppTheme } from '../../shared/settings-contract'
import {
  applyPersistedUiLocale,
  setUiLocaleForSession,
  syncDocumentUiLocale,
  uiText
} from './locales/ui-text'
import { sanitizeDownloadsRows } from './downloads-queue-view'
import { useUiTextHotReloadBump } from './locales/use-ui-text-hot-reload-bump'
import type { UseAppMainWindowEffectsDeps } from './use-app-main-window-effects-deps'

export function useAppMainWindowEffectsBootstrap(
  deps: UseAppMainWindowEffectsDeps,
  actions: { applyTheme: (value: ResolvedAppTheme) => void }
): void {
  const {
    trimSnapshotRef,
    currentSourcePath,
    setDownloadsRows,
    setUiLocaleRenderTick,
    hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels,
    hydrateDownloadsWindowUiPanels,
    setExportUserPresets,
    setSnapshotFormat,
    applyPreview,
    refetchHwEncoders
  } = deps
  const { applyTheme } = actions

  useUiTextHotReloadBump()

  useEffect(() => {
    let mounted = true
    void window.velorix.downloads.getSnapshot().then((rows) => {
      if (mounted) {
        setDownloadsRows(sanitizeDownloadsRows(rows))
      }
    })
    const unsubscribe = window.velorix.downloads.onSnapshot((rows) => {
      setDownloadsRows(sanitizeDownloadsRows(rows))
    })
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [setDownloadsRows])

  useEffect(() => {
    trimSnapshotRef.current = null
  }, [currentSourcePath, trimSnapshotRef])

  useEffect(() => {
    const offTheme = window.velorix.onThemeChanged((next) => {
      applyTheme(next)
    })
    const offPanels = window.velorix.onMainWindowUiPanelsChanged((panels) => {
      hydrateMainWindowUiPanels(panels)
    })
    return (): void => {
      offTheme()
      offPanels()
    }
  }, [applyTheme, hydrateMainWindowUiPanels])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const loaded = await window.velorix.settings.get()
      if (cancelled) {
        return
      }
      const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
      syncDocumentUiLocale(resolved)
      document.title = uiText('mainWindowDocumentTitle')
      setUiLocaleRenderTick((n) => n + 1)
      if (shouldPersist) {
        void window.velorix.settings.setUiLocale(resolved)
      }
      applyTheme(loaded.effectiveTheme)
      hydrateExportFieldsFromSettings(loaded)
      hydrateMainWindowUiPanels(loaded.mainWindowUiPanels)
      hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
      setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
      if (loaded.ffmpegSnapshotFormat === 'jpg' || loaded.ffmpegSnapshotFormat === 'webp') {
        setSnapshotFormat(loaded.ffmpegSnapshotFormat)
      }
    })().catch(console.error)

    return (): void => {
      cancelled = true
    }
  }, [
    applyTheme,
    hydrateDownloadsWindowUiPanels,
    hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels,
    setExportUserPresets,
    setSnapshotFormat,
    setUiLocaleRenderTick
  ])

  useEffect(() => {
    const off = window.velorix.onSettingsBackupImported(() => {
      void window.velorix.settings.get().then((loaded) => {
        const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
        syncDocumentUiLocale(resolved)
        document.title = uiText('mainWindowDocumentTitle')
        setUiLocaleRenderTick((n) => n + 1)
        if (shouldPersist) {
          void window.velorix.settings.setUiLocale(resolved)
        }
        applyTheme(loaded.effectiveTheme)
        hydrateExportFieldsFromSettings(loaded)
        hydrateMainWindowUiPanels(loaded.mainWindowUiPanels)
        hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
        setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
        if (loaded.ffmpegSnapshotFormat === 'jpg' || loaded.ffmpegSnapshotFormat === 'webp') {
          setSnapshotFormat(loaded.ffmpegSnapshotFormat)
        }
        void refetchHwEncoders()
      })
    })
    return off
  }, [
    applyTheme,
    hydrateDownloadsWindowUiPanels,
    hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels,
    refetchHwEncoders,
    setExportUserPresets,
    setSnapshotFormat,
    setUiLocaleRenderTick
  ])

  useEffect(() => {
    const off = window.velorix.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      syncDocumentUiLocale(loc)
      document.title = uiText('mainWindowDocumentTitle')
      setUiLocaleRenderTick((n) => n + 1)
      void window.velorix.settings.get().then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      })
    })
    return off
  }, [setExportUserPresets, setUiLocaleRenderTick])

  useEffect(() => {
    const off = window.velorix.downloads.onDownloadsWindowUiPanelsChanged((panels) => {
      hydrateDownloadsWindowUiPanels(panels)
    })
    return off
  }, [hydrateDownloadsWindowUiPanels])

  useEffect(() => {
    let cancelled = false
    void window.velorix.session.restoreLastSource().then((restored) => {
      if (cancelled || !restored) {
        return
      }
      applyPreview(restored)
    })
    return (): void => {
      cancelled = true
    }
  }, [applyPreview])
}
