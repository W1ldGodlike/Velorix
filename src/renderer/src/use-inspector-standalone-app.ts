import { useCallback, useEffect, useState } from 'react'

import type { AppAboutInfo } from '../../shared/about-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { PreviewProbeSectionKey } from './components/MediaProbePanel'
import {
  applyPersistedUiLocale,
  getUiLocale,
  setUiLocaleForSession,
  syncDocumentUiLocale,
  uiText,
  uiTextVars
} from './locales/ui-text'
import { useUiTextHotReloadBump } from './locales/use-ui-text-hot-reload-bump'
import { PROBE_UI_DEFAULTS, probePanelsFromSettings } from './inspector-standalone-probe-ui'
import type { InspectorStandaloneAppModel } from './use-inspector-standalone-app-model'

export function useInspectorStandaloneApp(): InspectorStandaloneAppModel {
  const [theme, setTheme] = useState<ResolvedAppTheme>('dark')
  const [mediaPath, setMediaPath] = useState<string | null>(null)
  /** Сброс кэша React при повторном ffprobe того же файла («Обновить ffprobe»). */
  const [probeRefreshNonce, setProbeRefreshNonce] = useState(0)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probePending, setProbePending] = useState(false)
  const [probeError, setProbeError] = useState<string | null>(null)
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutInfo, setAboutInfo] = useState<AppAboutInfo | null>(null)
  const [probeUiPanels, setProbeUiPanels] = useState(PROBE_UI_DEFAULTS)
  const [, setUiLocaleRenderTick] = useState(0)

  useUiTextHotReloadBump()

  const applyTheme = useCallback((value: ResolvedAppTheme) => {
    document.documentElement.dataset['theme'] = value
    setTheme(value)
  }, [])

  const persistProbeSection = useCallback((key: PreviewProbeSectionKey, open: boolean) => {
    const map = {
      exportSummary: 'probeExportSummary',
      tracks: 'probeTracks',
      chapters: 'probeChapters',
      rawJson: 'probeRawJson'
    } as const
    const sk = map[key]
    void window.fluxalloy.settings
      .mergeMainWindowUiPanels({ [sk]: open })
      .then((s) => {
        setProbeUiPanels(probePanelsFromSettings(s.mainWindowUiPanels))
      })
      .catch(console.error)
  }, [])

  const handleUiLocaleToggle = useCallback((): void => {
    const next: AppUiLocale = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        syncDocumentUiLocale(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      syncDocumentUiLocale(loc)
      setUiLocaleRenderTick((n) => n + 1)
    })
    return off
  }, [])

  useEffect(() => {
    document.title = uiText('inspectorWindowDocumentTitle')
    let cleanupTheme: (() => void) | undefined
    let cleanupUiPanels: (() => void) | undefined
    void window.fluxalloy.settings
      .get()
      .then((loaded) => {
        const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
        syncDocumentUiLocale(resolved)
        setUiLocaleRenderTick((n) => n + 1)
        if (shouldPersist) {
          void window.fluxalloy.settings.setUiLocale(resolved)
        }
        document.title = uiText('inspectorWindowDocumentTitle')
        applyTheme(loaded.effectiveTheme)
        setProbeUiPanels(probePanelsFromSettings(loaded.mainWindowUiPanels))
        cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
          applyTheme(next)
        })
        cleanupUiPanels = window.fluxalloy.onMainWindowUiPanelsChanged((panels) => {
          setProbeUiPanels(probePanelsFromSettings(panels))
        })
      })
      .catch(console.error)

    void window.fluxalloy.inspector.bootstrap().then(({ initialMediaPath }) => {
      if (initialMediaPath && initialMediaPath.length > 0) {
        setMediaPath(initialMediaPath)
      }
    })

    return (): void => {
      cleanupTheme?.()
      cleanupUiPanels?.()
    }
  }, [applyTheme])

  useEffect(() => {
    const off = window.fluxalloy.inspector.onTargetMediaPath((abs) => {
      setMediaPath(abs)
    })
    return off
  }, [])

  useEffect(() => {
    if (!mediaPath) {
      queueMicrotask(() => setProbePending(false))
      return
    }
    queueMicrotask(() => setProbePending(true))
    let cancelled = false
    void window.fluxalloy.preview.probe(mediaPath).then((r) => {
      if (cancelled) {
        return
      }
      setProbePending(false)
      if (r.ok) {
        setProbeInfo(r)
        setProbeError(null)
      } else {
        setProbeInfo(null)
        setProbeError(r.error)
      }
    })
    return (): void => {
      cancelled = true
    }
  }, [mediaPath, probeRefreshNonce])

  const displayedProbeInfo = mediaPath ? probeInfo : null
  const displayedProbeError = mediaPath ? probeError : null

  const toggleTheme = useCallback(async (): Promise<void> => {
    const s = await window.fluxalloy.settings.get()
    if (s.theme === 'system') {
      void window.fluxalloy.settings.setTheme(s.effectiveTheme === 'dark' ? 'light' : 'dark')
    } else {
      void window.fluxalloy.settings.setTheme(s.theme === 'dark' ? 'light' : 'dark')
    }
  }, [])

  const handleOpenFolderDialog = useCallback(async (): Promise<void> => {
    const result = await window.fluxalloy.preview.openVideoFolderDialog(
      getUiLocale() as AppUiLocale
    )
    if (result.ok) {
      setMediaPath(result.path)
      setStatusHint(result.name)
    } else if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
      setStatusHint(result.error)
    }
  }, [])

  const handleOpenDialog = useCallback(async (): Promise<void> => {
    const result = await window.fluxalloy.preview.openFileDialog(getUiLocale() as AppUiLocale)
    if (result.ok) {
      setMediaPath(result.path)
      setStatusHint(result.name)
    }
  }, [])

  const handleDrop = useCallback(async (files: FileList | null): Promise<void> => {
    const file = files?.[0]
    if (!file) {
      return
    }
    const absolutePath = window.fluxalloy.preview.getPathForFile(file)
    const granted = await window.fluxalloy.preview.grantPath(absolutePath)
    if (!granted.ok) {
      setStatusHint(uiTextVars('statusDndGrantFailed', { error: granted.error }))
      return
    }
    setMediaPath(granted.path)
    setStatusHint(granted.name)
  }, [])

  const openAboutDialog = useCallback((): void => {
    void window.fluxalloy.about.getInfo().then((info) => {
      setAboutInfo(info)
      setAboutOpen(true)
    })
  }, [])

  return {
    theme,
    mediaPath,
    probePending,
    probeUiPanels,
    statusHint,
    setStatusHint,
    aboutOpen,
    setAboutOpen,
    aboutInfo,
    displayedProbeInfo,
    displayedProbeError,
    persistProbeSection,
    handleUiLocaleToggle,
    toggleTheme,
    handleOpenFolderDialog,
    handleOpenDialog,
    handleDrop,
    setProbeRefreshNonce,
    openAboutDialog
  }
}

export type { InspectorStandaloneAppModel } from './use-inspector-standalone-app-model'
