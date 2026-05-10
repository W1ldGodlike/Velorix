import { useCallback, useEffect, useState } from 'react'
import type { JSX } from 'react'

import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import { PreviewProbeBody } from './components/MediaProbePanel'
import Versions from './components/Versions'

/**
 * §9 / §363 — отдельное окно инспектора ffprobe.
 * Загружается через `index.html#inspector` тем же бандлом и preload, что и главное окно.
 */
export function InspectorStandaloneApp(): JSX.Element {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mediaPath, setMediaPath] = useState<string | null>(null)
  /** Сброс кэша React при повторном ffprobe того же файла («Обновить ffprobe»). */
  const [probeRefreshNonce, setProbeRefreshNonce] = useState(0)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probeError, setProbeError] = useState<string | null>(null)
  const [statusHint, setStatusHint] = useState<string | null>(null)

  const applyTheme = useCallback((value: 'dark' | 'light') => {
    document.documentElement.dataset['theme'] = value
    setTheme(value)
  }, [])

  useEffect(() => {
    document.title = 'FluxAlloy — инспектор'
    let cleanupTheme: (() => void) | undefined
    void window.fluxalloy.settings
      .get()
      .then((loaded) => {
        applyTheme(loaded.theme === 'light' ? 'light' : 'dark')
        cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
          applyTheme(next === 'light' ? 'light' : 'dark')
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
      return
    }
    let cancelled = false
    void window.fluxalloy.preview.probe(mediaPath).then((r) => {
      if (cancelled) {
        return
      }
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

  function toggleTheme(): void {
    const next = theme === 'dark' ? 'light' : 'dark'
    void window.fluxalloy.settings.setTheme(next)
  }

  async function handleOpenDialog(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog()
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
      setStatusHint(`DnD: ${granted.error}`)
      return
    }
    setMediaPath(granted.path)
    setStatusHint(granted.name)
  }

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="app-toolbar-brand">Инспектор</div>
        <button
          type="button"
          className="app-btn app-btn-primary"
          onClick={() => {
            void handleOpenDialog()
          }}
          title="Выбрать локальный медиафайл (тот же allowlist, что и превью)"
        >
          Открыть…
        </button>
        <button
          type="button"
          className="app-btn"
          disabled={!mediaPath}
          onClick={() => {
            setProbeRefreshNonce((n) => n + 1)
          }}
          title="Повторно запустить ffprobe для текущего файла"
        >
          Обновить ffprobe
        </button>
        <div className="app-toolbar-spacer" aria-hidden />
        <button
          type="button"
          className="app-btn"
          onClick={toggleTheme}
          title="Переключить тему (синхронно с главным окном)"
        >
          Тема
        </button>
      </header>

      <main
        className="app-main inspector-standalone-main"
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
          <p className="inspector-standalone-hint">
            Перетащите видеофайл сюда или нажмите «Открыть…». При запуске из меню подставляется
            последний файл из превью (если он ещё на диске).
          </p>
        ) : null}
        {displayedProbeError ? (
          <p className="app-preview-probe-error" role="alert">
            {displayedProbeError}
          </p>
        ) : null}
        {displayedProbeInfo ? (
          <div className="app-preview-probe inspector-standalone-probe" aria-live="polite">
            <PreviewProbeBody
              probeInfo={displayedProbeInfo}
              {...(typeof mediaPath === 'string' && mediaPath.length > 0
                ? { mediaPathForDefaultSave: mediaPath }
                : {})}
            />
          </div>
        ) : null}
        {mediaPath ? (
          <footer className="inspector-standalone-path" title={mediaPath}>
            {mediaPath}
          </footer>
        ) : null}
      </main>

      <footer className="app-statusbar">
        {statusHint ? <span className="app-statusbar-extra">{statusHint}</span> : null}
        {statusHint ? <span className="app-statusbar-sep" aria-hidden /> : null}
        <Versions />
      </footer>
    </div>
  )
}
