import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL } from '../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../stores/app-shell-store'

/** ref.23 — критический сбой main/renderer (`onProcessErrorReported`). */
export function CriticalCrashModalBody(): JSX.Element {
  const payload = useAppShellStore((s) => s.processErrorDialog)

  if (payload == null) {
    return (
      <div className="app-modal__body">
        <p className="app-modal__body--error">Приложение не может продолжить работу.</p>
        <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL}</p>
      </div>
    )
  }

  return (
    <div className="app-modal__body app-modal__body--stack">
      <p className="app-modal__body--error">{payload.message}</p>
      <pre className="app-modal__stack" aria-label="Подробности сбоя">
        {payload.detail}
      </pre>
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL}</p>
    </div>
  )
}
