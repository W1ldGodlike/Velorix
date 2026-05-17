import type { Dispatch, JSX, SetStateAction } from 'react'

import type { ExportPresetNameDialogState } from '../../use-editor-export-settings'
import { uiText } from '../../locales/ui-text'

export type ExportPresetNameDialogProps = {
  dialog: ExportPresetNameDialogState
  exportPresetSaving: boolean
  setDialog: Dispatch<SetStateAction<ExportPresetNameDialogState>>
  onSubmit: () => void
}

export function ExportPresetNameDialog(props: ExportPresetNameDialogProps): JSX.Element | null {
  const { dialog, exportPresetSaving, setDialog, onSubmit } = props
  if (!dialog) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (exportPresetSaving) {
          return
        }
        if (e.target === e.currentTarget) {
          setDialog(null)
        }
      }}
    >
      <form
        className="app-modal app-modal-narrow"
        role="dialog"
        aria-modal="true"
        aria-busy={exportPresetSaving}
        aria-labelledby="export-preset-name-title"
        aria-describedby="export-preset-name-hint"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onSubmit={(e) => {
          e.preventDefault()
          void onSubmit()
        }}
      >
        <h2 id="export-preset-name-title" className="app-modal-title">
          {dialog.mode === 'create'
            ? uiText('editorExportPresetDialogTitleCreate')
            : uiText('editorExportPresetDialogTitleRename')}
        </h2>
        <p id="export-preset-name-hint" className="app-modal-hint">
          {uiText('editorExportPresetDialogHint')}
        </p>
        <div
          role="group"
          aria-label={uiText('exportPresetNameFieldGroupAria')}
          aria-describedby="export-preset-name-hint"
          aria-busy={exportPresetSaving}
        >
          <label className="app-engine-path-row">
            <span className="app-engine-path-label">{uiText('editorExportPresetNameLabel')}</span>
            <input
              className="app-engine-path-input"
              type="text"
              maxLength={64}
              autoFocus
              disabled={exportPresetSaving}
              value={dialog.value}
              aria-invalid={dialog.error !== null}
              aria-describedby={
                dialog.error
                  ? 'export-preset-name-hint export-preset-name-error'
                  : 'export-preset-name-hint'
              }
              onChange={(e) => {
                setDialog((prev) =>
                  prev === null ? null : { ...prev, value: e.target.value, error: null }
                )
              }}
            />
          </label>
        </div>
        {dialog.error ? (
          <p id="export-preset-name-error" className="app-modal-hint app-modal-error" role="alert">
            {dialog.error}
          </p>
        ) : null}
        <div
          className="app-modal-footer"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('exportPresetDialogFooterToolbarAria')}
          aria-describedby="export-preset-name-hint"
          aria-busy={exportPresetSaving}
        >
          <button
            type="button"
            className="app-btn"
            aria-describedby="export-preset-name-hint"
            disabled={exportPresetSaving}
            onClick={() => {
              setDialog(null)
            }}
          >
            {uiText('appDialogCancel')}
          </button>
          <button
            type="submit"
            className="app-btn app-btn-primary"
            aria-describedby="export-preset-name-hint"
            disabled={exportPresetSaving}
          >
            {uiText('appDialogSave')}
          </button>
        </div>
      </form>
    </div>
  )
}
