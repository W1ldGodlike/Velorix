import type { Dispatch, JSX, SetStateAction } from 'react'

import type { FfmpegExportUserPreset } from '../../../shared/ffmpeg-export-contract'
import { isBuiltinExportUserPresetId } from '../../../shared/builtin-ffmpeg-export-user-presets'
import type { AppSettings } from '../../../shared/settings-contract'
import { uiText } from '../locales/ui-text'

export type ExportPresetManagerPanelProps = {
  describedById: string
  exportBusy: boolean
  snapshotBusy: boolean
  probePending: boolean
  exportUserPresets: FfmpegExportUserPreset[]
  selectedUserPresetId: string | null
  setSelectedUserPresetId: Dispatch<SetStateAction<string | null>>
  selectedExportUserPreset: FfmpegExportUserPreset | undefined
  hydrateExportFieldsFromSettings: (loaded: AppSettings) => void
  handleSaveExportUserPreset: () => void
  handleDeleteExportUserPreset: () => void
  handleRenameExportUserPreset: () => void
  handleOverwriteExportUserPreset: () => void
}

export function ExportPresetManagerPanel(props: ExportPresetManagerPanelProps): JSX.Element {
  const {
    describedById,
    exportBusy,
    snapshotBusy,
    probePending,
    exportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    selectedExportUserPreset,
    hydrateExportFieldsFromSettings,
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleOverwriteExportUserPreset
  } = props

  return (
    <div className="app-settings-stack" aria-describedby={describedById}>
      <label
        className="app-field"
        title={
          selectedExportUserPreset?.hint?.trim() || uiText('editorTooltipUserPresetSelectFallback')
        }
      >
        <span>{uiText('editorFieldUserPreset')}</span>
        <select
          className="app-control"
          aria-describedby={describedById}
          title={
            selectedExportUserPreset?.hint?.trim() ||
            uiText('editorTooltipUserPresetSelectFallback')
          }
          value={selectedUserPresetId ?? ''}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') {
              setSelectedUserPresetId(null)
              return
            }
            const preset = exportUserPresets.find((p) => p.id === v)
            if (!preset) {
              return
            }
            void window.velorix.settings
              .applyFfmpegExportSnapshot(preset.snapshot)
              .then((s) => {
                hydrateExportFieldsFromSettings(s)
                setSelectedUserPresetId(v)
              })
              .catch(console.error)
          }}
        >
          <option value="">{uiText('editorUserPresetPlaceholder')}</option>
          {exportUserPresets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <div
        className="app-settings-actions"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('editorExportPresetsActionsToolbarAria')}
        aria-describedby={describedById}
        aria-busy={exportBusy || snapshotBusy || probePending}
      >
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={exportBusy || snapshotBusy}
          aria-describedby={describedById}
          title={uiText('editorTooltipPresetAdd')}
          onClick={() => {
            handleSaveExportUserPreset()
          }}
        >
          {uiText('editorPresetAdd')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={
            exportBusy ||
            snapshotBusy ||
            !selectedUserPresetId ||
            (selectedUserPresetId != null && isBuiltinExportUserPresetId(selectedUserPresetId))
          }
          aria-describedby={describedById}
          title={uiText('editorTooltipPresetRename')}
          onClick={() => {
            handleRenameExportUserPreset()
          }}
        >
          {uiText('editorPresetRename')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={
            exportBusy ||
            snapshotBusy ||
            !selectedUserPresetId ||
            (selectedUserPresetId != null && isBuiltinExportUserPresetId(selectedUserPresetId))
          }
          aria-describedby={describedById}
          title={uiText('editorTooltipPresetOverwrite')}
          onClick={() => {
            handleOverwriteExportUserPreset()
          }}
        >
          {uiText('editorPresetOverwrite')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={
            exportBusy ||
            snapshotBusy ||
            !selectedUserPresetId ||
            (selectedUserPresetId != null && isBuiltinExportUserPresetId(selectedUserPresetId))
          }
          aria-describedby={describedById}
          title={uiText('editorTooltipPresetDelete')}
          onClick={() => {
            handleDeleteExportUserPreset()
          }}
        >
          {uiText('editorPresetDelete')}
        </button>
      </div>
    </div>
  )
}
