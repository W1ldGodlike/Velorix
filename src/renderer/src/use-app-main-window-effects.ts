import {
  useCallback,
  useEffect,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction
} from 'react'

import {
  type EnginePathsDraft,
  type EngineSummary,
  formatEngineVersionsLine,
  summarizeEngines
} from './app-engines-ui'
import { clipboardLooksLikeDownloadsPayload, domTargetIsTextField } from './app-shell-ui-helpers'
import type { WorkspaceTab } from './app-terminal-hint-ui'
import {
  applyPersistedUiLocale,
  getUiLocale,
  setUiLocaleForSession,
  uiText,
  uiTextVars
} from './locales/ui-text'
import type { EditorUrlPasteBehaviorId } from '../../shared/editor-url-paste-behavior'
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import type { FfmpegExportUserPreset } from '../../shared/ffmpeg-export-contract'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type {
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  ResolvedAppTheme
} from '../../shared/settings-contract'
import type { DownloadsQueueRowView } from './downloads-queue-view'
import { sanitizeDownloadsRows } from './downloads-queue-view'

type PreviewOpenedPayload = RestoredSourceInfo

export type UseAppMainWindowEffectsDeps = {
  trimSnapshotRef: MutableRefObject<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>
  currentSourcePath: string | null
  setDownloadsRows: Dispatch<SetStateAction<DownloadsQueueRowView[]>>
  setTheme: Dispatch<SetStateAction<ResolvedAppTheme>>
  setUiLocaleRenderTick: Dispatch<SetStateAction<number>>
  hydrateExportFieldsFromSettings: (
    loaded: Awaited<ReturnType<typeof window.fluxalloy.settings.get>>
  ) => void
  hydrateMainWindowUiPanels: (patch: MainWindowUiPanelState | null | undefined) => void
  hydrateDownloadsWindowUiPanels: (patch: DownloadsWindowUiPanelState | null | undefined) => void
  setExportUserPresets: Dispatch<SetStateAction<FfmpegExportUserPreset[]>>
  setSnapshotFormat: Dispatch<SetStateAction<FfmpegSnapshotFormatId>>
  refetchHwEncoders: () => Promise<void>
  applyPreview: (payload: PreviewOpenedPayload) => void
  previewPath: string | null
  previewMediaUrl: string | undefined
  setPreviewBlobUrl: Dispatch<SetStateAction<string | null>>
  setProbeInfo: Dispatch<SetStateAction<MediaProbeSuccess | null>>
  setProbePending: Dispatch<SetStateAction<boolean>>
  setStatusHint: Dispatch<SetStateAction<string | null>>
  setEngineSummary: Dispatch<SetStateAction<EngineSummary>>
  setEngineVersionsLine: Dispatch<SetStateAction<string>>
  setEnginesOfferDownload: Dispatch<SetStateAction<boolean>>
  engineSummary: EngineSummary
  enginePathsOpen: boolean
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  setEnginePathsOpen: Dispatch<SetStateAction<boolean>>
  setAboutInfo: Dispatch<
    SetStateAction<Awaited<ReturnType<typeof window.fluxalloy.about.getInfo>> | null>
  >
  setAboutOpen: Dispatch<SetStateAction<boolean>>
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  setDownloadsUrl: Dispatch<SetStateAction<string>>
  setDownloadsNarrowLayout: Dispatch<SetStateAction<boolean>>
}

export function useAppMainWindowEffects(deps: UseAppMainWindowEffectsDeps): {
  refreshEngineUi: () => Promise<void>
} {
  const {
    trimSnapshotRef,
    currentSourcePath,
    setDownloadsRows,
    setTheme,
    setUiLocaleRenderTick,
    hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels,
    hydrateDownloadsWindowUiPanels,
    setExportUserPresets,
    setSnapshotFormat,
    refetchHwEncoders,
    applyPreview,
    previewPath,
    previewMediaUrl,
    setPreviewBlobUrl,
    setProbeInfo,
    setProbePending,
    setStatusHint,
    setEngineSummary,
    setEngineVersionsLine,
    setEnginesOfferDownload,
    engineSummary,
    enginePathsOpen,
    setEnginePathsDraft,
    setEnginePathsOpen,
    setAboutInfo,
    setAboutOpen,
    editorUrlPasteBehavior,
    setWorkspaceTab,
    setDownloadsUrl,
    setDownloadsNarrowLayout
  } = deps

  const applyTheme = useCallback(
    (value: ResolvedAppTheme) => {
      document.documentElement.dataset['theme'] = value
      setTheme(value)
    },
    [setTheme]
  )

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
  }, [refetchHwEncoders, setEngineSummary, setEngineVersionsLine, setEnginesOfferDownload])

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
    hydrateMainWindowUiPanels,
    setExportUserPresets,
    setSnapshotFormat,
    setUiLocaleRenderTick
  ])

  useEffect(() => {
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      setUiLocaleRenderTick((n) => n + 1)
    })
    return off
  }, [setUiLocaleRenderTick])

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
  }, [previewMediaUrl, setPreviewBlobUrl])

  useEffect(() => {
    if (!previewPath) {
      queueMicrotask(() => setProbePending(false))
      return
    }
    queueMicrotask(() => setProbePending(true))
    let cancelled = false
    void window.fluxalloy.preview.probe(previewPath).then((r) => {
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
  }, [previewPath, setProbeInfo, setProbePending, setStatusHint])

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
  }, [enginePathsOpen, setEnginePathsDraft])

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
  }, [refreshEngineUi, setAboutInfo, setAboutOpen, setEnginePathsOpen])

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
  }, [editorUrlPasteBehavior, setDownloadsUrl, setStatusHint, setWorkspaceTab])

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

  useEffect(() => {
    void window.fluxalloy.engines
      .shouldOfferDownload()
      .then(setEnginesOfferDownload)
      .catch(() => setEnginesOfferDownload(false))
  }, [engineSummary, setEnginesOfferDownload])

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
  }, [applyPreview, setStatusHint])

  return { refreshEngineUi }
}
