import type { FfmpegExportSelectOptions } from './editor-export-select-options'
import {
  useEditorExportSettingsState,
  type EditorExportSettingsStateBundle
} from './use-editor-export-settings-state'
import { useEditorExportUserPresetActions } from './use-editor-export-user-preset-actions'

export type { ExportPresetNameDialogState } from './editor-export-settings-types'
export type { FfmpegExportSelectOptions }

export type UseEditorExportSettingsDeps = {
  setStatusHint: (hint: string | null) => void
}

export type UseEditorExportSettingsResult = EditorExportSettingsStateBundle &
  ReturnType<typeof useEditorExportUserPresetActions>

export function useEditorExportSettings(
  deps: UseEditorExportSettingsDeps
): UseEditorExportSettingsResult {
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
