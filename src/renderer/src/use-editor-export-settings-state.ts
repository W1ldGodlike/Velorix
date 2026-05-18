import type { EditorExportSettingsFieldState } from './editor-export-settings-field-state'
import { useEditorExportSettingsFieldState } from './editor-export-settings-field-state'
import type { EditorExportSettingsDerivedBundle } from './editor-export-settings-derived-types'
import { useEditorExportSettingsDerived } from './use-editor-export-settings-derived'

export type EditorExportSettingsStateBundle = EditorExportSettingsFieldState &
  EditorExportSettingsDerivedBundle

export function useEditorExportSettingsState(): EditorExportSettingsStateBundle {
  const fields = useEditorExportSettingsFieldState()
  const derived = useEditorExportSettingsDerived(fields)
  return { ...fields, ...derived }
}
