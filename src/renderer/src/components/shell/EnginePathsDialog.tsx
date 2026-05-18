import type { Dispatch, JSX, SetStateAction } from 'react'

import type { EngineId } from '../../../../shared/engine-contract'
import type { EnginePathsDraft } from '../../app-engines-ui'
import { uiText } from '../../locales/ui-text'
import { EnginePathsSettingsSection } from './EnginePathsSettingsSection'

export type EnginePathsDialogProps = {
  open: boolean
  enginePathsSaving: boolean
  engineDownloadBusy: boolean
  enginePathsDraft: EnginePathsDraft
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  onClose: () => void
  onPickEngine: (id: EngineId) => void
  onClearDownloadedEngines: () => void
  onCheckEngineUpdates: () => void
  onSave: () => void
}

/** Узкий диалог путей движков (legacy); меню открывает вкладку в `AppSettingsDialog`. */
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
    onCheckEngineUpdates,
    onSave
  } = props

  if (!open) {
    return null
  }

  return (
    <MotionPathsDialogBackdrop enginePathsSaving={enginePathsSaving} onClose={onClose}>
      <MotionPathsDialogPanel
        enginePathsSaving={enginePathsSaving}
        engineDownloadBusy={engineDownloadBusy}
        enginePathsDraft={enginePathsDraft}
        setEnginePathsDraft={setEnginePathsDraft}
        onPickEngine={onPickEngine}
        onClearDownloadedEngines={onClearDownloadedEngines}
        onCheckEngineUpdates={onCheckEngineUpdates}
        onSave={onSave}
        onClose={onClose}
      />
    </MotionPathsDialogBackdrop>
  )
}

function MotionPathsDialogBackdrop(props: {
  enginePathsSaving: boolean
  onClose: () => void
  children: JSX.Element
}): JSX.Element {
  const { enginePathsSaving, onClose, children } = props
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
      {children}
    </div>
  )
}

function MotionPathsDialogPanel(props: Omit<EnginePathsDialogProps, 'open'>): JSX.Element {
  const {
    enginePathsSaving,
    engineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    onPickEngine,
    onClearDownloadedEngines,
    onCheckEngineUpdates,
    onSave,
    onClose
  } = props

  return (
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
      <EnginePathsSettingsSection
        sectionId="engine-paths"
        enginePathsSaving={enginePathsSaving}
        engineDownloadBusy={engineDownloadBusy}
        enginePathsDraft={enginePathsDraft}
        setEnginePathsDraft={setEnginePathsDraft}
        onPickEngine={onPickEngine}
        onClearDownloadedEngines={onClearDownloadedEngines}
        onCheckEngineUpdates={onCheckEngineUpdates}
        onSave={onSave}
      />
      <MotionPathsDialogFooter enginePathsSaving={enginePathsSaving} onClose={onClose} />
    </div>
  )
}

function MotionPathsDialogFooter(props: {
  enginePathsSaving: boolean
  onClose: () => void
}): JSX.Element {
  const { enginePathsSaving, onClose } = props
  return (
    <div className="app-modal-footer">
      <button
        type="button"
        className="app-btn"
        aria-describedby="engine-paths-hint"
        title={uiText('appDialogCancel')}
        disabled={enginePathsSaving}
        onClick={() => {
          onClose()
        }}
      >
        {uiText('appDialogCancel')}
      </button>
    </div>
  )
}
