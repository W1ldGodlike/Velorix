import { useEditorExportSettingsFieldState } from './editor-export-settings-field-state'
import { useEditorExportSettingsDerived } from './use-editor-export-settings-derived'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat export-settings state bundle
export function useEditorExportSettingsState() {
  const fields = useEditorExportSettingsFieldState()
  const derived = useEditorExportSettingsDerived(fields)
  return { ...fields, ...derived }
}
