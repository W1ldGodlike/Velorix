import { useCallback, useEffect, useState } from 'react'
import type { JSX } from 'react'

import type { AppAboutInfo } from '../../shared/about-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { MainWindowUiPanelState, ResolvedAppTheme } from '../../shared/settings-contract'
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import { AboutDialog } from './components/AboutDialog'
import {
  IconCircleHelp,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconMoon,
  IconRefreshCw,
  IconSun
} from './components/LucideMiniIcons'
import { PreviewProbeBody, type PreviewProbeSectionKey } from './components/MediaProbePanel'
import Versions from './components/Versions'
import {
  applyPersistedUiLocale,
  miniIconTitle,
  setUiLocaleForSession,
  getUiLocale,
  uiText,
  uiTextVars
} from './locales/ui-text'

type ProbeInspectorUiState = {
  probeExportSummary: boolean
  probeTracks: boolean
  probeChapters: boolean
  probeRawJson: boolean
}

const PROBE_UI_DEFAULTS: ProbeInspectorUiState = {
  probeExportSummary: false,
  probeTracks: false,
  probeChapters: false,
  probeRawJson: false
}

function probePanelsFromSettings(m?: MainWindowUiPanelState): ProbeInspectorUiState {
  return {
    probeExportSummary: m?.probeExportSummary === true,
    probeTracks: m?.probeTracks === true,
    probeChapters: m?.probeChapters === true,
    probeRawJson: m?.probeRawJson === true
  }
}

/**
 * §9 / §363 — отдельное окно инспектора ffprobe.
 * Загружается через `index.html#inspector` тем же бандлом и preload, что и главное окно.
 */
export function InspectorStandaloneApp(): JSX.Element {
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
  const [probeUiPanels, setProbeUiPanels] = useState<ProbeInspectorUiState>(PROBE_UI_DEFAULTS)
  const [, setUiLocaleRenderTick] = useState(0)

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
    const next: DownloadsWindowUiLocale = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
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
      setProbePending(false)
      return
    }
    setProbePending(true)
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

  async function toggleTheme(): Promise<void> {
    const s = await window.fluxalloy.settings.get()
    if (s.theme === 'system') {
      void window.fluxalloy.settings.setTheme(s.effectiveTheme === 'dark' ? 'light' : 'dark')
    } else {
      void window.fluxalloy.settings.setTheme(s.theme === 'dark' ? 'light' : 'dark')
    }
  }

  async function handleOpenFolderDialog(): Promise<void> {
    const result = await window.fluxalloy.preview.openVideoFolderDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      setMediaPath(result.path)
      setStatusHint(result.name)
    } else if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
      setStatusHint(result.error)
    }
  }

  async function handleOpenDialog(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      setMediaPath(result.path)
      setStatusHint(result.name)
    }
  }

  async function handleDrop(files: FileList | null): Promise<void> {
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
  }

  return (
    <div className="app-shell" aria-label={uiText('inspectorStandaloneShellAria')}>
      <header className="app-topbar" aria-label={uiText('inspectorStandaloneTopbarAria')}>
        <div
          className="app-topbar-brand inspector-toolbar-brand"
          aria-label={uiText('inspectorStandaloneBrandAria')}
        >
          <span className="app-topbar-mark inspector-topbar-mark-icon" aria-hidden>
            <IconFilm title="" size={13} />
          </span>
          <span className="app-topbar-title">{uiText('inspectorStandaloneHeaderTitle')}</span>
          <span className="app-topbar-version">
            {uiText('inspectorStandaloneTopbarEngineLabel')}
          </span>
        </div>
        <div
          className="inspector-topbar-trailing"
          role="group"
          aria-label={uiText('inspectorTopbarTrailingGroupAria')}
          aria-busy={probePending && mediaPath !== null}
        >
          <div className="inspector-topbar-spacer" aria-hidden />
          <div
            className="app-topbar-actions"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('inspectorTopbarActionsToolbarAria')}
            aria-busy={probePending && mediaPath !== null}
          >
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              void handleOpenFolderDialog()
            }}
            title={uiText('topbarOpenVideoFolderTitle')}
          >
            <IconFolder />
            <span className="app-visually-hidden">{uiText('topbarOpenVideoFolderLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-icon-btn-primary"
            onClick={() => {
              void handleOpenDialog()
            }}
            title={uiText('inspectorStandaloneOpenPickTitle')}
          >
            <IconFolderOpen title={miniIconTitle('miniIconFolderOpenEllipsis')} />
            <span className="app-visually-hidden">
              {uiText('inspectorStandaloneOpenVisuallyHidden')}
            </span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            disabled={!mediaPath}
            onClick={() => {
              setProbeRefreshNonce((n) => n + 1)
            }}
            title={
              !mediaPath
                ? uiText('inspectorStandaloneFfprobeRefreshDisabledTitle')
                : uiText('inspectorStandaloneFfprobeRefreshTitle')
            }
          >
            <IconRefreshCw
              title={
                !mediaPath
                  ? uiText('inspectorStandaloneFfprobeRefreshDisabledTitle')
                  : uiText('inspectorStandaloneFfprobeRefreshTitle')
              }
            />
            <span className="app-visually-hidden">
              {uiText('inspectorStandaloneFfprobeRefreshVisuallyHidden')}
            </span>
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
            title={uiText('inspectorStandaloneAboutDiagnosticsTitle')}
          >
            <IconCircleHelp />
            <span className="app-visually-hidden">{uiText('aboutTitle')}</span>
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
            onClick={() => {
              void toggleTheme()
            }}
            title={uiText('inspectorStandaloneThemeToggleTitle')}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span className="app-visually-hidden">
              {theme === 'dark' ? miniIconTitle('miniIconSun') : miniIconTitle('miniIconMoon')}
            </span>
          </button>
        </div>
        </div>
      </header>

      <main
        className="app-main inspector-standalone-main"
        aria-label={uiText('inspectorStandaloneMainAria')}
        aria-busy={probePending}
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onDrop={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void handleDrop(event.dataTransfer.files)
        }}
      >
        {!mediaPath ? (
          <div role="region" aria-label={uiText('inspectorStandaloneEmptyRegionAria')} aria-busy={probePending}>
            <p className="inspector-standalone-hint">{uiText('inspectorStandaloneEmptyHint')}</p>
          </div>
        ) : null}
        {displayedProbeError ? (
          <p className="app-preview-probe-error" role="alert">
            {displayedProbeError}
          </p>
        ) : null}
        {displayedProbeInfo ? (
          <div
            className="app-preview-probe inspector-standalone-probe"
            aria-live="polite"
            role="region"
            aria-label={uiText('inspectorStandaloneProbeStackAria')}
            aria-busy={probePending && mediaPath !== null}
          >
            <PreviewProbeBody
              probeInfo={displayedProbeInfo}
              probeRefreshing={probePending && mediaPath !== null}
              probeSectionOpen={{
                exportSummary: probeUiPanels.probeExportSummary,
                tracks: probeUiPanels.probeTracks,
                chapters: probeUiPanels.probeChapters,
                rawJson: probeUiPanels.probeRawJson
              }}
              onProbeSectionToggle={persistProbeSection}
              {...(typeof mediaPath === 'string' && mediaPath.length > 0
                ? { mediaPathForDefaultSave: mediaPath }
                : {})}
            />
          </div>
        ) : null}
        {mediaPath ? (
          <footer
            className="inspector-standalone-path"
            title={mediaPath}
            aria-label={uiText('inspectorStandalonePathFooterAria')}
            aria-busy={probePending}
          >
            {mediaPath}
          </footer>
        ) : null}
      </main>

      <footer className="app-statusbar" aria-label={uiText('appStatusbarAria')}>
        {statusHint ? (
          <span className="app-statusbar-extra" role="status" aria-live="polite">
            {statusHint}
          </span>
        ) : null}
        {statusHint ? <span className="app-statusbar-sep" aria-hidden /> : null}
        <Versions />
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
      />
    </div>
  )
}
