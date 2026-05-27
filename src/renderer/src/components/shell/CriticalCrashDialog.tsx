import type { JSX } from 'react'

import type { ProcessErrorDialogPayload } from '../../../../shared/process-error-dialog-contract'
import { uiText, uiTextVars } from '../../locales/ui-text'

export function CriticalCrashDialog(props: {
  payload: ProcessErrorDialogPayload | null
  onClose: () => void
  onStatusHint: (message: string) => void
}): JSX.Element | null {
  const { payload, onClose, onStatusHint } = props
  if (!payload) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        className="app-modal app-modal-wide critical-crash-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="critical-crash-title"
        aria-describedby="critical-crash-message critical-crash-detail"
        onMouseDown={(event) => {
          event.stopPropagation()
        }}
      >
        <h2 id="critical-crash-title" className="app-modal-title">
          {payload.title}
        </h2>
        <p id="critical-crash-message" className="app-modal-hint">
          {payload.message}
        </p>
        <pre id="critical-crash-detail" className="critical-crash-dialog-detail">
          {payload.detail}
        </pre>
        <div
          className="app-modal-footer critical-crash-dialog-toolbar"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('criticalCrashToolbarAria')}
          aria-describedby="critical-crash-message"
        >
          <button
            type="button"
            className="app-btn"
            onClick={() => {
              void window.velorix.clipboard.writeText(payload.detail).then(() => {
                onStatusHint(uiText('criticalCrashCopied'))
              })
            }}
          >
            {payload.copyLabel}
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => {
              void window.velorix.diagnostics.openMainLog().then((result) => {
                if (!result.ok) {
                  onStatusHint(uiTextVars('aboutMainLogOpenErrorTemplate', { error: result.error }))
                }
              })
            }}
          >
            {payload.openLogLabel}
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => {
              void window.velorix.diagnostics.createSupportZip().then((result) => {
                if (result.ok) {
                  onStatusHint(uiText('supportZipSaved'))
                } else if ('error' in result) {
                  onStatusHint(
                    uiTextVars('aboutMaintenanceCleanErrorTemplate', {
                      label: payload.supportZipLabel,
                      error: result.error
                    })
                  )
                }
              })
            }}
          >
            {payload.supportZipLabel}
          </button>
          <button type="button" className="app-btn app-btn-primary" onClick={onClose}>
            {payload.closeLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
