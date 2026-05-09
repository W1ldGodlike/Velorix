import { useCallback, useEffect, useState } from 'react'

import Versions from './components/Versions'

type Theme = 'dark' | 'light'
type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'

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

  const applyTheme = useCallback((value: Theme) => {
    document.documentElement.dataset.theme = value
    setTheme(value)
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    // Тема приходит из main: renderer не читает файлы настроек напрямую.
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      applyTheme(loaded.theme === 'light' ? 'light' : 'dark')
      cleanup = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
    })().catch(console.error)

    return (): void => {
      cleanup?.()
    }
  }, [applyTheme])

  useEffect(() => {
    // Статусбар пока показывает сводку. Подробное окно зависимостей появится в §3/§4.6.
    window.fluxalloy.engines
      .getStatus()
      .then((snapshot) => {
        setEngineSummary(summarizeEngines(snapshot.engines))
      })
      .catch(() => {
        setEngineSummary('error')
      })
  }, [])

  function toggleTheme(): void {
    const next = theme === 'dark' ? 'light' : 'dark'
    void window.fluxalloy.settings.setTheme(next)
  }

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="app-toolbar-brand">FluxAlloy</div>
        <button type="button" className="app-btn" disabled title="Открыть файл источника (скоро)">
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
        <section className="app-preview" aria-label="Область предпросмотра">
          <div className="app-preview-placeholder">
            Нет источника — перетащите видеофайл сюда или воспользуйтесь пунктом меню «Файл» →
            «Открыть…»
            <p className="app-preview-hint">
              Каркас главного окна по §1.1 ТЗ: превью и таймлайн — в следующих итерациях.
            </p>
          </div>
        </section>
      </main>

      <footer className="app-statusbar">
        <span>{engineSummaryText(engineSummary)}</span>
        <span className="app-statusbar-sep" aria-hidden />
        <Versions />
      </footer>
    </div>
  )
}

export default App
