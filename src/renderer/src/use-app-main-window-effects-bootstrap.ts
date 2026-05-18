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

  useUiTextHotReloadBump(setUiLocaleRenderTick)

  useEffect(() => {
    let mounted = true
    void window.fluxalloy.downloads.getSnapshot().then((rows) => {
      if (mounted) {
        setDownloadsRows(sanitizeDownloadsRows(rows))
      }
    })
    const unsubscribe = window.fluxalloy.downloads.onSnapshot((rows) => {
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
    let cleanupTheme: (() => void) | undefined
    let cleanupUiPanels: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
      syncDocumentUiLocale(resolved)
      document.title = uiText('mainWindowDocumentTitle')
      setUiLocaleRenderTick((n) => n + 1)
      if (shouldPersist) {
        void window.fluxalloy.settings.setUiLocale(resolved)
      }
      applyTheme(loaded.effectiveTheme)
      hydrateExportFieldsFromSettings(loaded)
      hydrateMainWindowUiPanels(loaded.mainWindowUiPanels)
      hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
      setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
      if (
        loaded.ffmpegSnapshotFormat === 'jpg' ||
        loaded.ffmpegSnapshotFormat === 'webp'
      ) {
        setSnapshotFormat(loaded.ffmpegSnapshotFormat)
      }
      cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
      cleanupUiPanels = window.fluxalloy.onMainWindowUiPanelsChanged((panels) => {
        hydrateMainWindowUiPanels(panels)
      })
    })().catch(console.error)

    return (): void => {
      cleanupTheme?.()
      cleanupUiPanels?.()
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
    const off = window.fluxalloy.onSettingsBackupImported(() => {
      void window.fluxalloy.settings.get().then((loaded) => {
        const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
        syncDocumentUiLocale(resolved)
        document.title = uiText('mainWindowDocumentTitle')
        setUiLocaleRenderTick((n) => n + 1)
        if (shouldPersist) {
          void window.fluxalloy.settings.setUiLocale(resolved)
        }
        applyTheme(loaded.effectiveTheme)
        hydrateExportFieldsFromSettings(loaded)
        hydrateMainWindowUiPanels(loaded.mainWindowUiPanels)
        hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
        setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
        if (
          loaded.ffmpegSnapshotFormat === 'jpg' ||
          loaded.ffmpegSnapshotFormat === 'webp'
        ) {
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
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      syncDocumentUiLocale(loc)
      document.title = uiText('mainWindowDocumentTitle')
      setUiLocaleRenderTick((n) => n + 1)
      void window.fluxalloy.settings.get().then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      })
    })
    return off
  }, [setExportUserPresets, setUiLocaleRenderTick])

  useEffect(() => {
    const off = window.fluxalloy.downloads.onDownloadsWindowUiPanelsChanged((panels) => {
      hydrateDownloadsWindowUiPanels(panels)
    })
    return off
  }, [hydrateDownloadsWindowUiPanels])

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.session.restoreLastSource().then((restored) => {
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
