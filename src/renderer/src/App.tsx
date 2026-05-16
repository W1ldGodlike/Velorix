import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { JSX, SyntheticEvent } from 'react'

import { AboutDialog } from './components/AboutDialog'
import { KnowledgeDialog } from './components/KnowledgeDialog'
import { DownloadsSettingsRail } from './components/downloads/DownloadsSettingsRail'
import { DownloadsWorkspaceMain } from './components/downloads/DownloadsWorkspaceMain'
import { EditorBatchExportBar } from './components/editor/EditorBatchExportBar'
import { EditorPreviewSection } from './components/editor/EditorPreviewSection'
import { EditorFfmpegSettingsRail } from './components/editor/EditorFfmpegSettingsRail'
import { EditorQuickYtdlpBar } from './components/editor/EditorQuickYtdlpBar'
import { TerminalWorkspacePanel } from './components/TerminalWorkspacePanel'
import Versions from './components/Versions'
import {
  applyPersistedUiLocale,
  setUiLocaleForSession,
  getUiLocale,
  uiText,
  uiTextVars
} from './locales/ui-text'
import {
  IconBan,
  IconBook,
  IconCircleHelp,
  IconCloudDownload,
  IconDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconMoon,
  IconSettings,
  IconSun,
  IconWorkspaceEditor,
  IconWorkspaceTerminal
} from './components/LucideMiniIcons'
import type { EngineId } from '../../shared/engine-contract'
import { ENGINE_IDS } from '../../shared/engine-contract'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../shared/processing-history-contract'
import {
  useDownloadsWindowUiPanels,
  type DownloadsRailPanelKey
} from './use-downloads-window-ui-panels'
import { useMainWindowUiPanels } from './use-main-window-ui-panels'
import { useEditorExportSettings } from './use-editor-export-settings'
import { useEditorExportPipeline } from './use-editor-export-pipeline'
import { useFfmpegExportBatch } from './use-ffmpeg-export-batch'
import { useTerminalWorkspace } from './use-terminal-workspace'
import { useDownloadsUrlActions } from './use-downloads-url-actions'
import { useDownloadsWorkspace } from './use-downloads-workspace'
import {
  type EnginePathsDraft,
  type EngineSummary,
  engineLabel,
  engineSummaryText,
  formatEngineVersionsLine,
  summarizeEngines
} from './app-engines-ui'
import {
  clipboardLooksLikeDownloadsPayload,
  domTargetIsTextField,
  previewVideoMediaErrorDetailLabel
} from './app-shell-ui-helpers'
import { KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS, type WorkspaceTab } from './app-terminal-hint-ui'
import {
  type DownloadsQueueRowView,
  type DownloadsStatusFilter,
  downloadsRowMatchesStatus,
  sanitizeDownloadsRows,
  summarizeDownloadsRows
} from './downloads-queue-view'
type Theme = ResolvedAppTheme

type PreviewOpenedPayload = RestoredSourceInfo
function App(): JSX.Element {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('editor')
  const [theme, setTheme] = useState<Theme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  const [enginePathsOpen, setEnginePathsOpen] = useState(false)
  /** Сброс дерева после `applyPersistedUiLocale` — строки из `ui-text` читают `getUiLocale()` из модуля. */
  const [uiLocaleRenderTick, setUiLocaleRenderTick] = useState(0)
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [knowledgeInitialSlug, setKnowledgeInitialSlug] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutInfo, setAboutInfo] = useState<Awaited<
    ReturnType<typeof window.fluxalloy.about.getInfo>
  > | null>(null)
  const [enginePathsDraft, setEnginePathsDraft] = useState<EnginePathsDraft>({
    ffmpeg: '',
    ffprobe: '',
    'yt-dlp': ''
  })
  const [enginePathsSaving, setEnginePathsSaving] = useState(false)
  /** Подстрочное сообщение статусбара: прогресс загрузки движков, ошибки DnD и т.п. */
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewOpenedPayload | null>(null)
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probePending, setProbePending] = useState(false)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [downloadsRows, setDownloadsRows] = useState<DownloadsQueueRowView[]>([])
  const [downloadsStatusFilter, setDownloadsStatusFilter] = useState<DownloadsStatusFilter>('all')
  const {
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
    refreshDownloadsOutputDirectory
  } = useDownloadsWorkspace({ setStatusHint })
  const [processingHistory, setProcessingHistory] = useState<ProcessingHistoryEntry[]>([])
  const [processingHistoryBusy, setProcessingHistoryBusy] = useState(false)
  const [processingHistoryFilter, setProcessingHistoryFilter] = useState<ProcessingHistoryFilter>(
    {}
  )
  const [processingHistoryWeeklySummary, setProcessingHistoryWeeklySummary] =
    useState<ProcessingHistoryWeeklySummary | null>(null)
  const {
    downloadsEmbeddedHistoryOpen,
    downloadsEmbeddedLogOpen,
    downloadsRailPanels,
    hydrateDownloadsWindowUiPanels,
    persistDownloadsEmbeddedHistoryOpen,
    persistDownloadsEmbeddedLogOpen,
    persistDownloadsRailPanelToggle
  } = useDownloadsWindowUiPanels()
  /** Совпадает с `max-width: 1100px` в `main.css` для вкладки «Загрузки». */
  const [downloadsNarrowLayout, setDownloadsNarrowLayout] = useState(false)
  const downloadsMainUrlFieldId = useId()
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [exportBusy, setExportBusy] = useState(false)
  const [exportCancelBusy, setExportCancelBusy] = useState(false)
  const {
    exportEncodePreset,
    setExportEncodePreset,
    exportVideoCodec,
    setExportVideoCodec,
    hwEncoderProbe,
    exportContainer,
    setExportContainer,
    exportCrf,
    setExportCrf,
    exportVideoBitrate,
    setExportVideoBitrate,
    exportAudioMode,
    setExportAudioMode,
    exportAudioBitrate,
    setExportAudioBitrate,
    exportFps,
    setExportFps,
    exportVideoTransform,
    setExportVideoTransform,
    exportCropPreset,
    setExportCropPreset,
    exportScalePreset,
    setExportScalePreset,
    exportTwoPass,
    setExportTwoPass,
    exportEconomyMode,
    setExportEconomyMode,
    exportHwDecode,
    setExportHwDecode,
    exportExtraArgsLine,
    setExportExtraArgsLine,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    batchOutputSuffix,
    setBatchOutputSuffix,
    batchOutputDirectory,
    setBatchOutputDirectory,
    exportAudioGainDb,
    setExportAudioGainDb,
    exportStripMetadata,
    setExportStripMetadata,
    exportStripChapters,
    setExportStripChapters,
    exportSubtitleMode,
    setExportSubtitleMode,
    exportVideoDeinterlace,
    setExportVideoDeinterlace,
    exportVideoDenoise,
    setExportVideoDenoise,
    exportVideoDeband,
    setExportVideoDeband,
    exportVideoHisteq,
    setExportVideoHisteq,
    exportVideoLut3d,
    setExportVideoLut3d,
    lutCubePathForPreview,
    exportVideoSharpen,
    setExportVideoSharpen,
    exportVideoEqPreset,
    setExportVideoEqPreset,
    exportVideoHue,
    setExportVideoHue,
    exportVideoGrain,
    setExportVideoGrain,
    exportVideoVignette,
    setExportVideoVignette,
    exportVideoBlur,
    setExportVideoBlur,
    exportAudioNormalize,
    setExportAudioNormalize,
    exportUserPresets,
    setExportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    selectedExportUserPreset,
    exportPresetNameDialog,
    setExportPresetNameDialog,
    exportPresetSaving,
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath,
    snapshotFormat,
    setSnapshotFormat,
    snapshotBusy,
    setSnapshotBusy,
    ffmpegExportSelectOptions,
    exportVideoCodecResolvedForPreview,
    exportExtraArgsParsed,
    exportHwaccelDecodeForPreview,
    exportCodecStatusbarLabel,
    refetchHwEncoders,
    hydrateExportFieldsFromSettings,
    bumpManualExportEdit,
    buildCurrentFfmpegExportOverrides,
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleSubmitExportPresetName,
    handleOverwriteExportUserPreset
  } = useEditorExportSettings({ setStatusHint })
  const videoRef = useRef<HTMLVideoElement>(null)
  const { panelOpen, hydrateMainWindowUiPanels, persistMainWindowUiPanelToggle } =
    useMainWindowUiPanels()
  /** Стек видео+транспорт+таймлайн: цель fullscreen по референсу v0. */
  const previewStackRef = useRef<HTMLDivElement>(null)
  /** §6 / узкая ширина: `scrollIntoView` к панели настроек yt-dlp под очередью. */
  const downloadsSettingsRailRef = useRef<HTMLElement | null>(null)
  /** Последний диапазон In/Out с таймлайна для IPC экспорта, привязанный к текущему файлу. */
  const trimSnapshotRef = useRef<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>(null)
  /**
   * Состояние таймлайна для preview команды ffmpeg.
   * `path` хранится рядом, чтобы при смене источника `trimRange` ниже выводился как `null`
   * без synchronous `setState` в `useEffect` — таймлайн сам пришлёт новый диапазон, когда
   * у нового файла появится длительность (см. `VideoTimeline.markerGeometry`).
   */
  const [trimState, setTrimState] = useState<{
    path: string | null
    range: { inSec: number; outSec: number } | null
  }>({ path: null, range: null })
  const currentSourcePath = preview?.path ?? null

  const {
    terminalLine,
    setTerminalLine,
    terminalBusy,
    terminalHintFilter,
    setTerminalHintFilter,
    terminalHistory,
    terminalSuggestFocus,
    setTerminalSuggestFocus,
    terminalSuggestBlurTimeoutRef,
    terminalHintsSearchFieldId,
    terminalCommandInputId,
    visibleTerminalHints,
    terminalInlineSuggestions,
    terminalSuggestActiveIndex,
    setTerminalSuggestIndex,
    appendTerminalToken,
    applyTerminalSuggest,
    runTerminalLine,
    copyTerminalOutputLine
  } = useTerminalWorkspace({
    workspaceTab,
    currentSourcePath,
    setStatusHint
  })

  const previewPlaybackUrl = previewBlobUrl ?? preview?.mediaUrl ?? null
  const trimRange = trimState.path === currentSourcePath ? trimState.range : null
  const downloadsStats = useMemo(() => summarizeDownloadsRows(downloadsRows), [downloadsRows])
  const visibleDownloadsRows = useMemo(
    () => downloadsRows.filter((row) => downloadsRowMatchesStatus(row, downloadsStatusFilter)),
    [downloadsRows, downloadsStatusFilter]
  )
  const downloadsStatusFilterChips = useMemo(
    (): Array<{ id: DownloadsStatusFilter; label: string }> => [
      { id: 'all', label: uiText('downloadsQueueFilterAll') },
      { id: 'running', label: uiText('downloadsQueueFilterRunning') },
      { id: 'done', label: uiText('downloadsQueueFilterDone') },
      { id: 'error', label: uiText('downloadsQueueFilterError') },
      { id: 'cancelled', label: uiText('downloadsQueueFilterCancelled') }
    ],
    []
  )

  const refreshProcessingHistory = useCallback(
    async (filter: ProcessingHistoryFilter = processingHistoryFilter): Promise<void> => {
      setProcessingHistoryBusy(true)
      try {
        const [rows, summary] = await Promise.all([
          window.fluxalloy.processingHistory.get({ ...filter, limit: 100 }),
          window.fluxalloy.processingHistory.weeklySummary()
        ])
        setProcessingHistory(rows)
        setProcessingHistoryWeeklySummary(summary)
      } finally {
        setProcessingHistoryBusy(false)
      }
    },
    [processingHistoryFilter]
  )

  const applyProcessingHistoryFilter = useCallback(
    (next: ProcessingHistoryFilter): void => {
      setProcessingHistoryFilter(next)
      void refreshProcessingHistory(next)
    },
    [refreshProcessingHistory]
  )

  const exportVisibleProcessingHistory = useCallback(async (): Promise<void> => {
    const payload = {
      schema: 1,
      exportedAt: Date.now(),
      filter: processingHistoryFilter,
      weeklySummary: processingHistoryWeeklySummary,
      entries: processingHistory
    }
    const res = await window.fluxalloy.saveTextWithDialog({
      title: uiText('processingHistoryExportDialogTitle'),
      defaultFileName: 'fluxalloy-processing-history.json',
      content: JSON.stringify(payload, null, 2)
    })
    if (res.ok) {
      setStatusHint(uiText('processingHistoryExportSaved'))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [processingHistory, processingHistoryFilter, processingHistoryWeeklySummary])

  const handleDownloadsRailSectionToggle = useCallback(
    (key: DownloadsRailPanelKey) => {
      return (e: SyntheticEvent<HTMLDetailsElement>): void => {
        const open = e.currentTarget.open
        persistDownloadsRailPanelToggle(key, open)
      }
    },
    [persistDownloadsRailPanelToggle]
  )

  const applyPreview = useCallback((payload: PreviewOpenedPayload): void => {
    setProbeInfo(null)
    setStatusHint(null)
    setPreview(payload)
    setWorkspaceTab('editor')
  }, [])

  const handlePreviewVideoError = useCallback(
    (video: HTMLVideoElement): void => {
      if (!preview) {
        return
      }
      const mediaError = video.error
      const code = mediaError?.code ?? 0
      const detail = previewVideoMediaErrorDetailLabel(code)
      window.fluxalloy.log.send({
        level: 'error',
        scope: 'preview/video',
        message: `video element error code=${code} detail=${detail} path=${preview.path} mediaUrl=${preview.mediaUrl} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
      if (previewBlobUrl) {
        setStatusHint(uiTextVars('statusVideoPlayFailed', { detail }))
        return
      }

      setStatusHint(uiText('statusVideoDirectOpenFailedBlobTrying'))
      void fetch(preview.mediaUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          setPreviewBlobUrl((current) => {
            if (current) {
              URL.revokeObjectURL(current)
            }
            return blobUrl
          })
          setStatusHint(uiText('statusVideoBlobFallbackActive'))
          window.fluxalloy.log.send({
            level: 'info',
            scope: 'preview/video',
            message: `blob fallback ready size=${blob.size} type=${blob.type || 'unknown'} path=${preview.path}`
          })
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error)
          setStatusHint(uiTextVars('statusVideoPlayFailedAfterFallback', { detail }))
          window.fluxalloy.log.send({
            level: 'error',
            scope: 'preview/video',
            message: `blob fallback failed error=${message} path=${preview.path} mediaUrl=${preview.mediaUrl}`
          })
        })
    },
    [preview, previewBlobUrl]
  )

  const handlePreviewVideoLoaded = useCallback(
    (video: HTMLVideoElement): void => {
      if (!preview) {
        return
      }
      window.fluxalloy.log.send({
        level: 'info',
        scope: 'preview/video',
        message: `video metadata loaded duration=${video.duration || 0} size=${video.videoWidth}x${video.videoHeight} path=${preview.path} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
    },
    [preview, previewBlobUrl]
  )

  const {
    handleAddDownloadsFromMain,
    handleQuickYtdlpEnqueueLines,
    handleDownloadFirstUrlOpenInEditor
  } = useDownloadsUrlActions({
    downloadsUrl,
    setDownloadsUrl,
    setWorkspaceTab,
    setStatusHint
  })

  const onTrimRangeSnapshot = useCallback(
    (range: { inSec: number; outSec: number }) => {
      trimSnapshotRef.current = { path: currentSourcePath, range }
      setTrimState((prev) => {
        if (
          prev.path === currentSourcePath &&
          prev.range !== null &&
          Math.abs(prev.range.inSec - range.inSec) < 1e-3 &&
          Math.abs(prev.range.outSec - range.outSec) < 1e-3
        ) {
          return prev
        }
        return { path: currentSourcePath, range: { inSec: range.inSec, outSec: range.outSec } }
      })
    },
    [currentSourcePath]
  )

  const jumpToTrimExport = useCallback((): void => {
    persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
    persistMainWindowUiPanelToggle('ffmpegOutput', true)
    persistMainWindowUiPanelToggle('exportCommandPreview', true)
    const scroll = (): void => {
      document.getElementById('editor-ffmpeg-export-output')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scroll()
        window.setTimeout(scroll, 160)
      })
    })
  }, [persistMainWindowUiPanelToggle])

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
  }, [])

  useEffect(() => {
    let mounted = true
    void Promise.all([
      window.fluxalloy.processingHistory.get({ limit: 100 }),
      window.fluxalloy.processingHistory.weeklySummary()
    ]).then(([rows, summary]) => {
      if (mounted) {
        setProcessingHistory(rows)
        setProcessingHistoryWeeklySummary(summary)
      }
    })
    return () => {
      mounted = false
    }
  }, [])


  useEffect(() => {
    trimSnapshotRef.current = null
  }, [currentSourcePath])

  const applyTheme = useCallback((value: Theme) => {
    document.documentElement.dataset['theme'] = value
    setTheme(value)
  }, [])

  const refreshEngineUi = useCallback(async (): Promise<void> => {
    try {
      const loc = getUiLocale() as DownloadsWindowUiLocale
      const snapshot = await window.fluxalloy.engines.getStatus(loc)
      setEngineSummary(summarizeEngines(snapshot.engines))
      setEngineVersionsLine(formatEngineVersionsLine(snapshot))
      const need = await window.fluxalloy.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
      await refetchHwEncoders()
    } catch {
      setEngineSummary('error')
      setEngineVersionsLine('')
    }
  }, [refetchHwEncoders])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    let cleanupUiPanels: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
      setUiLocaleRenderTick((n) => n + 1)
      if (shouldPersist) {
        void window.fluxalloy.settings.setUiLocale(resolved)
      }
      applyTheme(loaded.effectiveTheme)
      hydrateExportFieldsFromSettings(loaded)
      hydrateMainWindowUiPanels(loaded.mainWindowUiPanels)
      hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
      setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
      if (loaded.ffmpegSnapshotFormat === 'jpg') {
        setSnapshotFormat('jpg')
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
    hydrateMainWindowUiPanels
  ])

  useEffect(() => {
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      setUiLocaleRenderTick((n) => n + 1)
    })
    return off
  }, [])

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

  useEffect(() => {
    queueMicrotask(() => {
      setPreviewBlobUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current)
        }
        return null
      })
    })
  }, [preview?.mediaUrl])

  useEffect(() => {
    const path = preview?.path
    if (!path) {
      queueMicrotask(() => setProbePending(false))
      return
    }
    queueMicrotask(() => setProbePending(true))
    let cancelled = false
    void window.fluxalloy.preview.probe(path).then((r) => {
      if (cancelled) {
        return
      }
      setProbePending(false)
      if (r.ok) {
        setProbeInfo(r)
      } else {
        setProbeInfo(null)
        setStatusHint(uiTextVars('statusPreviewProbeFailedTemplate', { error: r.error }))
      }
    })
    return (): void => {
      cancelled = true
    }
  }, [preview?.path])

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(() => {
      if (!cancelled) {
        void refreshEngineUi()
      }
    }, 0)
    return (): void => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [refreshEngineUi])

  useEffect(() => {
    if (!enginePathsOpen) {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      setEnginePathsDraft({
        ffmpeg: s.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: s.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': s.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [enginePathsOpen])

  useEffect(() => {
    const offMenu = window.fluxalloy.onOpenEnginePaths(() => {
      setEnginePathsOpen(true)
    })
    const offSynced = window.fluxalloy.onEnginePathsChanged(() => {
      void refreshEngineUi()
    })
    const offAbout = window.fluxalloy.onOpenAbout(() => {
      void window.fluxalloy.about.getInfo().then((info) => {
        setAboutInfo(info)
        setAboutOpen(true)
      })
    })
    return (): void => {
      offMenu()
      offSynced()
      offAbout()
    }
  }, [refreshEngineUi])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (!e.ctrlKey && !e.metaKey) {
        return
      }
      if (e.key !== 'v' && e.key !== 'V') {
        return
      }
      if (domTargetIsTextField(e.target)) {
        return
      }
      e.preventDefault()
      void window.fluxalloy.clipboard.readText().then((raw) => {
        if (!clipboardLooksLikeDownloadsPayload(raw)) {
          return
        }
        const trimmed = raw.trim()
        if (editorUrlPasteBehavior === 'download_open_editor') {
          setWorkspaceTab('editor')
          setDownloadsUrl(trimmed)
          setStatusHint(uiText('statusDownloadOpenEditorWorking'))
          void window.fluxalloy.downloads.downloadFirstUrlOpenInMainEditor(trimmed).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setDownloadsUrl('')
            setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
          })
          return
        }
        void window.fluxalloy.downloads.openWindow({ text: trimmed, uiLocale: getUiLocale() })
      })
    }

    document.addEventListener('keydown', onKeyDown)
    return (): void => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [editorUrlPasteBehavior])

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

  useEffect(() => {
    void window.fluxalloy.engines
      .shouldOfferDownload()
      .then(setEnginesOfferDownload)
      .catch(() => setEnginesOfferDownload(false))
  }, [engineSummary])

  useEffect(() => {
    const offProgress = window.fluxalloy.engines.onDownloadProgress((p) => {
      const pct = typeof p.percent === 'number' && p.percent >= 0 ? `${p.percent}% · ` : ''
      setStatusHint(`${pct}${p.message}`)
    })

    const offExport = window.fluxalloy.export.onProgress((p) => {
      const pct =
        typeof p.percent === 'number' && p.percent >= 0 ? `${Math.round(p.percent)}% · ` : ''
      const spd = typeof p.speed === 'string' && p.speed.trim() !== '' ? `${p.speed.trim()} · ` : ''
      const vc =
        typeof p.videoCodecUsed === 'string' && p.videoCodecUsed.trim() !== ''
          ? `${p.videoCodecUsed.trim()} · `
          : ''
      const batch =
        typeof p.batchRowId === 'number'
          ? uiTextVars('statusExportBatchRow', { id: String(p.batchRowId) }) + ' · '
          : ''
      setStatusHint(
        uiTextVars('statusExportProgress', { tail: `${batch}${pct}${spd}${vc}${p.message}` })
      )
    })

    const offMenuPreview = window.fluxalloy.onPreviewOpened((payload) => {
      applyPreview(payload)
    })

    return (): void => {
      offProgress()
      offExport()
      offMenuPreview()
    }
  }, [applyPreview])


  const {
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
    reportBatchPathsAdded
  } = useFfmpegExportBatch({
    setStatusHint,
    setWorkspaceTab,
    buildExportOverrides: buildCurrentFfmpegExportOverrides,
    previewPath: preview?.path,
    exportBusy,
    setBatchOutputDirectory,
    onBatchRunFinished: refreshProcessingHistory
  })

  const {
    handleSnapshot,
    handleExport,
    handleCancelExport,
    handleOpenLastExport,
    handleCopyLastExportPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint,
    handleCopyExportPreview
  } = useEditorExportPipeline({
    setStatusHint,
    preview,
    probeInfo,
    trimRange,
    trimSnapshotRef,
    videoRef,
    exportBusy,
    setExportBusy,
    exportCancelBusy,
    setExportCancelBusy,
    batchExportBusy,
    snapshotBusy,
    setSnapshotBusy,
    refreshProcessingHistory,
    buildCurrentFfmpegExportOverrides,
    exportContainer,
    exportEncodePreset,
    exportVideoCodecResolvedForPreview,
    exportCrf,
    exportVideoBitrate,
    exportAudioMode,
    exportAudioBitrate,
    exportFps,
    exportScalePreset,
    exportVideoTransform,
    exportCropPreset,
    exportTwoPass,
    exportEconomyMode,
    exportHwaccelDecodeForPreview,
    exportExtraArgsParsed,
    exportAudioGainDb,
    exportStripMetadata,
    exportStripChapters,
    exportSubtitleMode,
    exportVideoDeinterlace,
    exportVideoDenoise,
    exportVideoDeband,
    exportVideoHisteq,
    lutCubePathForPreview,
    exportVideoSharpen,
    exportVideoEqPreset,
    exportVideoHue,
    exportVideoGrain,
    exportVideoVignette,
    exportVideoBlur,
    exportAudioNormalize,
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath
  })

  async function toggleTheme(): Promise<void> {
    const s = await window.fluxalloy.settings.get()
    if (s.theme === 'system') {
      void window.fluxalloy.settings.setTheme(s.effectiveTheme === 'dark' ? 'light' : 'dark')
    } else {
      void window.fluxalloy.settings.setTheme(s.theme === 'dark' ? 'light' : 'dark')
    }
  }

  const handleUiLocaleToggle = useCallback((): void => {
    const next: DownloadsWindowUiLocale = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [])

  async function handleOpenToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      applyPreview(result)
    }
  }

  async function handleOpenVideoFolderToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openVideoFolderDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      applyPreview(result)
    } else if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
      setStatusHint(result.error)
    }
  }

  async function handleEnginesDownload(): Promise<void> {
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
  }

  async function handleClearDownloadedEngines(): Promise<void> {
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
  }

  async function handleSaveEnginePaths(): Promise<void> {
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
  }

  async function handlePickEngine(id: EngineId): Promise<void> {
    const picked = await window.fluxalloy.settings.pickEngineExecutable(id)
    if (!picked) {
      return
    }
    setEnginePathsDraft((prev) => ({ ...prev, [id]: picked }))
  }

  async function handlePreviewDrop(
    files: FileList | null,
    dataTransfer?: DataTransfer | null
  ): Promise<void> {
    const file = files?.[0]
    if (!file) {
      const urlText = dataTransfer?.getData('text/plain')?.trim() ?? ''
      if (clipboardLooksLikeDownloadsPayload(urlText)) {
        if (editorUrlPasteBehavior === 'download_open_editor') {
          setDownloadsUrl(urlText)
          setStatusHint(uiText('statusDownloadOpenEditorWorking'))
          const res = await window.fluxalloy.downloads.downloadFirstUrlOpenInMainEditor(urlText)
          if (!res.ok) {
            setStatusHint(res.error)
            return
          }
          setDownloadsUrl('')
          setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
        } else {
          void window.fluxalloy.downloads.openWindow({ text: urlText, uiLocale: getUiLocale() })
        }
      }
      return
    }
    const absolutePath = window.fluxalloy.preview.getPathForFile(file)
    const granted = await window.fluxalloy.preview.grantPath(absolutePath)
    if (!granted.ok) {
      setStatusHint(uiTextVars('statusDndGrantFailed', { error: granted.error }))
      return
    }
    applyPreview(granted)
  }

  const editorFfmpegDetailBusy = exportBusy || snapshotBusy || exportCancelBusy || probePending

  const editorPreviewRegionBusy =
    exportBusy || snapshotBusy || probePending || exportCancelBusy || batchExportBusy

  const appChromeBusy =
    engineDownloadBusy ||
    engineSummary === 'checking' ||
    probePending ||
    exportBusy ||
    snapshotBusy ||
    exportCancelBusy ||
    terminalBusy ||
    batchExportBusy ||
    exportPresetSaving ||
    enginePathsSaving ||
    downloadsOptionsBusy ||
    downloadsHistoryBusy

  return (
    <div className="app-shell" aria-label={uiText('appMainShellAria')} aria-busy={appChromeBusy}>
      <header
        className="app-topbar"
        aria-label={uiText('topbarHeaderAria')}
        aria-busy={appChromeBusy}
      >
        <div
          className="app-topbar-brand"
          aria-label={uiText('topbarProductName')}
          aria-busy={engineDownloadBusy || engineSummary === 'checking'}
        >
          <span className="app-topbar-mark" aria-hidden>
            ◇
          </span>
          <span className="app-topbar-title">{uiText('topbarProductName')}</span>
        </div>
        <nav
          className="app-workspace-tabs"
          aria-label={uiText('workspaceTabsAria')}
          role="tablist"
          aria-orientation="horizontal"
          aria-busy={appChromeBusy}
        >
          <button
            type="button"
            id="workspace-tab-editor"
            className={`app-workspace-tab${workspaceTab === 'editor' ? ' app-workspace-tab-active' : ''}`}
            role="tab"
            aria-selected={workspaceTab === 'editor'}
            aria-controls="workspace-panel-editor"
            aria-describedby="workspace-tab-editor-desc"
            title={uiText('workspaceTabEditorTooltip')}
            onClick={() => {
              setWorkspaceTab('editor')
            }}
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconWorkspaceEditor title="" size={16} />
            </span>
            {uiText('workspaceTabEditor')}
            <span id="workspace-tab-editor-desc" className="app-visually-hidden">
              {uiText('editorWorkbenchAria')}
            </span>
          </button>
          <button
            type="button"
            id="workspace-tab-downloads"
            className={`app-workspace-tab${workspaceTab === 'downloads' ? ' app-workspace-tab-active' : ''}`}
            role="tab"
            aria-selected={workspaceTab === 'downloads'}
            aria-controls="workspace-panel-downloads"
            aria-describedby="workspace-tab-downloads-desc"
            onClick={() => {
              setWorkspaceTab('downloads')
            }}
            title={uiText('workspaceTabDownloadsTooltip')}
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconDownload title="" size={16} />
            </span>
            {uiText('workspaceTabDownloads')}
            <span id="workspace-tab-downloads-desc" className="app-visually-hidden">
              {uiText('downloadsWorkbenchAria')}
            </span>
          </button>
          <button
            type="button"
            id="workspace-tab-terminal"
            className={`app-workspace-tab${workspaceTab === 'terminal' ? ' app-workspace-tab-active' : ''}`}
            role="tab"
            aria-selected={workspaceTab === 'terminal'}
            aria-controls="workspace-panel-terminal"
            aria-describedby="workspace-tab-terminal-desc"
            onClick={() => {
              setWorkspaceTab('terminal')
            }}
            title={uiText('workspaceTabTerminalTooltip')}
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconWorkspaceTerminal title="" size={16} />
            </span>
            {uiText('workspaceTabTerminal')}
            <span id="workspace-tab-terminal-desc" className="app-visually-hidden">
              {uiText('terminalWorkbenchAria')}
            </span>
          </button>
        </nav>
        <div
          className="app-topbar-trailing"
          role="group"
          aria-label={uiText('topbarTrailingGroupAria')}
          aria-busy={appChromeBusy}
        >
          <div
            className="app-topbar-actions"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('topbarActionsToolbarAria')}
            aria-busy={appChromeBusy}
          >
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void handleOpenVideoFolderToolbar()
              }}
              title={uiText('topbarOpenVideoFolderTitle')}
            >
              <IconFolder />
              <span className="app-visually-hidden">{uiText('topbarOpenVideoFolderLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void handleOpenToolbar()
              }}
              title={uiText('topbarOpenFileTitle')}
            >
              <IconFolderOpen />
              <span className="app-visually-hidden">{uiText('topbarOpenFileLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void window.fluxalloy.inspector.openWindow(preview?.path ?? null)
              }}
              title={uiText('topbarInspectorTitle')}
            >
              <IconFilm />
              <span className="app-visually-hidden">{uiText('topbarInspectorLabel')}</span>
            </button>
            {exportBusy ? (
              <button
                type="button"
                className="app-icon-btn app-icon-btn-warn"
                disabled={exportCancelBusy}
                aria-label={
                  exportCancelBusy
                    ? uiText('topbarExportCancelBusy')
                    : uiText('topbarExportCancelReady')
                }
                onClick={() => {
                  void handleCancelExport()
                }}
                title={uiText('topbarExportCancelTitle')}
              >
                <IconBan
                  title={
                    exportCancelBusy
                      ? uiText('topbarExportCancelBusy')
                      : uiText('topbarExportCancelReady')
                  }
                />
              </button>
            ) : null}
            {enginesOfferDownload ? (
              <button
                type="button"
                className="app-icon-btn app-icon-btn-warn"
                disabled={engineDownloadBusy}
                aria-label={
                  engineDownloadBusy
                    ? uiText('topbarEnginesDownloadBusy')
                    : uiText('topbarEnginesDownloadReady')
                }
                onClick={() => {
                  void handleEnginesDownload()
                }}
                title={uiText('topbarEnginesDownloadTitle')}
              >
                <IconCloudDownload
                  title={
                    engineDownloadBusy
                      ? uiText('topbarEnginesDownloadBusy')
                      : uiText('topbarEnginesDownloadReady')
                  }
                />
              </button>
            ) : null}
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                setEnginePathsOpen(true)
              }}
              title={uiText('topbarEnginePathsTitle')}
            >
              <IconSettings />
              <span className="app-visually-hidden">{uiText('topbarEnginePathsLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                setKnowledgeInitialSlug(null)
                setKnowledgeOpen(true)
              }}
              title={uiText('knowledgeTopbarTooltip')}
            >
              <IconBook />
              <span className="app-visually-hidden">{uiText('topbarKnowledgeLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void window.fluxalloy.about.getInfo().then((info) => {
                  setAboutInfo(info)
                  setAboutOpen(true)
                })
              }}
              title={uiText('topbarAboutTitle')}
            >
              <IconCircleHelp />
              <span className="app-visually-hidden">{uiText('topbarAboutLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn app-locale-badge"
              onClick={handleUiLocaleToggle}
              title={
                getUiLocale() === 'ru'
                  ? uiText('topbarUiLocaleSwitchToEnglishTitle')
                  : uiText('topbarUiLocaleSwitchToRussianTitle')
              }
            >
              <span aria-hidden>{getUiLocale() === 'ru' ? 'RU' : 'EN'}</span>
              <span className="app-visually-hidden">
                {getUiLocale() === 'ru'
                  ? uiText('topbarUiLocaleVisuallyHiddenRu')
                  : uiText('topbarUiLocaleVisuallyHiddenEn')}
              </span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={toggleTheme}
              title={uiText('topbarThemeToggleTitle')}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
              <span className="app-visually-hidden">
                {theme === 'dark' ? uiText('topbarThemeUseLight') : uiText('topbarThemeUseDark')}
              </span>
            </button>
          </div>
        </div>
      </header>

      {workspaceTab === 'editor' ? (
        <EditorQuickYtdlpBar
          open={panelOpen('quickYtdlp')}
          onOpenChange={(open) => {
            persistMainWindowUiPanelToggle('quickYtdlp', open)
          }}
          chromeBusy={engineDownloadBusy || downloadsOptionsBusy || downloadsHistoryBusy}
          downloadsUrl={downloadsUrl}
          setDownloadsUrl={setDownloadsUrl}
          editorUrlPasteBehavior={editorUrlPasteBehavior}
          setEditorUrlPasteBehavior={setEditorUrlPasteBehavior}
          onEnqueueLines={() => {
            void handleQuickYtdlpEnqueueLines()
          }}
          onDownloadFirstUrlOpenInEditor={() => {
            void handleDownloadFirstUrlOpenInEditor()
          }}
        />
      ) : null}

      {workspaceTab === 'editor' ? (
        <EditorBatchExportBar
          open={panelOpen('batchExport')}
          onOpenChange={(open) => {
            persistMainWindowUiPanelToggle('batchExport', open)
          }}
          batchExportBusy={batchExportBusy}
          batchSnapshot={batchSnapshot}
          batchOutputSuffix={batchOutputSuffix}
          setBatchOutputSuffix={setBatchOutputSuffix}
          batchOutputDirectory={batchOutputDirectory}
          batchDragRowId={batchDragRowId}
          setBatchDragRowId={setBatchDragRowId}
          previewPath={preview?.path}
          setStatusHint={setStatusHint}
          handleBatchDropFiles={handleBatchDropFiles}
          handleBatchPickOutputFolder={handleBatchPickOutputFolder}
          handleBatchRevealSharedOutputFolder={handleBatchRevealSharedOutputFolder}
          handleBatchClearOutputDirectory={handleBatchClearOutputDirectory}
          handleBatchPickFiles={handleBatchPickFiles}
          handleBatchPickFolder={handleBatchPickFolder}
          handleBatchAddCurrentPreview={handleBatchAddCurrentPreview}
          handleBatchAddDownloadsDone={() => {
            void handleBatchAddDownloadsDone()
          }}
          handleBatchStart={handleBatchStart}
          handleBatchCancel={handleBatchCancel}
          handleBatchRetryFailed={handleBatchRetryFailed}
          handleBatchRetryFailedAndStart={handleBatchRetryFailedAndStart}
          handleBatchClearCompleted={handleBatchClearCompleted}
          handleBatchCopyInputPaths={handleBatchCopyInputPaths}
          handleBatchCopyOutputPaths={handleBatchCopyOutputPaths}
          handleBatchSaveReport={handleBatchSaveReport}
          handleBatchRemoveWaiting={handleBatchRemoveWaiting}
          handleBatchOpenOutput={handleBatchOpenOutput}
          handleBatchOpenInput={handleBatchOpenInput}
          handleBatchCopyRowPath={handleBatchCopyRowPath}
        />
      ) : null}

      {workspaceTab === 'editor' ? (
        <main
          id="workspace-panel-editor"
          role="tabpanel"
          aria-labelledby="workspace-tab-editor"
          aria-busy={
            exportBusy || snapshotBusy || probePending || exportCancelBusy || batchExportBusy
          }
          className={`app-main app-workbench${panelOpen('ffmpegSettingsRailOpen') ? '' : ' app-workbench-ffmpeg-collapsed'}`}
        >
          <EditorPreviewSection
            editorPreviewRegionBusy={editorPreviewRegionBusy}
            preview={preview}
            previewPlaybackUrl={previewPlaybackUrl}
            previewStackRef={previewStackRef}
            videoRef={videoRef}
            probeInfo={probeInfo}
            probePending={probePending}
            exportBusy={exportBusy}
            snapshotBusy={snapshotBusy}
            ffmpegSettingsRailOpen={panelOpen('ffmpegSettingsRailOpen')}
            onShowFfmpegSettingsRail={() => {
              persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
            }}
            handlePreviewDrop={handlePreviewDrop}
            handlePreviewVideoLoaded={handlePreviewVideoLoaded}
            handlePreviewVideoError={handlePreviewVideoError}
            onTrimRangeSnapshot={onTrimRangeSnapshot}
            jumpToTrimExport={jumpToTrimExport}
            handleExport={handleExport}
            handleSnapshot={handleSnapshot}
          />
          {panelOpen('ffmpegSettingsRailOpen') ? (
            <EditorFfmpegSettingsRail
              panelOpen={panelOpen}
              persistMainWindowUiPanelToggle={persistMainWindowUiPanelToggle}
              onCollapseRail={() => {
                persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', false)
              }}
              setStatusHint={setStatusHint}
              editorFfmpegDetailBusy={editorFfmpegDetailBusy}
              exportBusy={exportBusy}
              exportCancelBusy={exportCancelBusy}
              snapshotBusy={snapshotBusy}
              probePending={probePending}
              hwEncoderProbe={hwEncoderProbe}
              exportEncodePreset={exportEncodePreset}
              setExportEncodePreset={setExportEncodePreset}
              exportVideoCodec={exportVideoCodec}
              setExportVideoCodec={setExportVideoCodec}
              exportContainer={exportContainer}
              setExportContainer={setExportContainer}
              exportCrf={exportCrf}
              setExportCrf={setExportCrf}
              exportVideoBitrate={exportVideoBitrate}
              setExportVideoBitrate={setExportVideoBitrate}
              exportAudioMode={exportAudioMode}
              setExportAudioMode={setExportAudioMode}
              exportAudioBitrate={exportAudioBitrate}
              setExportAudioBitrate={setExportAudioBitrate}
              exportFps={exportFps}
              setExportFps={setExportFps}
              exportVideoTransform={exportVideoTransform}
              setExportVideoTransform={setExportVideoTransform}
              exportCropPreset={exportCropPreset}
              setExportCropPreset={setExportCropPreset}
              exportScalePreset={exportScalePreset}
              setExportScalePreset={setExportScalePreset}
              exportTwoPass={exportTwoPass}
              setExportTwoPass={setExportTwoPass}
              exportEconomyMode={exportEconomyMode}
              setExportEconomyMode={setExportEconomyMode}
              exportHwDecode={exportHwDecode}
              setExportHwDecode={setExportHwDecode}
              exportExtraArgsLine={exportExtraArgsLine}
              setExportExtraArgsLine={setExportExtraArgsLine}
              exportAudioGainDb={exportAudioGainDb}
              setExportAudioGainDb={setExportAudioGainDb}
              exportStripMetadata={exportStripMetadata}
              setExportStripMetadata={setExportStripMetadata}
              exportStripChapters={exportStripChapters}
              setExportStripChapters={setExportStripChapters}
              exportSubtitleMode={exportSubtitleMode}
              setExportSubtitleMode={setExportSubtitleMode}
              exportVideoDeinterlace={exportVideoDeinterlace}
              setExportVideoDeinterlace={setExportVideoDeinterlace}
              exportVideoDenoise={exportVideoDenoise}
              setExportVideoDenoise={setExportVideoDenoise}
              exportVideoDeband={exportVideoDeband}
              setExportVideoDeband={setExportVideoDeband}
              exportVideoHisteq={exportVideoHisteq}
              setExportVideoHisteq={setExportVideoHisteq}
              exportVideoLut3d={exportVideoLut3d}
              setExportVideoLut3d={setExportVideoLut3d}
              exportVideoSharpen={exportVideoSharpen}
              setExportVideoSharpen={setExportVideoSharpen}
              exportVideoEqPreset={exportVideoEqPreset}
              setExportVideoEqPreset={setExportVideoEqPreset}
              exportVideoHue={exportVideoHue}
              setExportVideoHue={setExportVideoHue}
              exportVideoGrain={exportVideoGrain}
              setExportVideoGrain={setExportVideoGrain}
              exportVideoVignette={exportVideoVignette}
              setExportVideoVignette={setExportVideoVignette}
              exportVideoBlur={exportVideoBlur}
              setExportVideoBlur={setExportVideoBlur}
              exportAudioNormalize={exportAudioNormalize}
              setExportAudioNormalize={setExportAudioNormalize}
              exportUserPresets={exportUserPresets}
              selectedUserPresetId={selectedUserPresetId}
              setSelectedUserPresetId={setSelectedUserPresetId}
              selectedExportUserPreset={selectedExportUserPreset}
              lastExportPath={lastExportPath}
              lastSnapshotPath={lastSnapshotPath}
              snapshotFormat={snapshotFormat}
              setSnapshotFormat={setSnapshotFormat}
              ffmpegExportSelectOptions={ffmpegExportSelectOptions}
              exportExtraArgsParsed={exportExtraArgsParsed}
              hydrateExportFieldsFromSettings={hydrateExportFieldsFromSettings}
              bumpManualExportEdit={bumpManualExportEdit}
              handleSaveExportUserPreset={handleSaveExportUserPreset}
              handleDeleteExportUserPreset={handleDeleteExportUserPreset}
              handleRenameExportUserPreset={handleRenameExportUserPreset}
              handleOverwriteExportUserPreset={handleOverwriteExportUserPreset}
              exportPreview={exportPreview}
              exportPreviewCommand={exportPreviewCommand}
              exportPreviewHint={exportPreviewHint}
              handleCopyExportPreview={handleCopyExportPreview}
              handleOpenLastExport={handleOpenLastExport}
              handleCopyLastExportPath={handleCopyLastExportPath}
              handleOpenLastSnapshot={handleOpenLastSnapshot}
              handleCopyLastSnapshotPath={handleCopyLastSnapshotPath}
              processingHistory={processingHistory}
              setProcessingHistory={setProcessingHistory}
              processingHistoryBusy={processingHistoryBusy}
              processingHistoryFilter={processingHistoryFilter}
              processingHistoryWeeklySummary={processingHistoryWeeklySummary}
              setProcessingHistoryWeeklySummary={setProcessingHistoryWeeklySummary}
              applyProcessingHistoryFilter={applyProcessingHistoryFilter}
              refreshProcessingHistory={refreshProcessingHistory}
              exportVisibleProcessingHistory={exportVisibleProcessingHistory}
              reportBatchPathsAdded={reportBatchPathsAdded}
            />
          ) : null}
        </main>
      ) : workspaceTab === 'terminal' ? (
        <TerminalWorkspacePanel
          terminalBusy={terminalBusy}
          terminalLine={terminalLine}
          setTerminalLine={setTerminalLine}
          terminalCommandInputId={terminalCommandInputId}
          terminalInlineSuggestions={terminalInlineSuggestions}
          terminalSuggestFocus={terminalSuggestFocus}
          setTerminalSuggestFocus={setTerminalSuggestFocus}
          terminalSuggestActiveIndex={terminalSuggestActiveIndex}
          setTerminalSuggestIndex={setTerminalSuggestIndex}
          terminalSuggestBlurTimeoutRef={terminalSuggestBlurTimeoutRef}
          currentSourcePath={currentSourcePath}
          runTerminalLine={runTerminalLine}
          applyTerminalSuggest={applyTerminalSuggest}
          appendTerminalToken={appendTerminalToken}
          terminalHistory={terminalHistory}
          copyTerminalOutputLine={copyTerminalOutputLine}
          terminalHintsSearchFieldId={terminalHintsSearchFieldId}
          terminalHintFilter={terminalHintFilter}
          setTerminalHintFilter={setTerminalHintFilter}
          visibleTerminalHints={visibleTerminalHints}
          onOpenTerminalKnowledge={() => {
            setKnowledgeInitialSlug(KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS)
            setKnowledgeOpen(true)
          }}
        />
      ) : (
        <main
          id="workspace-panel-downloads"
          role="tabpanel"
          aria-labelledby="workspace-tab-downloads"
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
          className="app-main app-downloads-workspace"
        >
          <DownloadsWorkspaceMain
            downloadsOptionsBusy={downloadsOptionsBusy}
            downloadsHistoryBusy={downloadsHistoryBusy}
            downloadsUrl={downloadsUrl}
            setDownloadsUrl={setDownloadsUrl}
            downloadsMainUrlFieldId={downloadsMainUrlFieldId}
            onAddToQueue={() => {
              void handleAddDownloadsFromMain()
            }}
            downloadsNarrowLayout={downloadsNarrowLayout}
            onScrollToSettings={() => {
              downloadsSettingsRailRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
            }}
            downloadsStats={downloadsStats}
            downloadsStatusFilter={downloadsStatusFilter}
            setDownloadsStatusFilter={setDownloadsStatusFilter}
            downloadsStatusFilterChips={downloadsStatusFilterChips}
            downloadsRows={downloadsRows}
            visibleDownloadsRows={visibleDownloadsRows}
            setStatusHint={setStatusHint}
            onBatchAddDownloadsDone={(rowIds) => {
              void handleBatchAddDownloadsDone(rowIds)
            }}
            onSelectDownloadsTab={() => {
              setWorkspaceTab('downloads')
            }}
            downloadsEmbeddedHistoryOpen={downloadsEmbeddedHistoryOpen}
            persistDownloadsEmbeddedHistoryOpen={persistDownloadsEmbeddedHistoryOpen}
            visibleDownloadsHistory={visibleDownloadsHistory}
            downloadsHistoryCount={downloadsHistory.length}
            downloadsHistoryOutcomeFilter={downloadsHistoryOutcomeFilter}
            setDownloadsHistoryOutcomeFilter={setDownloadsHistoryOutcomeFilter}
            downloadsHistoryWeeklySummary={
              downloadsHistoryWeeklySummary ?? {
                since: 0,
                until: 0,
                total: 0,
                success: 0,
                error: 0,
                cancelled: 0
              }
            }
            refreshDownloadsHistory={refreshDownloadsHistory}
            setDownloadsHistory={setDownloadsHistory}
            exportVisibleDownloadsHistory={exportVisibleDownloadsHistory}
            downloadsEmbeddedLogOpen={downloadsEmbeddedLogOpen}
            persistDownloadsEmbeddedLogOpen={persistDownloadsEmbeddedLogOpen}
            downloadsLogTargetRowId={downloadsLogTargetRowId}
            downloadsLogLines={downloadsLogLines}
            setDownloadsLogLines={setDownloadsLogLines}
            setDownloadsLogTargetRowId={setDownloadsLogTargetRowId}
          />
          <DownloadsSettingsRail
            ref={downloadsSettingsRailRef}
            downloadsOptionsBusy={downloadsOptionsBusy}
            downloadsHistoryBusy={downloadsHistoryBusy}
            downloadsOptions={downloadsOptions}
            setDownloadsOptions={setDownloadsOptions}
            downloadsRailPanels={downloadsRailPanels}
            onRailSectionToggle={handleDownloadsRailSectionToggle}
            applyDownloadsOptionsPatch={applyDownloadsOptionsPatch}
            downloadsOutputDirectory={downloadsOutputDirectory}
            setDownloadsOutputDirectory={setDownloadsOutputDirectory}
            refreshDownloadsOutputDirectory={refreshDownloadsOutputDirectory}
            setStatusHint={setStatusHint}
            downloadsExpertHintFilter={downloadsExpertHintFilter}
            setDownloadsExpertHintFilter={setDownloadsExpertHintFilter}
            ytdlpCommandHintsFilteredByCategory={ytdlpCommandHintsFilteredByCategory}
            appendDownloadsExtraArgsToken={appendDownloadsExtraArgsToken}
            refreshDownloadsOptions={refreshDownloadsOptions}
          />
        </main>
      )}

      <footer
        className="app-statusbar"
        aria-label={uiText('appStatusbarAria')}
        aria-busy={appChromeBusy}
      >
        <div
          role="group"
          aria-label={uiText('statusbarEnginesClusterAria')}
          className="app-statusbar-cluster"
          aria-busy={engineDownloadBusy || engineSummary === 'checking'}
        >
          <span>{engineSummaryText(engineSummary)}</span>
          {engineVersionsLine ? (
            <>
              <span className="app-statusbar-sep" aria-hidden />
              <span className="app-statusbar-engines" title={engineVersionsLine}>
                {engineVersionsLine}
              </span>
            </>
          ) : null}
        </div>
        {workspaceTab === 'editor' ? (
          <div
            role="group"
            aria-label={uiText('statusbarExportCodecClusterAria')}
            className="app-statusbar-cluster"
            aria-busy={
              exportBusy || snapshotBusy || exportCancelBusy || probePending || batchExportBusy
            }
          >
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-codec" title={exportCodecStatusbarLabel}>
              {exportCodecStatusbarLabel}
            </span>
          </div>
        ) : null}
        {statusHint ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-extra" role="status" aria-live="polite">
              {statusHint}
            </span>
          </>
        ) : null}
        <span className="app-statusbar-sep" aria-hidden />
        <Versions statusBusy={engineDownloadBusy || engineSummary === 'checking'} />
      </footer>

      <AboutDialog
        open={aboutOpen}
        aboutInfo={aboutInfo}
        onClose={() => {
          setAboutOpen(false)
        }}
        onDiagnosticStatus={(message) => {
          setStatusHint(message)
        }}
        onOpenKnowledgeArticle={(slug) => {
          setAboutOpen(false)
          setKnowledgeInitialSlug(slug)
          setKnowledgeOpen(true)
        }}
      />

      <KnowledgeDialog
        open={knowledgeOpen}
        initialSlug={knowledgeInitialSlug}
        localeVersion={uiLocaleRenderTick}
        onClose={() => {
          setKnowledgeOpen(false)
          setKnowledgeInitialSlug(null)
        }}
        onStatus={(message) => {
          setStatusHint(message)
        }}
      />

      {exportPresetNameDialog ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (exportPresetSaving) {
              return
            }
            if (e.target === e.currentTarget) {
              setExportPresetNameDialog(null)
            }
          }}
        >
          <form
            className="app-modal app-modal-narrow"
            role="dialog"
            aria-modal="true"
            aria-busy={exportPresetSaving}
            aria-labelledby="export-preset-name-title"
            aria-describedby="export-preset-name-hint"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            onSubmit={(e) => {
              e.preventDefault()
              void handleSubmitExportPresetName()
            }}
          >
            <h2 id="export-preset-name-title" className="app-modal-title">
              {exportPresetNameDialog.mode === 'create'
                ? uiText('editorExportPresetDialogTitleCreate')
                : uiText('editorExportPresetDialogTitleRename')}
            </h2>
            <p id="export-preset-name-hint" className="app-modal-hint">
              {uiText('editorExportPresetDialogHint')}
            </p>
            <div
              role="group"
              aria-label={uiText('exportPresetNameFieldGroupAria')}
              aria-busy={exportPresetSaving}
            >
              <label className="app-engine-path-row">
                <span className="app-engine-path-label">
                  {uiText('editorExportPresetNameLabel')}
                </span>
                <input
                  className="app-engine-path-input"
                  type="text"
                  maxLength={64}
                  autoFocus
                  disabled={exportPresetSaving}
                  value={exportPresetNameDialog.value}
                  aria-invalid={exportPresetNameDialog.error !== null}
                  aria-describedby={
                    exportPresetNameDialog.error
                      ? 'export-preset-name-hint export-preset-name-error'
                      : 'export-preset-name-hint'
                  }
                  onChange={(e) => {
                    setExportPresetNameDialog((prev) =>
                      prev === null ? null : { ...prev, value: e.target.value, error: null }
                    )
                  }}
                />
              </label>
            </div>
            {exportPresetNameDialog.error ? (
              <p
                id="export-preset-name-error"
                className="app-modal-hint app-modal-error"
                role="alert"
              >
                {exportPresetNameDialog.error}
              </p>
            ) : null}
            <div
              className="app-modal-footer"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('exportPresetDialogFooterToolbarAria')}
              aria-busy={exportPresetSaving}
            >
              <button
                type="button"
                className="app-btn"
                disabled={exportPresetSaving}
                onClick={() => {
                  setExportPresetNameDialog(null)
                }}
              >
                {uiText('appDialogCancel')}
              </button>
              <button
                type="submit"
                className="app-btn app-btn-primary"
                disabled={exportPresetSaving}
              >
                {uiText('appDialogSave')}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {enginePathsOpen ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (enginePathsSaving) {
              return
            }
            if (e.target === e.currentTarget) {
              setEnginePathsOpen(false)
            }
          }}
        >
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-busy={enginePathsSaving}
            aria-labelledby="engine-paths-title"
            aria-describedby="engine-paths-hint"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <h2 id="engine-paths-title" className="app-modal-title">
              {uiText('editorEnginePathsDialogTitle')}
            </h2>
            <p id="engine-paths-hint" className="app-modal-hint">
              {uiText('editorEnginePathsDialogHint')}
            </p>
            <div
              className="app-engine-path-rows"
              role="group"
              aria-label={uiText('enginePathsDialogRowsGroupAria')}
              aria-busy={enginePathsSaving}
            >
              {ENGINE_IDS.map((id) => (
                <div key={id} className="app-engine-path-row">
                  <label className="app-engine-path-label" htmlFor={`engine-path-${id}`}>
                    {engineLabel(id)}
                  </label>
                  <input
                    id={`engine-path-${id}`}
                    className="app-engine-path-input"
                    type="text"
                    spellCheck={false}
                    disabled={enginePathsSaving}
                    placeholder={uiText('editorEnginePathPlaceholderAuto')}
                    value={enginePathsDraft[id]}
                    onChange={(e) => {
                      setEnginePathsDraft((prev) => ({ ...prev, [id]: e.target.value }))
                    }}
                  />
                  <div
                    className="app-engine-path-actions"
                    role="toolbar"
                    aria-orientation="horizontal"
                    aria-label={uiTextVars('editorEnginePathRowToolbarAriaTemplate', {
                      engine: engineLabel(id)
                    })}
                    aria-busy={enginePathsSaving}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={enginePathsSaving}
                      onClick={() => {
                        void handlePickEngine(id)
                      }}
                    >
                      {uiText('editorEnginePathBrowse')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={enginePathsSaving}
                      onClick={() => {
                        setEnginePathsDraft((prev) => ({ ...prev, [id]: '' }))
                      }}
                    >
                      {uiText('editorEnginePathClear')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="app-modal-footer"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('enginePathsDialogFooterToolbarAria')}
              aria-busy={enginePathsSaving}
            >
              <button
                type="button"
                className="app-btn app-btn-danger"
                disabled={engineDownloadBusy || enginePathsSaving}
                title={uiText('editorEnginePathsRemoveDownloadedTooltip')}
                onClick={() => {
                  void handleClearDownloadedEngines()
                }}
              >
                {uiText('editorEnginePathsRemoveDownloaded')}
              </button>
              <button
                type="button"
                className="app-btn"
                disabled={enginePathsSaving}
                onClick={() => {
                  setEnginePathsOpen(false)
                }}
              >
                {uiText('appDialogCancel')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-primary"
                disabled={enginePathsSaving}
                onClick={() => {
                  void handleSaveEnginePaths()
                }}
              >
                {uiText('appDialogSave')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
