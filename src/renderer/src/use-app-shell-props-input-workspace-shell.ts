import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'
import type { UseAppWorkspaceEditorPropsInput } from './use-app-workspace-editor-props'

export function buildAppShellPropsInputWorkspaceEditorShared(
  ctx: AppShellPropsInputCtx
): Pick<UseAppWorkspaceEditorPropsInput, 'knowledge' | 'busy' | 'editorQuick'> {
  const {
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
