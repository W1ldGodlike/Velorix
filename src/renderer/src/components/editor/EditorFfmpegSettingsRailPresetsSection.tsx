import type { JSX } from 'react'

import { ExportPresetManagerPanel } from '../ExportPresetManagerPanel'
import { uiText } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

export function EditorFfmpegSettingsRailPresetsSection(
  props: EditorFfmpegSettingsRailProps
): JSX.Element {
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
        <ExportPresetManagerPanel
          describedById="ffmpegPresetsSectionHint editor-ffmpeg-settings-hint"
          exportBusy={exportBusy}
          snapshotBusy={snapshotBusy}
          probePending={probePending}
          exportUserPresets={exportUserPresets}
          selectedUserPresetId={selectedUserPresetId}
          setSelectedUserPresetId={setSelectedUserPresetId}
          selectedExportUserPreset={selectedExportUserPreset}
          hydrateExportFieldsFromSettings={hydrateExportFieldsFromSettings}
          handleSaveExportUserPreset={handleSaveExportUserPreset}
          handleDeleteExportUserPreset={handleDeleteExportUserPreset}
          handleRenameExportUserPreset={handleRenameExportUserPreset}
          handleOverwriteExportUserPreset={handleOverwriteExportUserPreset}
        />
      </div>
    </details>
  )
}
