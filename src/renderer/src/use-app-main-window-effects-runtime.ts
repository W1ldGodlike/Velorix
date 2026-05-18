import { useEffect } from 'react'

import { useAppShellStore } from './stores/app-shell-store'
import { clipboardLooksLikeDownloadsPayload, domTargetIsTextField } from './app-shell-ui-helpers'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'
import type { UseAppMainWindowEffectsDeps } from './use-app-main-window-effects-deps'

export function useAppMainWindowEffectsRuntime(
  deps: UseAppMainWindowEffectsDeps,
  actions: { refreshEngineUi: () => Promise<void> }
): void {
  const {
    previewPath,
    previewMediaUrl,
    setPreviewBlobUrl,
    setProbeInfo,
    setProbePending,
    setStatusHint,
    engineSummary,
    appSettingsOpen,
    appSettingsSection,
    setEnginePathsDraft,
    setAppSettingsOpen,
    setAppSettingsSection,
    setExternalFilterScriptOpen,
    setWorkflowPlannerOpen,
    setWorkflowScenarioBuilderOpen,
    setAboutInfo,
    setAboutOpen,
    editorUrlPasteBehavior,
    setWorkspaceTab,
    setDownloadsUrl,
    setDownloadsNarrowLayout,
    setEnginesOfferDownload,
    applyPreview
  } = deps
  const { refreshEngineUi } = actions

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
    const probeGeneration = useAppShellStore.getState().bumpPreviewProbeGeneration()
    const ac = new AbortController()
    queueMicrotask(() => setProbePending(true))
    void window.fluxalloy.preview.probe(previewPath).then((r) => {
      if (ac.signal.aborted) {
        return
      }
      if (useAppShellStore.getState().previewProbeGeneration !== probeGeneration) {
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
      ac.abort()
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
    if (!appSettingsOpen || appSettingsSection !== 'dependencies') {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      setEnginePathsDraft({
        ffmpeg: s.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: s.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': s.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [appSettingsOpen, appSettingsSection, setEnginePathsDraft])

  useEffect(() => {
    const offEnginePaths = window.fluxalloy.onOpenEnginePaths(() => {
      setAppSettingsSection('dependencies')
      setAppSettingsOpen(true)
    })
    const offSettings = window.fluxalloy.onOpenSettings((sec) => {
      setAppSettingsSection(sec)
      setAppSettingsOpen(true)
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
    const offExternalFilter = window.fluxalloy.onOpenExternalFilterScript(() => {
      setExternalFilterScriptOpen(true)
    })
    const offWorkflowPlanner = window.fluxalloy.onOpenWorkflowPlanner(() => {
      setWorkflowPlannerOpen(true)
    })
    const offWorkflowScenarioBuilder = window.fluxalloy.onOpenWorkflowScenarioBuilder(() => {
      setWorkflowScenarioBuilderOpen(true)
    })
    return (): void => {
      offEnginePaths()
      offSettings()
      offSynced()
      offAbout()
      offExternalFilter()
      offWorkflowPlanner()
      offWorkflowScenarioBuilder()
    }
  }, [
    refreshEngineUi,
    setAboutInfo,
    setAboutOpen,
    setAppSettingsOpen,
    setAppSettingsSection,
    setExternalFilterScriptOpen,
    setWorkflowPlannerOpen,
    setWorkflowScenarioBuilderOpen
  ])

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
}
