import './assets/base.css'
import './assets/main.css'

import { StrictMode, type JSX } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DownloadsStandaloneApp } from './DownloadsStandaloneApp'
import { InspectorStandaloneApp } from './InspectorStandaloneApp'
import { uiText } from './locales/ui-text'
import { useAppShellStore } from './stores/app-shell-store'
import { isDownloadsStandaloneSurface, isInspectorStandaloneSurface } from './renderer-surface'

// Renderer bootstrap intentionally small.
// Здесь только React и CSS: вся работа с Electron/FS/процессами идёт через preload API,
// чтобы точка входа UI не превращалась в скрытый слой бизнес-логики.

/**
 * §18 — глобальные перехватчики ошибок renderer'a в общий main.log.
 * Молча тонут только если preload по какой-то причине не подключился.
 */
function safeLog(level: 'info' | 'warn' | 'error', scope: string, message: string): void {
  try {
    window.velorix?.log?.send?.({ level, scope, message })
  } catch {
    /* preload недоступен — нечего делать в renderer */
  }
}

function describeError(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    return `${err.message}\n${err.stack ?? ''}`
  }
  if (typeof err === 'string') {
    return err
  }
  if (err === undefined || err === null) {
    return fallback
  }
  try {
    return JSON.stringify(err)
  } catch {
    return fallback
  }
}

function reportRendererFault(scope: string, message: string): void {
  safeLog('error', scope, message)
  try {
    const shell = useAppShellStore.getState()
    shell.setLastRendererError(message)
    const short = message.trim().split(/\r?\n/)[0]?.slice(0, 240) ?? message.slice(0, 240)
    shell.setStatusHint(short || uiText('rendererLogWindowErrorFallback'))
  } catch {
    /* store ещё не инициализирован (редкий ранний сбой) */
  }
}

window.addEventListener('error', (event) => {
  reportRendererFault(
    'window.error',
    describeError(event.error, event.message || uiText('rendererLogWindowErrorFallback'))
  )
})

window.addEventListener('unhandledrejection', (event) => {
  reportRendererFault(
    'window.unhandledrejection',
    describeError(event.reason, uiText('rendererLogUnhandledRejectionFallback'))
  )
})

const rootEl = document.getElementById('root')!
function renderSurfaceApp(): JSX.Element {
  if (isInspectorStandaloneSurface()) {
    return <InspectorStandaloneApp />
  }
  if (isDownloadsStandaloneSurface()) {
    return <DownloadsStandaloneApp />
  }
  return <App />
}

createRoot(rootEl).render(<StrictMode>{renderSurfaceApp()}</StrictMode>)
