export type { UseEditorExportPipelineDeps } from './use-editor-export-pipeline-deps'

import type { UseEditorExportPipelineDeps } from './use-editor-export-pipeline-deps'
import {
  useEditorExportPipelineHandlers,
  type EditorExportPipelineHandlers
} from './use-editor-export-pipeline-handlers'
import { useEditorExportPipelinePreview } from './use-editor-export-pipeline-preview'

export type EditorExportPipelineResult = EditorExportPipelineHandlers &
  ReturnType<typeof useEditorExportPipelinePreview>

export function useEditorExportPipeline(
  deps: UseEditorExportPipelineDeps
): EditorExportPipelineResult {
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
    extractFramesBusy: deps.extractFramesBusy,
    setExtractFramesBusy: deps.setExtractFramesBusy,
    snapshotFormat: deps.snapshotFormat,
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
