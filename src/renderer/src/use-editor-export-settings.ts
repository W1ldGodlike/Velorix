import type { FfmpegExportSelectOptions } from './editor-export-select-options'
import { useEditorExportSettingsState } from './use-editor-export-settings-state'
import { useEditorExportUserPresetActions } from './use-editor-export-user-preset-actions'

export type { ExportPresetNameDialogState } from './editor-export-settings-types'
export type { FfmpegExportSelectOptions }

export type UseEditorExportSettingsDeps = {
  setStatusHint: (hint: string | null) => void
}

// Return shape is consumed via destructuring in App.tsx (large flat API).
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat export-settings surface
export function useEditorExportSettings(deps: UseEditorExportSettingsDeps) {
  const { setStatusHint } = deps
  const state = useEditorExportSettingsState()

  const {
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleSubmitExportPresetName,
    handleOverwriteExportUserPreset
  } = useEditorExportUserPresetActions({
    setStatusHint,
    exportUserPresets: state.exportUserPresets,
    setExportUserPresets: state.setExportUserPresets,
    selectedUserPresetId: state.selectedUserPresetId,
    setSelectedUserPresetId: state.setSelectedUserPresetId,
    exportPresetNameDialog: state.exportPresetNameDialog,
    setExportPresetNameDialog: state.setExportPresetNameDialog,
    exportPresetSaving: state.exportPresetSaving,
    setExportPresetSaving: state.setExportPresetSaving,
    buildCurrentExportSnapshot: state.buildCurrentExportSnapshot
  })

  return {
    ...state,
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleSubmitExportPresetName,
    handleOverwriteExportUserPreset
  }
}
