import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'
import type { UseAppWorkspaceMainPropsInput } from './use-app-workspace-main-props'

export function buildAppShellPropsInputWorkspaceShell(
  ctx: AppShellPropsInputCtx
): Pick<
  UseAppWorkspaceMainPropsInput,
  'shell' | 'knowledge' | 'busy' | 'editorQuick'
> {
  const {
    workspaceTab,
    panelOpen,
    persistMainWindowUiPanelToggle,
    downloadsSettingsRailRef,
    setKnowledgeInitialSlug,
    setKnowledgeOpen,
    engineDownloadBusy,
    exportBusy,
    snapshotBusy,
    probePending,
    exportCancelBusy,
    batchExportBusy,
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsUrl,
    setDownloadsUrl,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    handleQuickYtdlpEnqueueLines,
    handleDownloadFirstUrlOpenInEditor
  } = ctx

  return {
    shell: {
      workspaceTab,
      panelOpen,
      persistMainWindowUiPanelToggle,
      downloadsSettingsRailRef
    },
    knowledge: {
      setKnowledgeInitialSlug,
      setKnowledgeOpen
    },
    busy: {
      engineDownloadBusy,
      exportBusy,
      snapshotBusy,
      probePending,
      exportCancelBusy,
      batchExportBusy,
      downloadsOptionsBusy,
      downloadsHistoryBusy
    },
    editorQuick: {
      downloadsUrl,
      setDownloadsUrl,
      editorUrlPasteBehavior,
      setEditorUrlPasteBehavior,
      handleQuickYtdlpEnqueueLines,
      handleDownloadFirstUrlOpenInEditor
    }
  }
}
