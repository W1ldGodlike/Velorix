import { useCallback, useEffect, useMemo, type SyntheticEvent } from 'react'

import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { DownloadsWorkspaceMainProps } from './components/downloads/DownloadsWorkspaceMain'
import type { DownloadsSettingsRailProps } from './components/downloads/DownloadsSettingsRail'
import { downloadsRowMatchesStatus, summarizeDownloadsRows } from './downloads-queue-view'
import {
  applyPersistedUiLocale,
  getUiLocale,
  setUiLocaleForSession,
  syncDocumentUiLocale,
  uiText
} from './locales/ui-text'
import { useUiTextHotReloadBump } from './locales/use-ui-text-hot-reload-bump'
import { useDownloadsUrlActions } from './use-downloads-url-actions'
import {
  type DownloadsRailPanelKey,
  useDownloadsWindowUiPanels
} from './use-downloads-window-ui-panels'
import { formatBatchAddStatusHint } from './use-ffmpeg-export-batch-deps'
import { useDownloadsWorkspace } from './use-downloads-workspace'
import { useAppRefsStore } from './stores/app-refs-store'
import { useAppShellStore } from './stores/app-shell-store'
import type { DownloadsStandaloneAppModel } from './use-downloads-standalone-app-model'

export function useDownloadsStandaloneApp(): DownloadsStandaloneAppModel {
  const theme = useAppShellStore((s) => s.theme)
  const statusHint = useAppShellStore((s) => s.statusHint)
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const downloadsUrl = useAppShellStore((s) => s.downloadsUrl)
  const setDownloadsUrl = useAppShellStore((s) => s.setDownloadsUrl)
  const downloadsRows = useAppShellStore((s) => s.downloadsRows)
  const downloadsStatusFilter = useAppShellStore((s) => s.downloadsStatusFilter)
  const setDownloadsStatusFilter = useAppShellStore((s) => s.setDownloadsStatusFilter)
  const downloadsNarrowLayout = useAppShellStore((s) => s.downloadsNarrowLayout)
  const setDownloadsNarrowLayout = useAppShellStore((s) => s.setDownloadsNarrowLayout)
  const knowledgeOpen = useAppShellStore((s) => s.knowledgeOpen)
  const setKnowledgeOpen = useAppShellStore((s) => s.setKnowledgeOpen)
  const knowledgeInitialSlug = useAppShellStore((s) => s.knowledgeInitialSlug)
  const setKnowledgeInitialSlug = useAppShellStore((s) => s.setKnowledgeInitialSlug)
  const downloadsMainUrlFieldId = useAppShellStore((s) => s.downloadsMainUrlFieldId)
  const downloadsSettingsRailRef = useAppRefsStore((s) => s.downloadsSettingsRailRef)
  useUiTextHotReloadBump()

  const downloadsWorkspace = useDownloadsWorkspace({ setStatusHint })
  const downloadsWindowUiPanels = useDownloadsWindowUiPanels()

  const applyTheme = useCallback((value: ResolvedAppTheme) => {
    document.documentElement.dataset['theme'] = value
    useAppShellStore.getState().setTheme(value)
  }, [])

  const handleUiLocaleToggle = useCallback((): void => {
    const next = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        syncDocumentUiLocale(next)
        useAppShellStore.getState().bumpUiLocaleRenderTick()
      })
      .catch(console.error)
  }, [])

  const toggleTheme = useCallback(async (): Promise<void> => {
    const next: ResolvedAppTheme = theme === 'dark' ? 'light' : 'dark'
    const loaded = await window.fluxalloy.settings.setTheme(next)
    applyTheme(loaded.effectiveTheme)
  }, [applyTheme, theme])

  const noopWorkspaceTab = useCallback((): void => {}, [])

  const onOpenKnowledgeArticle = useCallback(
    (slug: string): void => {
      setKnowledgeInitialSlug(slug)
      setKnowledgeOpen(true)
    },
    [setKnowledgeInitialSlug, setKnowledgeOpen]
  )

  const onOpenKnowledge = useCallback((): void => {
    setKnowledgeInitialSlug(null)
    setKnowledgeOpen(true)
  }, [setKnowledgeInitialSlug, setKnowledgeOpen])

  const { handleAddDownloadsFromMain } = useDownloadsUrlActions({
    downloadsUrl,
    setDownloadsUrl,
    setWorkspaceTab: noopWorkspaceTab,
    setStatusHint
  })

  const handleBatchAddDownloadsDone = useCallback(
    async (rowIds: number[]): Promise<void> => {
      const res = await window.fluxalloy.batchExport.addFromDownloadsDone(rowIds)
      if (!res.ok) {
        setStatusHint(res.error)
        return
      }
      formatBatchAddStatusHint(setStatusHint, res)
    },
    [setStatusHint]
  )

  const handleDownloadsRailSectionToggle = useCallback(
    (key: DownloadsRailPanelKey) => {
      return (e: SyntheticEvent<HTMLDetailsElement>): void => {
        downloadsWindowUiPanels.persistDownloadsRailPanelToggle(key, e.currentTarget.open)
      }
    },
    [downloadsWindowUiPanels]
  )

  const downloadsStats = useMemo(() => summarizeDownloadsRows(downloadsRows), [downloadsRows])
  const visibleDownloadsRows = useMemo(
    () => downloadsRows.filter((row) => downloadsRowMatchesStatus(row, downloadsStatusFilter)),
    [downloadsRows, downloadsStatusFilter]
  )
  const uiLocaleRenderTick = useAppShellStore((s) => s.uiLocaleRenderTick)

  const downloadsMainProps = useMemo((): DownloadsWorkspaceMainProps => {
    void uiLocaleRenderTick
    const downloadsStatusFilterChips: DownloadsWorkspaceMainProps['downloadsStatusFilterChips'] = [
      { id: 'all', label: uiText('downloadsQueueFilterAll') },
      { id: 'running', label: uiText('downloadsQueueFilterRunning') },
      { id: 'done', label: uiText('downloadsQueueFilterDone') },
      { id: 'error', label: uiText('downloadsQueueFilterError') },
      { id: 'cancelled', label: uiText('downloadsQueueFilterCancelled') }
    ]
    return {
      downloadsOptionsBusy: downloadsWorkspace.downloadsOptionsBusy,
      downloadsHistoryBusy: downloadsWorkspace.downloadsHistoryBusy,
      downloadsUrl,
      setDownloadsUrl,
      downloadsMainUrlFieldId,
      onAddToQueue: () => {
        void handleAddDownloadsFromMain()
      },
      downloadsNarrowLayout,
      onScrollToSettings: () => {
        downloadsSettingsRailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
      downloadsStats,
      downloadsStatusFilter,
      setDownloadsStatusFilter,
      downloadsStatusFilterChips,
      downloadsRows,
      visibleDownloadsRows,
      setStatusHint,
      onBatchAddDownloadsDone: (rowIds) => {
        void handleBatchAddDownloadsDone(rowIds)
      },
      onSelectDownloadsTab: noopWorkspaceTab,
      downloadsEmbeddedHistoryOpen: downloadsWindowUiPanels.downloadsEmbeddedHistoryOpen,
      persistDownloadsEmbeddedHistoryOpen:
        downloadsWindowUiPanels.persistDownloadsEmbeddedHistoryOpen,
      downloadsHistoryListMode: downloadsWindowUiPanels.downloadsHistoryListMode,
      persistDownloadsHistoryListMode: downloadsWindowUiPanels.persistDownloadsHistoryListMode,
      visibleDownloadsHistory: downloadsWorkspace.visibleDownloadsHistory,
      downloadsHistoryCount: downloadsWorkspace.downloadsHistory.length,
      downloadsHistoryOutcomeFilter: downloadsWorkspace.downloadsHistoryOutcomeFilter,
      setDownloadsHistoryOutcomeFilter: downloadsWorkspace.setDownloadsHistoryOutcomeFilter,
      downloadsHistoryWeeklySummary: downloadsWorkspace.downloadsHistoryWeeklySummary ?? {
        since: 0,
        until: 0,
        total: 0,
        success: 0,
        error: 0,
        cancelled: 0
      },
      refreshDownloadsHistory: downloadsWorkspace.refreshDownloadsHistory,
      setDownloadsHistory: downloadsWorkspace.setDownloadsHistory,
      exportVisibleDownloadsHistory: downloadsWorkspace.exportVisibleDownloadsHistory,
      onOpenKnowledgeArticle,
      downloadsEmbeddedLogOpen: downloadsWindowUiPanels.downloadsEmbeddedLogOpen,
      persistDownloadsEmbeddedLogOpen: downloadsWindowUiPanels.persistDownloadsEmbeddedLogOpen,
      downloadsLogTargetRowId: downloadsWorkspace.downloadsLogTargetRowId,
      downloadsLogLines: downloadsWorkspace.downloadsLogLines,
      setDownloadsLogLines: downloadsWorkspace.setDownloadsLogLines,
      setDownloadsLogTargetRowId: downloadsWorkspace.setDownloadsLogTargetRowId
    }
  }, [
    downloadsMainUrlFieldId,
    downloadsNarrowLayout,
    downloadsRows,
    downloadsSettingsRailRef,
    downloadsStats,
    downloadsStatusFilter,
    downloadsUrl,
    downloadsWindowUiPanels,
    downloadsWorkspace,
    handleAddDownloadsFromMain,
    handleBatchAddDownloadsDone,
    noopWorkspaceTab,
    onOpenKnowledgeArticle,
    setDownloadsStatusFilter,
    setDownloadsUrl,
    setStatusHint,
    uiLocaleRenderTick,
    visibleDownloadsRows
  ])

  const downloadsSettingsProps = useMemo(
    (): DownloadsSettingsRailProps => ({
      downloadsOptionsBusy: downloadsWorkspace.downloadsOptionsBusy,
      downloadsHistoryBusy: downloadsWorkspace.downloadsHistoryBusy,
      downloadsOptions: downloadsWorkspace.downloadsOptions,
      setDownloadsOptions: downloadsWorkspace.setDownloadsOptions,
      downloadsRailPanels: downloadsWindowUiPanels.downloadsRailPanels,
      onRailSectionToggle: handleDownloadsRailSectionToggle,
      applyDownloadsOptionsPatch: downloadsWorkspace.applyDownloadsOptionsPatch,
      downloadsOutputDirectory: downloadsWorkspace.downloadsOutputDirectory,
      setDownloadsOutputDirectory: downloadsWorkspace.setDownloadsOutputDirectory,
      refreshDownloadsOutputDirectory: downloadsWorkspace.refreshDownloadsOutputDirectory,
      setStatusHint,
      downloadsExpertHintFilter: downloadsWorkspace.downloadsExpertHintFilter,
      setDownloadsExpertHintFilter: downloadsWorkspace.setDownloadsExpertHintFilter,
      ytdlpCommandHintsFilteredByCategory: downloadsWorkspace.ytdlpCommandHintsFilteredByCategory,
      appendDownloadsExtraArgsToken: downloadsWorkspace.appendDownloadsExtraArgsToken,
      refreshDownloadsOptions: downloadsWorkspace.refreshDownloadsOptions,
      onOpenKnowledgeArticle
    }),
    [
      downloadsWorkspace,
      downloadsWindowUiPanels.downloadsRailPanels,
      handleDownloadsRailSectionToggle,
      onOpenKnowledgeArticle,
      setStatusHint
    ]
  )

  const downloadsWorkspaceAriaBusy =
    downloadsWorkspace.downloadsOptionsBusy || downloadsWorkspace.downloadsHistoryBusy

  useEffect(() => {
    document.title = uiText('downloadsWindowDocumentTitle')
  }, [])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    void window.fluxalloy.settings
      .get()
      .then((loaded) => {
        const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
        syncDocumentUiLocale(resolved)
        useAppShellStore.getState().bumpUiLocaleRenderTick()
        if (shouldPersist) {
          void window.fluxalloy.settings.setUiLocale(resolved)
        }
        applyTheme(loaded.effectiveTheme)
        downloadsWindowUiPanels.hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
        cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
          applyTheme(next)
        })
      })
      .catch(console.error)
    return (): void => {
      cleanupTheme?.()
    }
  }, [applyTheme, downloadsWindowUiPanels])

  useEffect(() => {
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      syncDocumentUiLocale(loc)
      useAppShellStore.getState().bumpUiLocaleRenderTick()
      document.title = uiText('downloadsWindowDocumentTitle')
    })
    return off
  }, [])

  useEffect(() => {
    const off = window.fluxalloy.downloads.onDownloadsWindowUiPanelsChanged((panels) => {
      downloadsWindowUiPanels.hydrateDownloadsWindowUiPanels(panels)
    })
    return off
  }, [downloadsWindowUiPanels])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }
    const mql = window.matchMedia('(max-width: 1100px)')
    const sync = (): void => {
      setDownloadsNarrowLayout(mql.matches)
    }
    sync()
    mql.addEventListener('change', sync)
    return (): void => {
      mql.removeEventListener('change', sync)
    }
  }, [setDownloadsNarrowLayout])

  return {
    theme,
    statusHint,
    setStatusHint,
    handleUiLocaleToggle,
    toggleTheme,
    knowledgeOpen,
    setKnowledgeOpen,
    knowledgeInitialSlug,
    setKnowledgeInitialSlug,
    onOpenKnowledge,
    onOpenKnowledgeArticle,
    downloadsMainProps,
    downloadsSettingsProps,
    downloadsSettingsRailRef,
    downloadsWorkspaceAriaBusy
  }
}

export type { DownloadsStandaloneAppModel } from './use-downloads-standalone-app-model'
