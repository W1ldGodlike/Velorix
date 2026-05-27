import type { JSX } from 'react'

import type { QuitConfirmRequestPayload } from '../../../../shared/quit-confirm-contract'
import { uiText, uiTextVars } from '../../locales/ui-text'

function getQuitMessage(request: QuitConfirmRequestPayload): string {
  if (request.mode === 'busy') {
    if (request.exportBusy && request.downloadsBusy) {
      return uiText('quitConfirmBoth')
    }
    if (request.exportBusy) {
      return uiText('quitConfirmExport')
    }
    return uiText('quitConfirmDownloads')
  }
  if (request.waitingCount > 0) {
    return uiTextVars('quitConfirmIdleWithQueue', { n: String(request.waitingCount) })
  }
  return uiText('quitConfirmIdle')
}

export function QuitConfirmDialog(props: {
  request: QuitConfirmRequestPayload | null
  onResolve: (confirmed: boolean) => void
}): JSX.Element | null {
  const { request, onResolve } = props
  if (!request) {
    return null
  }

  const confirmLabel = request.mode === 'busy' ? uiText('quitAbort') : uiText('quitYes')
  const cancelLabel = request.mode === 'busy' ? uiText('quitStay') : uiText('quitNo')

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onResolve(false)
        }
      }}
    >
      <section
        className="app-modal app-modal-narrow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quit-confirm-title"
        aria-describedby="quit-confirm-message"
        onMouseDown={(event) => {
          event.stopPropagation()
        }}
      >
        <h2 id="quit-confirm-title" className="app-modal-title">
          {uiText('quitDialogTitle')}
        </h2>
        <p id="quit-confirm-message" className="app-modal-hint">
          {getQuitMessage(request)}
        </p>
        <div
          className="app-modal-footer"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('quitConfirmToolbarAria')}
          aria-describedby="quit-confirm-message"
        >
          <button
            type="button"
            className="app-btn"
            onClick={() => {
              onResolve(false)
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => {
              onResolve(true)
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
