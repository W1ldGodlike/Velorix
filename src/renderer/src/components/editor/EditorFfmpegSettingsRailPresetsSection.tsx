import { isBuiltinExportUserPresetId } from '../../../../shared/builtin-ffmpeg-export-user-presets'
import { uiText } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function EditorFfmpegSettingsRailPresetsSection(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    editorFfmpegDetailBusy,
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
    <details
      className="app-settings-section"
      aria-label={uiText('editorFfmpegSectionPresets')}
      aria-describedby="editor-ffmpeg-settings-hint"
      aria-busy={editorFfmpegDetailBusy}
      open={panelOpen('ffmpegPresets')}
      onToggle={(e) => {
        persistMainWindowUiPanelToggle('ffmpegPresets', e.currentTarget.open)
      }}
    >
      <summary
        className="app-settings-summary"
        title={uiText('editorTooltipSectionPresets')}
        aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
      >
        {uiText('editorFfmpegSectionPresets')}
      </summary>
      <p id="ffmpegPresetsSectionHint" className="app-settings-section-hint">
        {uiText('editorFfmpegSectionPresetsHint')}
      </p>
      <div
        className="app-settings-stack"
        aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
      >
        <label
          className="app-field"
          title={
            selectedExportUserPreset?.hint?.trim() ||
            uiText('editorTooltipUserPresetSelectFallback')
          }
        >
          <span>{uiText('editorFieldUserPreset')}</span>
          <select
            className="app-control"
            aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
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
              void window.fluxalloy.settings
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
          aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
          aria-busy={exportBusy || snapshotBusy || probePending}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={exportBusy || snapshotBusy}
            aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
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
            aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
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
            aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
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
            aria-describedby="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
            title={uiText('editorTooltipPresetDelete')}
            onClick={() => {
              handleDeleteExportUserPreset()
            }}
          >
            {uiText('editorPresetDelete')}
          </button>
        </div>
      </div>
    </details>
  )
}
