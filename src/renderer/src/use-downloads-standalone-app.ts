import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent
} from 'react'

import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { DownloadsWorkspaceMainProps } from './components/downloads/DownloadsWorkspaceMain'
import type { DownloadsSettingsRailProps } from './components/downloads/DownloadsSettingsRail'
import {
  downloadsRowMatchesStatus,
  sanitizeDownloadsRows,
  summarizeDownloadsRows,
  type DownloadsQueueRowView,
  type DownloadsStatusFilter
} from './downloads-queue-view'
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- downloads standalone controller
export function useDownloadsStandaloneApp() {
  const [theme, setTheme] = useState<ResolvedAppTheme>('dark')
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [downloadsRows, setDownloadsRows] = useState<DownloadsQueueRowView[]>([])
  const [downloadsStatusFilter, setDownloadsStatusFilter] = useState<DownloadsStatusFilter>('all')
  const [downloadsNarrowLayout, setDownloadsNarrowLayout] = useState(false)
  const [uiLocaleRenderTick, setUiLocaleRenderTick] = useState(0)
  const downloadsMainUrlFieldId = useId()
  const downloadsSettingsRailRef = useRef<HTMLElement | null>(null)

  useUiTextHotReloadBump(setUiLocaleRenderTick)

  const downloadsWorkspace = useDownloadsWorkspace({ setStatusHint })
  const downloadsWindowUiPanels = useDownloadsWindowUiPanels()

  const applyTheme = useCallback((value: ResolvedAppTheme) => {
    document.documentElement.dataset['theme'] = value
    setTheme(value)
  }, [])

  const handleUiLocaleToggle = useCallback((): void => {
    const next = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        syncDocumentUiLocale(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [])

  const toggleTheme = useCallback(async (): Promise<void> => {
    const next: ResolvedAppTheme = theme === 'dark' ? 'light' : 'dark'
    const loaded = await window.fluxalloy.settings.setTheme(next)
    applyTheme(loaded.effectiveTheme)
  }, [applyTheme, theme])

  const noopWorkspaceTab = useCallback((): void => {}, [])

  const { handleAddDownloadsFromMain } = useDownloadsUrlActions({
    downloadsUrl,
    setDownloadsUrl,
    setWorkspaceTab: noopWorkspaceTab,
    setStatusHint
  })

  const handleBatchAddDownloadsDone = useCallback(async (rowIds: number[]): Promise<void> => {
    const res = await window.fluxalloy.batchExport.addFromDownloadsDone(rowIds)
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    formatBatchAddStatusHint(setStatusHint, res)
  }, [])

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
  const downloadsStatusFilterChips = useMemo(
    (): DownloadsWorkspaceMainProps['downloadsStatusFilterChips'] => [
      { id: 'all', label: uiText('downloadsQueueFilterAll') },
      { id: 'running', label: uiText('downloadsQueueFilterRunning') },
      { id: 'done', label: uiText('downloadsQueueFilterDone') },
      { id: 'error', label: uiText('downloadsQueueFilterError') },
      { id: 'cancelled', label: uiText('downloadsQueueFilterCancelled') }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uiLocaleRenderTick refreshes labels
    [uiLocaleRenderTick]
  )

  const downloadsMainProps = useMemo(
    (): DownloadsWorkspaceMainProps => ({
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
      downloadsEmbeddedLogOpen: downloadsWindowUiPanels.downloadsEmbeddedLogOpen,
      persistDownloadsEmbeddedLogOpen: downloadsWindowUiPanels.persistDownloadsEmbeddedLogOpen,
      downloadsLogTargetRowId: downloadsWorkspace.downloadsLogTargetRowId,
      downloadsLogLines: downloadsWorkspace.downloadsLogLines,
      setDownloadsLogLines: downloadsWorkspace.setDownloadsLogLines,
      setDownloadsLogTargetRowId: downloadsWorkspace.setDownloadsLogTargetRowId
    }),
    [
      downloadsMainUrlFieldId,
      downloadsNarrowLayout,
      downloadsRows,
      downloadsStats,
      downloadsStatusFilter,
      downloadsStatusFilterChips,
      downloadsUrl,
      downloadsWindowUiPanels,
      downloadsWorkspace,
      handleAddDownloadsFromMain,
      handleBatchAddDownloadsDone,
      noopWorkspaceTab,
      visibleDownloadsRows
    ]
  )

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
      refreshDownloadsOptions: downloadsWorkspace.refreshDownloadsOptions
    }),
    [downloadsWorkspace, downloadsWindowUiPanels.downloadsRailPanels, handleDownloadsRailSectionToggle]
  )

  const downloadsWorkspaceAriaBusy =
    downloadsWorkspace.downloadsOptionsBusy || downloadsWorkspace.downloadsHistoryBusy

  useEffect(() => {
    document.title = uiText('downloadsWindowDocumentTitle')
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
  }, [])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    void window.fluxalloy.settings
      .get()
      .then((loaded) => {
        const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
        syncDocumentUiLocale(resolved)
        setUiLocaleRenderTick((n) => n + 1)
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
      setUiLocaleRenderTick((n) => n + 1)
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
  }, [])

  return {
    theme,
    statusHint,
    setStatusHint,
    handleUiLocaleToggle,
    toggleTheme,
    downloadsMainProps,
    downloadsSettingsProps,
    downloadsSettingsRailRef,
    downloadsWorkspaceAriaBusy,
    uiLocaleRenderTick
  }
}

export type DownloadsStandaloneAppModel = ReturnType<typeof useDownloadsStandaloneApp>
