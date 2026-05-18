import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react'

import type { DownloadsLogLineView } from './components/downloads/DownloadsLogPanel'
import { getUiLocale, uiText } from './locales/ui-text'
import type { DownloadsLogPayload } from '../../shared/downloads-log-contract'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import { groupYtdlpCommandHintsByCategory } from '../../shared/ytdlp-command-hints-group'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload
} from '../../shared/ytdlp-download-contract'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../shared/ytdlp-history-contract'

export type DownloadsHistoryOutcomeFilter = 'all' | YtdlpDownloadHistoryEntry['outcome']

export type UseDownloadsWorkspaceDeps = {
  setStatusHint: (hint: string | null) => void
}

export function useDownloadsWorkspace(deps: UseDownloadsWorkspaceDeps): {
  downloadsOptions: YtdlpDownloadOptionsPayload | null
  setDownloadsOptions: Dispatch<SetStateAction<YtdlpDownloadOptionsPayload | null>>
  downloadsOptionsBusy: boolean
  downloadsExpertHintFilter: string
  setDownloadsExpertHintFilter: (next: string) => void
  downloadsHistory: YtdlpDownloadHistoryEntry[]
  setDownloadsHistory: Dispatch<SetStateAction<YtdlpDownloadHistoryEntry[]>>
  downloadsHistoryBusy: boolean
  downloadsHistoryOutcomeFilter: DownloadsHistoryOutcomeFilter
  setDownloadsHistoryOutcomeFilter: (next: DownloadsHistoryOutcomeFilter) => void
  downloadsHistoryWeeklySummary: YtdlpDownloadHistoryWeeklySummary | null
  downloadsLogLines: DownloadsLogLineView[]
  setDownloadsLogLines: Dispatch<SetStateAction<DownloadsLogLineView[]>>
  downloadsLogTargetRowId: number | null
  setDownloadsLogTargetRowId: Dispatch<SetStateAction<number | null>>
  downloadsOutputDirectory: { path: string; isDefault: boolean } | null
  setDownloadsOutputDirectory: Dispatch<
    SetStateAction<{ path: string; isDefault: boolean } | null>
  >
  visibleDownloadsHistory: YtdlpDownloadHistoryEntry[]
  ytdlpCommandHintsFilteredByCategory: ReturnType<typeof groupYtdlpCommandHintsByCategory>
  refreshDownloadsOptions: () => Promise<void>
  applyDownloadsOptionsPatch: (patch: YtdlpDownloadOptionsPatch) => Promise<void>
  appendDownloadsExtraArgsToken: (token: string) => void
  refreshDownloadsHistory: () => Promise<void>
  exportVisibleDownloadsHistory: () => Promise<void>
  handleDownloadsLogPayload: (payload: DownloadsLogPayload) => void
  refreshDownloadsOutputDirectory: () => Promise<void>
} {
  const { setStatusHint } = deps

  const [downloadsOptions, setDownloadsOptions] = useState<YtdlpDownloadOptionsPayload | null>(null)
  const [downloadsOptionsBusy, setDownloadsOptionsBusy] = useState(false)
  const [downloadsExpertHintFilter, setDownloadsExpertHintFilter] = useState('')
  const [downloadsHistory, setDownloadsHistory] = useState<YtdlpDownloadHistoryEntry[]>([])
  const [downloadsHistoryBusy, setDownloadsHistoryBusy] = useState(false)
  const [downloadsHistoryOutcomeFilter, setDownloadsHistoryOutcomeFilter] =
    useState<DownloadsHistoryOutcomeFilter>('all')
  const [downloadsHistoryWeeklySummary, setDownloadsHistoryWeeklySummary] =
    useState<YtdlpDownloadHistoryWeeklySummary | null>(null)
  const [downloadsLogLines, setDownloadsLogLines] = useState<DownloadsLogLineView[]>([])
  const [downloadsLogTargetRowId, setDownloadsLogTargetRowId] = useState<number | null>(null)
  const [downloadsOutputDirectory, setDownloadsOutputDirectory] = useState<{
    path: string
    isDefault: boolean
  } | null>(null)

  const downloadsLogNextIdRef = useRef(1)

  const downloadsHintUiLocale = getUiLocale() as AppUiLocale

  const visibleDownloadsHistory = useMemo(
    () =>
      downloadsHistoryOutcomeFilter === 'all'
        ? downloadsHistory
        : downloadsHistory.filter((entry) => entry.outcome === downloadsHistoryOutcomeFilter),
    [downloadsHistory, downloadsHistoryOutcomeFilter]
  )

  const refreshDownloadsOptions = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.downloads.getCliOptions({
      uiLocale: getUiLocale() as AppUiLocale
    })
    if (res.ok) {
      setDownloadsOptions(res.payload)
      return
    }
    setStatusHint(res.error)
  }, [setStatusHint])

  const applyDownloadsOptionsPatch = useCallback(
    async (patch: YtdlpDownloadOptionsPatch): Promise<void> => {
      setDownloadsOptionsBusy(true)
      try {
        const res = await window.fluxalloy.downloads.setCliOptions(patch)
        if (!res.ok) {
          setStatusHint(res.error)
          return
        }
        await refreshDownloadsOptions()
      } finally {
        setDownloadsOptionsBusy(false)
      }
    },
    [refreshDownloadsOptions, setStatusHint]
  )

  const ytdlpCommandHintsFilteredByCategory = useMemo(
    () =>
      groupYtdlpCommandHintsByCategory(
        downloadsOptions?.commandHints,
        downloadsExpertHintFilter,
        downloadsHintUiLocale
      ),
    [downloadsOptions?.commandHints, downloadsExpertHintFilter, downloadsHintUiLocale]
  )

  const appendDownloadsExtraArgsToken = useCallback(
    (token: string) => {
      if (!downloadsOptions) {
        return
      }
      const cur = downloadsOptions.extraArgsLine.trim()
      const next = cur ? `${cur} ${token}` : token
      setDownloadsOptions({ ...downloadsOptions, extraArgsLine: next })
      void applyDownloadsOptionsPatch({ extraArgsLine: next })
    },
    [downloadsOptions, applyDownloadsOptionsPatch]
  )

  const refreshDownloadsHistory = useCallback(async (): Promise<void> => {
    setDownloadsHistoryBusy(true)
    try {
      const [rows, summary] = await Promise.all([
        window.fluxalloy.downloads.getHistory(),
        window.fluxalloy.downloads.getHistoryWeeklySummary()
      ])
      setDownloadsHistory(rows)
      setDownloadsHistoryWeeklySummary(summary)
    } finally {
      setDownloadsHistoryBusy(false)
    }
  }, [])

  const exportVisibleDownloadsHistory = useCallback(async (): Promise<void> => {
    const payload = {
      schema: 1,
      exportedAt: Date.now(),
      outcomeFilter: downloadsHistoryOutcomeFilter,
      entries: visibleDownloadsHistory
    }
    const res = await window.fluxalloy.saveTextWithDialog({
      title: uiText('downloadsHistoryExportDialogTitle'),
      defaultFileName: 'fluxalloy-downloads-history.json',
      content: JSON.stringify(payload, null, 2)
    })
    if (res.ok) {
      setStatusHint(uiText('downloadsHistoryExportSaved'))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [downloadsHistoryOutcomeFilter, setStatusHint, visibleDownloadsHistory])

  const handleDownloadsLogPayload = useCallback((payload: DownloadsLogPayload): void => {
    if (payload.kind === 'reset') {
      setDownloadsLogTargetRowId(payload.rowId)
      setDownloadsLogLines([])
      return
    }
    setDownloadsLogTargetRowId(payload.rowId)
    setDownloadsLogLines((prev) => {
      const nextId = downloadsLogNextIdRef.current++
      const next = [
        ...prev,
        { id: nextId, rowId: payload.rowId, stream: payload.stream, text: payload.text }
      ]
      return next.length > 420 ? next.slice(next.length - 420) : next
    })
  }, [])

  const refreshDownloadsOutputDirectory = useCallback(async (): Promise<void> => {
    const dir = await window.fluxalloy.downloads.getOutputDirectory()
    setDownloadsOutputDirectory(dir)
  }, [])

  useEffect(() => {
    let mounted = true
    void window.fluxalloy.downloads
      .getCliOptions({ uiLocale: getUiLocale() as AppUiLocale })
      .then((res) => {
        if (!mounted) {
          return
        }
        if (res.ok) {
          setDownloadsOptions(res.payload)
          return
        }
        setStatusHint(res.error)
      })
    return () => {
      mounted = false
    }
  }, [setStatusHint])

  useEffect(() => {
    let mounted = true
    void Promise.all([
      window.fluxalloy.downloads.getHistory(),
      window.fluxalloy.downloads.getHistoryWeeklySummary()
    ]).then(([rows, summary]) => {
      if (mounted) {
        setDownloadsHistory(rows)
        setDownloadsHistoryWeeklySummary(summary)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    return window.fluxalloy.downloads.onLog(handleDownloadsLogPayload)
  }, [handleDownloadsLogPayload])

  useEffect(() => {
    void window.fluxalloy.downloads.getOutputDirectory().then((dir) => {
      setDownloadsOutputDirectory(dir)
    })
  }, [])

  useEffect(() => {
    const off = window.fluxalloy.downloads.onDownloadsOutputDirectoryChanged((snap) => {
      setDownloadsOutputDirectory(snap)
    })
    return off
  }, [])

  useEffect(() => {
    const off = window.fluxalloy.downloads.onDownloadsCliOptionsChanged(() => {
      void refreshDownloadsOptions()
    })
    return off
  }, [refreshDownloadsOptions])

  return {
    downloadsOptions,
    setDownloadsOptions,
    downloadsOptionsBusy,
    downloadsExpertHintFilter,
    setDownloadsExpertHintFilter,
    downloadsHistory,
    setDownloadsHistory,
    downloadsHistoryBusy,
    downloadsHistoryOutcomeFilter,
    setDownloadsHistoryOutcomeFilter,
    downloadsHistoryWeeklySummary,
    downloadsLogLines,
    setDownloadsLogLines,
    downloadsLogTargetRowId,
    setDownloadsLogTargetRowId,
    downloadsOutputDirectory,
    setDownloadsOutputDirectory,
    visibleDownloadsHistory,
    ytdlpCommandHintsFilteredByCategory,
    refreshDownloadsOptions,
    applyDownloadsOptionsPatch,
    appendDownloadsExtraArgsToken,
    refreshDownloadsHistory,
    exportVisibleDownloadsHistory,
    handleDownloadsLogPayload,
    refreshDownloadsOutputDirectory
  }
}
