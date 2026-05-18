import type { EditorBatchExportBarProps } from './components/editor/EditorBatchExportBar'
import type { EditorFfmpegSettingsRailProps } from './components/editor/EditorFfmpegSettingsRail'
import type { EditorPreviewSectionProps } from './components/editor/EditorPreviewSection'
import type { EditorQuickYtdlpBarProps } from './components/editor/EditorQuickYtdlpBar'

/** Props редактора внутри `AppWorkspaceMain` (downloads/terminal — Connected + stores). */
export type AppWorkspaceEditorProps = {
  editorMainAriaBusy: boolean
  editorQuick: Omit<EditorQuickYtdlpBarProps, 'open' | 'onOpenChange'>
  editorBatch: Omit<EditorBatchExportBarProps, 'open' | 'onOpenChange'>
  editorPreview: Omit<
    EditorPreviewSectionProps,
    'ffmpegSettingsRailOpen' | 'onShowFfmpegSettingsRail'
  >
  editorFfmpeg: Omit<
    EditorFfmpegSettingsRailProps,
    'panelOpen' | 'persistMainWindowUiPanelToggle' | 'onCollapseRail'
  >
}
