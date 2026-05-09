import { useCallback, useEffect, useState } from 'react'

import Versions from './components/Versions'

type Theme = 'dark' | 'light'

/** Совпадает с `Extract<PreviewDialogResult,{ok:true}>` в preload-контракте §4/§7. */
interface PreviewOpenedPayload {
  path: string
  mediaUrl: string
  name: string
}
type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'

/**
 * Сводит подробные статусы движков к одной строке для нижнего статусбара.
 *
 * Подробности (пути, версии, ошибки по каждому бинарнику) позже уйдут в окно настроек
 * зависимостей. Статусбар должен оставаться компактным и показывать только состояние,
 * требующее внимания пользователя.
 */
function summarizeEngines(
  engines: Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>['engines']
): EngineSummary {
  const states = Object.values(engines).map((engine) => engine.state)

  if (states.includes('error')) {
    return 'error'
  }
  if (states.includes('missing')) {
    return 'missing'
  }
  return 'ready'
}

function engineSummaryText(summary: EngineSummary): string {
  switch (summary) {
    case 'ready':
      return 'Движки: готовы'
    case 'missing':
      return 'Движки: не найдены'
    case 'error':
      return 'Движки: ошибка проверки'
    case 'checking':
      return 'Движки: проверка…'
  }
}

function App(): React.JSX.Element {
  const [theme, setTheme] = useState<Theme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  /** Подстрочное сообщение статусбара: прогресс загрузки движков, ошибки DnD и т.п. */
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewOpenedPayload | null>(null)

  const applyPreview = useCallback((payload: PreviewOpenedPayload): void => {
    setPreview(payload)
  }, [])

  const applyTheme = useCallback((value: Theme) => {
    document.documentElement.dataset.theme = value
    setTheme(value)
  }, [])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      applyTheme(loaded.theme === 'light' ? 'light' : 'dark')
      cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
    })().catch(console.error)

    return (): void => {
      cleanupTheme?.()
    }
  }, [applyTheme])

  useEffect(() => {
    void window.fluxalloy.engines
      .getStatus()
      .then((snapshot) => {
        setEngineSummary(summarizeEngines(snapshot.engines))
      })
      .catch(() => {
        setEngineSummary('error')
      })
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

    const offMenuPreview = window.fluxalloy.onPreviewOpened((payload) => {
      applyPreview(payload)
    })

    return (): void => {
      offProgress()
      offMenuPreview()
    }
  }, [applyPreview])

  function toggleTheme(): void {
    const next = theme === 'dark' ? 'light' : 'dark'
    void window.fluxalloy.settings.setTheme(next)
  }

  async function handleOpenToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog()
    if (result.ok) {
      applyPreview(result)
    }
  }

  async function handleEnginesDownload(): Promise<void> {
    setEngineDownloadBusy(true)
    setStatusHint('Подготовка загрузки…')
    try {
      const res = await window.fluxalloy.engines.download()
      if (!res.ok) {
        setStatusHint(`Ошибка: ${res.error}`)
        return
      }

      const snapshot = await window.fluxalloy.engines.getStatus()
      setEngineSummary(summarizeEngines(snapshot.engines))

      const need = await window.fluxalloy.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
      setStatusHint('Движки загружены')
    } catch (error) {
      setStatusHint(error instanceof Error ? error.message : 'Ошибка загрузки')
    } finally {
      setEngineDownloadBusy(false)
    }
  }

  async function handlePreviewDrop(files: FileList | null): Promise<void> {
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
    applyPreview(granted)
  }

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="app-toolbar-brand">FluxAlloy</div>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void handleOpenToolbar()
          }}
          title="Открыть локальный видеофайл"
        >
          Открыть
        </button>
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled
          title="Старт экспорта (скоро)"
        >
          Экспорт
        </button>
        {enginesOfferDownload ? (
          <button
            type="button"
            className="app-btn app-btn-warn"
            disabled={engineDownloadBusy}
            onClick={() => {
              void handleEnginesDownload()
            }}
            title="Скачать yt-dlp и FFmpeg в папку приложения пользователя"
          >
            {engineDownloadBusy ? 'Загрузка…' : 'Скачать движки'}
          </button>
        ) : null}
        <div className="app-toolbar-spacer" aria-hidden />
        <button
          type="button"
          className="app-btn"
          onClick={toggleTheme}
          title="Переключить тёмную/светлую тему"
        >
          Тема: {theme === 'dark' ? 'тёмная' : 'светлая'}
        </button>
      </header>

      <main className="app-main">
        <section
          className="app-preview"
          aria-label="Область предпросмотра"
          onDragOver={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onDrop={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void handlePreviewDrop(event.dataTransfer.files)
          }}
        >
          {preview ? (
            <>
              <video
                key={preview.mediaUrl}
                className="app-preview-video"
                controls
                src={preview.mediaUrl}
              />
              <footer className="app-preview-caption" title={preview.path}>
                {preview.name}
              </footer>
            </>
          ) : (
            <div className="app-preview-placeholder">
              Нет источника — перетащите видеофайл сюда или «Открыть…» в меню «Файл» / кнопка
              сверху.
              <p className="app-preview-hint">
                Локальный файл стримится через защищённую схему fluxmedia — только после выбора или
                DnD по пути из Electron.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-statusbar">
        <span>{engineSummaryText(engineSummary)}</span>
        {statusHint ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-extra">{statusHint}</span>
          </>
        ) : null}
        <span className="app-statusbar-sep" aria-hidden />
        <Versions />
      </footer>
    </div>
  )
}

export default App
