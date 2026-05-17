import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { JSX, SyntheticEvent } from 'react'

import { AppShellLayout } from './components/shell/AppShellLayout'
import {
  applyPersistedUiLocale,
  setUiLocaleForSession,
  getUiLocale,
  uiText,
  uiTextVars
} from './locales/ui-text'
import type { EngineId } from '../../shared/engine-contract'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import {
  useDownloadsWindowUiPanels,
  type DownloadsRailPanelKey
} from './use-downloads-window-ui-panels'
import { useMainWindowUiPanels } from './use-main-window-ui-panels'
import { useEditorExportSettings } from './use-editor-export-settings'
import { useEditorExportPipeline } from './use-editor-export-pipeline'
import { useAppWorkspaceMainProps } from './use-app-workspace-main-props'
import { useAppShellLayoutProps } from './use-app-shell-layout-props'
import { useAppProcessingHistory } from './use-app-processing-history'
import { useFfmpegExportBatch } from './use-ffmpeg-export-batch'
import { useTerminalWorkspace } from './use-terminal-workspace'
import { useDownloadsUrlActions } from './use-downloads-url-actions'
import { useDownloadsWorkspace } from './use-downloads-workspace'
import {
  type EnginePathsDraft,
  type EngineSummary,
  formatEngineVersionsLine,
  summarizeEngines
} from './app-engines-ui'
import {
  clipboardLooksLikeDownloadsPayload,
  domTargetIsTextField,
  previewVideoMediaErrorDetailLabel
} from './app-shell-ui-helpers'
import type { WorkspaceTab } from './app-terminal-hint-ui'
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
  const {
    processingHistory,
    setProcessingHistory,
    processingHistoryBusy,
    processingHistoryFilter,
    processingHistoryWeeklySummary,
    setProcessingHistoryWeeklySummary,
    refreshProcessingHistory,
    applyProcessingHistoryFilter,
    exportVisibleProcessingHistory
  } = useAppProcessingHistory({ setStatusHint })
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

  const appWorkspaceMainProps = useAppWorkspaceMainProps({
    shell: {
      workspaceTab,
      panelOpen,
      persistMainWindowUiPanelToggle,
      downloadsSettingsRailRef
    },
    knowledge: {
      setKnowledgeInitialSlug,
      setKnowledgeOpen
    },
    busy: {
      engineDownloadBusy,
      exportBusy,
      snapshotBusy,
      probePending,
      exportCancelBusy,
      batchExportBusy,
      downloadsOptionsBusy,
      downloadsHistoryBusy
    },
    editorQuick: {
      downloadsUrl,
      setDownloadsUrl,
      editorUrlPasteBehavior,
      setEditorUrlPasteBehavior,
      handleQuickYtdlpEnqueueLines,
      handleDownloadFirstUrlOpenInEditor
    },
    editorBatch: {
      batchExportBusy,
      batchSnapshot,
      batchOutputSuffix,
      setBatchOutputSuffix,
      batchOutputDirectory,
      batchDragRowId,
      setBatchDragRowId,
      previewPath: preview?.path,
      setStatusHint,
      handleBatchDropFiles,
      handleBatchPickOutputFolder,
      handleBatchRevealSharedOutputFolder,
      handleBatchClearOutputDirectory,
      handleBatchPickFiles,
      handleBatchPickFolder,
      handleBatchAddCurrentPreview,
      handleBatchAddDownloadsDone,
      handleBatchStart,
      handleBatchCancel,
      handleBatchRetryFailed,
      handleBatchRetryFailedAndStart,
      handleBatchClearCompleted,
      handleBatchCopyInputPaths,
      handleBatchCopyOutputPaths,
      handleBatchSaveReport,
      handleBatchRemoveWaiting,
      handleBatchOpenOutput,
      handleBatchOpenInput,
      handleBatchCopyRowPath
    },
    editorPreview: {
      preview,
      previewPlaybackUrl,
      previewStackRef,
      videoRef,
      probeInfo,
      probePending,
      exportBusy,
      snapshotBusy,
      handlePreviewDrop,
      handlePreviewVideoLoaded,
      handlePreviewVideoError,
      onTrimRangeSnapshot,
      jumpToTrimExport,
      handleExport,
      handleSnapshot
    },
    editorFfmpeg: {
      setStatusHint,
      exportBusy,
      exportCancelBusy,
      snapshotBusy,
      probePending,
      exportEncodePreset,
      setExportEncodePreset,
      exportVideoCodec,
      setExportVideoCodec,
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
      selectedUserPresetId,
      setSelectedUserPresetId,
      selectedExportUserPreset,
      lastExportPath,
      lastSnapshotPath,
      snapshotFormat,
      setSnapshotFormat,
      ffmpegExportSelectOptions,
      exportExtraArgsParsed,
      hydrateExportFieldsFromSettings,
      bumpManualExportEdit,
      handleSaveExportUserPreset,
      handleDeleteExportUserPreset,
      handleRenameExportUserPreset,
      handleOverwriteExportUserPreset,
      exportPreview,
      exportPreviewCommand,
      exportPreviewHint,
      handleCopyExportPreview,
      handleOpenLastExport,
      handleCopyLastExportPath,
      handleOpenLastSnapshot,
      handleCopyLastSnapshotPath,
      processingHistory,
      setProcessingHistory,
      processingHistoryBusy,
      processingHistoryFilter,
      processingHistoryWeeklySummary,
      setProcessingHistoryWeeklySummary,
      applyProcessingHistoryFilter,
      refreshProcessingHistory,
      exportVisibleProcessingHistory,
      reportBatchPathsAdded,
      hwEncoderProbe
    },
    terminal: {
      terminalBusy,
      terminalLine,
      setTerminalLine,
      terminalCommandInputId,
      terminalInlineSuggestions,
      terminalSuggestFocus,
      setTerminalSuggestFocus,
      terminalSuggestActiveIndex,
      setTerminalSuggestIndex,
      terminalSuggestBlurTimeoutRef,
      currentSourcePath,
      runTerminalLine,
      applyTerminalSuggest,
      appendTerminalToken,
      terminalHistory,
      copyTerminalOutputLine,
      terminalHintsSearchFieldId,
      terminalHintFilter,
      setTerminalHintFilter,
      visibleTerminalHints
    },
    downloads: {
      main: {
        downloadsOptionsBusy,
        downloadsHistoryBusy,
        downloadsUrl,
        setDownloadsUrl,
        downloadsMainUrlFieldId,
        downloadsNarrowLayout,
        downloadsStats,
        downloadsStatusFilter,
        setDownloadsStatusFilter,
        downloadsStatusFilterChips,
        downloadsRows,
        visibleDownloadsRows,
        setStatusHint,
        downloadsEmbeddedHistoryOpen,
        persistDownloadsEmbeddedHistoryOpen,
        visibleDownloadsHistory,
        downloadsHistoryCount: downloadsHistory.length,
        downloadsHistoryOutcomeFilter,
        setDownloadsHistoryOutcomeFilter,
        downloadsHistoryWeeklySummary: downloadsHistoryWeeklySummary ?? {
          since: 0,
          until: 0,
          total: 0,
          success: 0,
          error: 0,
          cancelled: 0
        },
        refreshDownloadsHistory,
        setDownloadsHistory,
        exportVisibleDownloadsHistory,
        downloadsEmbeddedLogOpen,
        persistDownloadsEmbeddedLogOpen,
        downloadsLogTargetRowId,
        downloadsLogLines,
        setDownloadsLogLines,
        setDownloadsLogTargetRowId
      },
      settings: {
        downloadsOptionsBusy,
        downloadsHistoryBusy,
        downloadsOptions,
        setDownloadsOptions,
        downloadsRailPanels,
        onRailSectionToggle: handleDownloadsRailSectionToggle,
        applyDownloadsOptionsPatch,
        downloadsOutputDirectory,
        setDownloadsOutputDirectory,
        refreshDownloadsOutputDirectory,
        setStatusHint,
        downloadsExpertHintFilter,
        setDownloadsExpertHintFilter,
        ytdlpCommandHintsFilteredByCategory,
        appendDownloadsExtraArgsToken,
        refreshDownloadsOptions
      },
      setWorkspaceTab,
      handleAddDownloadsFromMain,
      handleBatchAddDownloadsDone
    }
  })
  const appShellLayoutProps = useAppShellLayoutProps({
    chromeBusy: {
      engineDownloadBusy,
      engineSummary,
      probePending,
      exportBusy,
      snapshotBusy,
      exportCancelBusy,
      terminalBusy,
      batchExportBusy,
      exportPresetSaving,
      enginePathsSaving,
      downloadsOptionsBusy,
      downloadsHistoryBusy
    },
    topbar: {
      workspaceTab,
      setWorkspaceTab,
      engineDownloadBusy,
      engineSummary,
      previewPath: preview?.path,
      exportBusy,
      exportCancelBusy,
      enginesOfferDownload,
      theme,
      setKnowledgeInitialSlug,
      setKnowledgeOpen,
      setAboutInfo,
      setAboutOpen,
      setEnginePathsOpen,
      handleOpenVideoFolderToolbar,
      handleOpenToolbar,
      handleCancelExport,
      handleEnginesDownload,
      handleUiLocaleToggle,
      toggleTheme
    },
    statusbar: {
      workspaceTab,
      engineDownloadBusy,
      engineSummary,
      engineVersionsLine,
      exportCodecStatusbarLabel,
      exportBusy,
      snapshotBusy,
      exportCancelBusy,
      probePending,
      batchExportBusy,
      statusHint
    },
    overlay: {
      aboutOpen,
      aboutInfo,
      setAboutOpen,
      knowledgeOpen,
      knowledgeInitialSlug,
      setKnowledgeOpen,
      setKnowledgeInitialSlug,
      uiLocaleRenderTick,
      onStatusHint: setStatusHint
    },
    exportPreset: {
      dialog: exportPresetNameDialog,
      exportPresetSaving,
      setDialog: setExportPresetNameDialog,
      handleSubmitExportPresetName
    },
    enginePaths: {
      enginePathsSaving,
      engineDownloadBusy,
      enginePathsDraft,
      setEnginePathsDraft,
      setEnginePathsOpen,
      handlePickEngine,
      handleClearDownloadedEngines,
      handleSaveEnginePaths
    }
  })

  return <AppShellLayout workspaceMain={appWorkspaceMainProps} {...appShellLayoutProps} />
}

export default App