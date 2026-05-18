import type { Dispatch, JSX, SetStateAction } from 'react'

import { ENGINE_IDS, type EngineId } from '../../../../shared/engine-contract'
import { engineLabel, type EnginePathsDraft } from '../../app-engines-ui'
import { uiText, uiTextVars } from '../../locales/ui-text'

export type EnginePathsSettingsSectionProps = {
  sectionId: string
  enginePathsSaving: boolean
  engineDownloadBusy: boolean
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  onPickEngine: (id: EngineId) => void
  onClearDownloadedEngines: () => void
  onCheckEngineUpdates: () => void
  onSave: () => void
}

export function EnginePathsSettingsSection(props: EnginePathsSettingsSectionProps): JSX.Element {
  const {
    sectionId,
    enginePathsSaving,
    engineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    onPickEngine,
    onClearDownloadedEngines,
    onCheckEngineUpdates,
    onSave
  } = props

  const hintId = `${sectionId}-hint`

  return (
    <>
      <p id={hintId} className="app-modal-hint">
        {uiText('editorEnginePathsDialogHint')}
      </p>
      <div
        className="app-engine-path-rows"
        role="group"
        aria-label={uiText('enginePathsDialogRowsGroupAria')}
        aria-describedby={hintId}
        aria-busy={enginePathsSaving}
      >
        {ENGINE_IDS.map((id) => (
          <EnginePathRow
            key={id}
            hintId={hintId}
            id={id}
            enginePathsSaving={enginePathsSaving}
            enginePathsDraft={enginePathsDraft}
            setEnginePathsDraft={setEnginePathsDraft}
            onPickEngine={onPickEngine}
          />
        ))}
      </div>
      <div
        className="app-settings-dialog-section-footer"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('enginePathsDialogFooterToolbarAria')}
        aria-describedby={hintId}
        aria-busy={enginePathsSaving}
      >
        <button
          type="button"
          className="app-btn app-btn-compact"
          aria-describedby={hintId}
          disabled={engineDownloadBusy || enginePathsSaving}
          title={uiText('settingsEnginesCheckUpdatesTooltip')}
          onClick={() => {
            onCheckEngineUpdates()
          }}
        >
          {uiText('settingsEnginesCheckUpdatesButton')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-danger"
          aria-describedby={hintId}
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
          className="app-btn app-btn-primary"
          aria-describedby={hintId}
          title={uiText('appDialogSave')}
          disabled={enginePathsSaving}
          onClick={() => {
            onSave()
          }}
        >
          {uiText('appDialogSave')}
        </button>
      </div>
    </>
  )
}

function EnginePathRow(props: {
  hintId: string
  id: EngineId
  enginePathsSaving: boolean
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  onPickEngine: (id: EngineId) => void
}): JSX.Element {
  const { hintId, id, enginePathsSaving, enginePathsDraft, setEnginePathsDraft, onPickEngine } = props
  return (
    <div className="app-engine-path-row">
      <label className="app-engine-path-label" htmlFor={`${hintId}-engine-path-${id}`}>
        {engineLabel(id)}
      </label>
      <input
        id={`${hintId}-engine-path-${id}`}
        className="app-engine-path-input"
        type="text"
        spellCheck={false}
        disabled={enginePathsSaving}
        aria-describedby={hintId}
        placeholder={uiText('editorEnginePathPlaceholderAuto')}
        value={enginePathsDraft[id]}
        onChange={(e) => {
          setEnginePathsDraft((prev) => ({ ...prev, [id]: e.target.value }))
        }}
      />
      <EnginePathRowToolbar
        hintId={hintId}
        id={id}
        enginePathsSaving={enginePathsSaving}
        setEnginePathsDraft={setEnginePathsDraft}
        onPickEngine={onPickEngine}
      />
    </div>
  )
}

function EnginePathRowToolbar(props: {
  hintId: string
  id: EngineId
  enginePathsSaving: boolean
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  onPickEngine: (id: EngineId) => void
}): JSX.Element {
  const { hintId, id, enginePathsSaving, setEnginePathsDraft, onPickEngine } = props
  return (
    <div
      className="app-engine-path-actions"
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={uiTextVars('editorEnginePathRowToolbarAriaTemplate', {
        engine: engineLabel(id)
      })}
      aria-describedby={hintId}
      aria-busy={enginePathsSaving}
    >
      <button
        type="button"
        className="app-btn app-btn-compact"
        disabled={enginePathsSaving}
        aria-describedby={hintId}
        title={uiText('editorEnginePathBrowse')}
        onClick={() => {
          onPickEngine(id)
        }}
      >
        {uiText('editorEnginePathBrowse')}
      </button>
      <button
        type="button"
        className="app-btn app-btn-compact"
        aria-describedby={hintId}
        title={uiText('editorEnginePathClear')}
        disabled={enginePathsSaving}
        onClick={() => {
          setEnginePathsDraft((prev) => ({ ...prev, [id]: '' }))
        }}
      >
        {uiText('editorEnginePathClear')}
      </button>
    </div>
  )
}
