import './assets/base.css'
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { InspectorStandaloneApp } from './InspectorStandaloneApp'

// Renderer bootstrap intentionally small.
// Здесь только React и CSS: вся работа с Electron/FS/процессами идёт через preload API,
// чтобы точка входа UI не превращалась в скрытый слой бизнес-логики.

/**
 * §18 — глобальные перехватчики ошибок renderer'a в общий main.log.
 * Молча тонут только если preload по какой-то причине не подключился.
 */
function safeLog(level: 'info' | 'warn' | 'error', scope: string, message: string): void {
  try {
    window.fluxalloy?.log?.send?.({ level, scope, message })
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

window.addEventListener('error', (event) => {
  safeLog(
    'error',
    'window.error',
    describeError(event.error, event.message || 'unknown window error')
  )
})

window.addEventListener('unhandledrejection', (event) => {
  safeLog('error', 'window.unhandledrejection', describeError(event.reason, 'unknown rejection'))
})

const rootEl = document.getElementById('root')!
const isInspectorSurface =
  typeof window !== 'undefined' && window.location.hash.replace(/^#\/?/, '') === 'inspector'

createRoot(rootEl).render(
  <StrictMode>{isInspectorSurface ? <InspectorStandaloneApp /> : <App />}</StrictMode>
)
