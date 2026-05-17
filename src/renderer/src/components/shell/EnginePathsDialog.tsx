import type { Dispatch, JSX, SetStateAction } from 'react'

import { ENGINE_IDS, type EngineId } from '../../../../shared/engine-contract'
import { engineLabel, type EnginePathsDraft } from '../../app-engines-ui'
import { uiText, uiTextVars } from '../../locales/ui-text'

export type EnginePathsDialogProps = {
  open: boolean
  enginePathsSaving: boolean
  engineDownloadBusy: boolean
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  onClose: () => void
  onPickEngine: (id: EngineId) => void
  onClearDownloadedEngines: () => void
  onSave: () => void
}

export function EnginePathsDialog(props: EnginePathsDialogProps): JSX.Element | null {
  const {
    open,
    enginePathsSaving,
    engineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    onClose,
    onPickEngine,
    onClearDownloadedEngines,
    onSave
  } = props

  if (!open) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (enginePathsSaving) {
          return
        }
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal"
        role="dialog"
        aria-modal="true"
        aria-busy={enginePathsSaving}
        aria-labelledby="engine-paths-title"
        aria-describedby="engine-paths-hint"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <h2 id="engine-paths-title" className="app-modal-title">
          {uiText('editorEnginePathsDialogTitle')}
        </h2>
        <p id="engine-paths-hint" className="app-modal-hint">
          {uiText('editorEnginePathsDialogHint')}
        </p>
        <div
          className="app-engine-path-rows"
          role="group"
          aria-label={uiText('enginePathsDialogRowsGroupAria')}
          aria-describedby="engine-paths-hint"
          aria-busy={enginePathsSaving}
        >
          {ENGINE_IDS.map((id) => (
            <div key={id} className="app-engine-path-row">
              <label className="app-engine-path-label" htmlFor={`engine-path-${id}`}>
                {engineLabel(id)}
              </label>
              <input
                id={`engine-path-${id}`}
                className="app-engine-path-input"
                type="text"
                spellCheck={false}
                disabled={enginePathsSaving}
                aria-describedby="engine-paths-hint"
                placeholder={uiText('editorEnginePathPlaceholderAuto')}
                value={enginePathsDraft[id]}
                onChange={(e) => {
                  setEnginePathsDraft((prev) => ({ ...prev, [id]: e.target.value }))
                }}
              />
              <div
                className="app-engine-path-actions"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiTextVars('editorEnginePathRowToolbarAriaTemplate', {
                  engine: engineLabel(id)
                })}
                aria-describedby="engine-paths-hint"
                aria-busy={enginePathsSaving}
              >
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={enginePathsSaving}
                  aria-describedby="engine-paths-hint"
                  onClick={() => {
                    onPickEngine(id)
                  }}
                >
                  {uiText('editorEnginePathBrowse')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  aria-describedby="engine-paths-hint"
                  disabled={enginePathsSaving}
                  onClick={() => {
                    setEnginePathsDraft((prev) => ({ ...prev, [id]: '' }))
                  }}
                >
                  {uiText('editorEnginePathClear')}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          className="app-modal-footer"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('enginePathsDialogFooterToolbarAria')}
          aria-describedby="engine-paths-hint"
          aria-busy={enginePathsSaving}
        >
          <button
            type="button"
            className="app-btn app-btn-danger"
            aria-describedby="engine-paths-hint"
            disabled={engineDownloadBusy || enginePathsSaving}
            title={uiText('editorEnginePathsRemoveDownloadedTooltip')}
            onClick={() => {
              onClearDownloadedEngines()
            }}
          >
            {uiText('editorEnginePathsRemoveDownloaded')}
          </button>
          <button
            type="button"
            className="app-btn"
            aria-describedby="engine-paths-hint"
            disabled={enginePathsSaving}
            onClick={() => {
              onClose()
            }}
          >
            {uiText('appDialogCancel')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            aria-describedby="engine-paths-hint"
            disabled={enginePathsSaving}
            onClick={() => {
              onSave()
            }}
          >
            {uiText('appDialogSave')}
          </button>
        </div>
      </div>
    </div>
  )
}
