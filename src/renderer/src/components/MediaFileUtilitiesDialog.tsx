import { useId, type JSX } from 'react'

import { uiText } from '../locales/ui-text'
import { MediaFileUtilitiesPanel } from './MediaFileUtilitiesPanel'

export type MediaFileUtilitiesDialogProps = {
  open: boolean
  onClose: () => void
  onStatus: (message: string) => void
}

export function MediaFileUtilitiesDialog(props: MediaFileUtilitiesDialogProps): JSX.Element | null {
  const { open, onClose, onStatus } = props
  const dialogHintId = useId()

  if (!open) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal app-modal-wide media-file-utilities-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogHintId}-title`}
        aria-describedby={dialogHintId}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="app-modal-header-row">
          <h2 id={`${dialogHintId}-title`} className="app-modal-title">
            {uiText('mediaUtilitiesTitle')}
          </h2>
          <button
            type="button"
            className="app-btn"
            title={uiText('closeButton')}
            aria-label={uiText('closeButton')}
            onClick={onClose}
          >
            {uiText('closeButton')}
          </button>
        </div>
        <div className="media-file-utilities-dialog-body">
          <MediaFileUtilitiesPanel describedById={dialogHintId} onStatus={onStatus} />
        </div>
      </div>
    </div>
  )
}
