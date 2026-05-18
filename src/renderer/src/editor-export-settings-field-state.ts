import type { ExportSettingsStore } from './stores/export-settings-store'
import { useExportSettingsStore } from './stores/export-settings-store'
import { selectSelectedExportUserPreset } from './stores/export-settings-store'

export function useEditorExportSettingsFieldState(): ExportSettingsStoreStateWithPreset {
  const store = useExportSettingsStore()
  return {
    ...store,
    selectedExportUserPreset: selectSelectedExportUserPreset(store)
  }
}

export type ExportSettingsStoreStateWithPreset = ExportSettingsStore & {
  selectedExportUserPreset: ReturnType<typeof selectSelectedExportUserPreset>
}

export type EditorExportSettingsFieldState = ReturnType<typeof useEditorExportSettingsFieldState>
