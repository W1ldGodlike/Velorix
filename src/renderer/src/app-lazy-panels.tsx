import { lazy, type JSX } from 'react'

export const LazyTerminalWorkspacePanelConnected = lazy(() =>
  import('./components/TerminalWorkspacePanelConnected').then((m) => ({
    default: m.TerminalWorkspacePanelConnected
  }))
)

export const LazyDownloadsWorkspaceConnected = lazy(() =>
  import('./components/downloads/DownloadsWorkspaceConnected').then((m) => ({
    default: m.DownloadsWorkspaceConnected
  }))
)

export const LazyEditorFfmpegSettingsRail = lazy(() =>
  import('./components/editor/EditorFfmpegSettingsRail').then((m) => ({
    default: m.EditorFfmpegSettingsRail
  }))
)

export const LazyKnowledgeDialog = lazy(() =>
  import('./components/KnowledgeDialog').then((m) => ({
    default: m.KnowledgeDialog
  }))
)

export const LazyAppSettingsDialog = lazy(() =>
  import('./components/shell/AppSettingsDialog').then((m) => ({
    default: m.AppSettingsDialog
  }))
)

export const LazyWorkflowPlannerDialog = lazy(() =>
  import('./components/shell/WorkflowPlannerDialog').then((m) => ({
    default: m.WorkflowPlannerDialog
  }))
)

export const LazyWorkflowScenarioBuilderDialog = lazy(() =>
  import('./components/shell/WorkflowScenarioBuilderDialog').then((m) => ({
    default: m.WorkflowScenarioBuilderDialog
  }))
)

export const LazyExternalFilterScriptDialog = lazy(() =>
  import('./components/shell/ExternalFilterScriptDialog').then((m) => ({
    default: m.ExternalFilterScriptDialog
  }))
)

export const LazyMediaFileUtilitiesDialog = lazy(() =>
  import('./components/MediaFileUtilitiesDialog').then((m) => ({
    default: m.MediaFileUtilitiesDialog
  }))
)

/** §4.4.1 — нейтральный placeholder пока грузится чанк вкладки/панели. */
export function AppLazyPanelFallback(): JSX.Element {
  return <div className="app-workspace-lazy-fallback" aria-hidden />
}
