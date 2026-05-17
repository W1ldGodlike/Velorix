export type { UseEditorExportPipelineDeps } from './use-editor-export-pipeline-deps'

import type { UseEditorExportPipelineDeps } from './use-editor-export-pipeline-deps'
import { useEditorExportPipelineHandlers } from './use-editor-export-pipeline-handlers'
import { useEditorExportPipelinePreview } from './use-editor-export-pipeline-preview'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat pipeline API for App.tsx
export function useEditorExportPipeline(deps: UseEditorExportPipelineDeps) {
  const { exportPreview, exportPreviewCommand, exportPreviewHint } =
    useEditorExportPipelinePreview(deps)

  const handlers = useEditorExportPipelineHandlers({
    setStatusHint: deps.setStatusHint,
    preview: deps.preview,
    probeInfo: deps.probeInfo,
    trimSnapshotRef: deps.trimSnapshotRef,
    videoRef: deps.videoRef,
    exportBusy: deps.exportBusy,
    setExportBusy: deps.setExportBusy,
    exportCancelBusy: deps.exportCancelBusy,
    setExportCancelBusy: deps.setExportCancelBusy,
    batchExportBusy: deps.batchExportBusy,
    snapshotBusy: deps.snapshotBusy,
    setSnapshotBusy: deps.setSnapshotBusy,
    refreshProcessingHistory: deps.refreshProcessingHistory,
    buildCurrentFfmpegExportOverrides: deps.buildCurrentFfmpegExportOverrides,
    lastExportPath: deps.lastExportPath,
    setLastExportPath: deps.setLastExportPath,
    lastSnapshotPath: deps.lastSnapshotPath,
    setLastSnapshotPath: deps.setLastSnapshotPath,
    exportPreview,
    exportPreviewCommand
  })

  return {
    ...handlers,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint
  }
}
