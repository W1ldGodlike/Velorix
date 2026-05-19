import type { Dispatch, SetStateAction } from 'react'

import type { FfmpegExportPreviewResult } from '../../../../shared/ffmpeg-export-argv'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId
} from '../../../../shared/ffmpeg-export-contract'
import type { FfmpegHwEncodersProbeResult } from '../../../../shared/ffmpeg-hw-encoder-probe'
import type { FfmpegSnapshotFormatId } from '../../../../shared/ffmpeg-snapshot-contract'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../../../shared/processing-history-contract'
import type { AppSettings } from '../../../../shared/settings-contract'
import type { MainWindowUiPanelKey } from '../../stores/panels-store'
import type { FfmpegExportSelectOptions } from '../../use-editor-export-settings'

export type EditorFfmpegSettingsRailProps = {
  panelOpen: (key: MainWindowUiPanelKey) => boolean
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, nextOpen: boolean) => void
  onCollapseRail: () => void
  setStatusHint: (hint: string | null) => void
  editorFfmpegDetailBusy: boolean
  exportBusy: boolean
  exportCancelBusy: boolean
  batchExportBusy: boolean
  snapshotBusy: boolean
  extractFramesBusy: boolean
  setExtractFramesBusy: (busy: boolean) => void
  previewMediaPath: string | null
  previewProbeDurationSec: number | null
  buildCurrentFfmpegExportOverrides: () => Record<string, unknown>
  probePending: boolean
  hwEncoderProbe: FfmpegHwEncodersProbeResult | null
  exportEncodePreset: FfmpegExportEncodePresetId
  setExportEncodePreset: Dispatch<SetStateAction<FfmpegExportEncodePresetId>>
  exportVideoCodec: FfmpegExportVideoCodecId
  setExportVideoCodec: Dispatch<SetStateAction<FfmpegExportVideoCodecId>>
  exportContainer: FfmpegExportContainerId
  setExportContainer: Dispatch<SetStateAction<FfmpegExportContainerId>>
  exportCrf: number | null
  setExportCrf: Dispatch<SetStateAction<number | null>>
  exportVideoBitrate: string | null
  setExportVideoBitrate: Dispatch<SetStateAction<string | null>>
  exportAudioMode: FfmpegExportAudioModeId
  setExportAudioMode: Dispatch<SetStateAction<FfmpegExportAudioModeId>>
  exportAudioBitrate: string
  setExportAudioBitrate: Dispatch<SetStateAction<string>>
  exportFps: number | null
  setExportFps: Dispatch<SetStateAction<number | null>>
  exportVideoTransform: FfmpegExportVideoTransformId
  setExportVideoTransform: Dispatch<SetStateAction<FfmpegExportVideoTransformId>>
  exportCropPreset: FfmpegExportCropPresetId
  setExportCropPreset: Dispatch<SetStateAction<FfmpegExportCropPresetId>>
  exportScalePreset: FfmpegExportScalePresetId
  setExportScalePreset: Dispatch<SetStateAction<FfmpegExportScalePresetId>>
  exportTwoPass: boolean
  setExportTwoPass: Dispatch<SetStateAction<boolean>>
  exportEconomyMode: boolean
  setExportEconomyMode: Dispatch<SetStateAction<boolean>>
  exportBenchmarkLoadThreshold: number
  setExportBenchmarkLoadThreshold: Dispatch<SetStateAction<number>>
  exportHwDecode: boolean
  setExportHwDecode: Dispatch<SetStateAction<boolean>>
  exportExtraArgsLine: string
  setExportExtraArgsLine: Dispatch<SetStateAction<string>>
  exportAudioGainDb: number
  setExportAudioGainDb: Dispatch<SetStateAction<number>>
  exportStripMetadata: boolean
  setExportStripMetadata: Dispatch<SetStateAction<boolean>>
  exportStripChapters: boolean
  setExportStripChapters: Dispatch<SetStateAction<boolean>>
  exportSubtitleMode: FfmpegExportSubtitleModeId
  setExportSubtitleMode: Dispatch<SetStateAction<FfmpegExportSubtitleModeId>>
  exportVideoDeinterlace: FfmpegExportVideoDeinterlaceId
  setExportVideoDeinterlace: Dispatch<SetStateAction<FfmpegExportVideoDeinterlaceId>>
  exportVideoDenoise: FfmpegExportVideoDenoiseId
  setExportVideoDenoise: Dispatch<SetStateAction<FfmpegExportVideoDenoiseId>>
  exportVideoDeband: FfmpegExportVideoDebandId
  setExportVideoDeband: Dispatch<SetStateAction<FfmpegExportVideoDebandId>>
  exportVideoHisteq: FfmpegExportVideoHisteqId
  setExportVideoHisteq: Dispatch<SetStateAction<FfmpegExportVideoHisteqId>>
  exportVideoLut3d: FfmpegExportVideoLut3dId
  setExportVideoLut3d: Dispatch<SetStateAction<FfmpegExportVideoLut3dId>>
  exportVideoSharpen: FfmpegExportVideoSharpenId
  setExportVideoSharpen: Dispatch<SetStateAction<FfmpegExportVideoSharpenId>>
  exportVideoEqPreset: FfmpegExportVideoEqPresetId
  setExportVideoEqPreset: Dispatch<SetStateAction<FfmpegExportVideoEqPresetId>>
  exportVideoHue: FfmpegExportVideoHueId
  setExportVideoHue: Dispatch<SetStateAction<FfmpegExportVideoHueId>>
  exportVideoGrain: FfmpegExportVideoGrainId
  setExportVideoGrain: Dispatch<SetStateAction<FfmpegExportVideoGrainId>>
  exportVideoVignette: FfmpegExportVideoVignetteId
  setExportVideoVignette: Dispatch<SetStateAction<FfmpegExportVideoVignetteId>>
  exportVideoBlur: FfmpegExportVideoBlurId
  setExportVideoBlur: Dispatch<SetStateAction<FfmpegExportVideoBlurId>>
  exportAudioNormalize: FfmpegExportAudioNormalizeId
  setExportAudioNormalize: Dispatch<SetStateAction<FfmpegExportAudioNormalizeId>>
  exportUserPresets: FfmpegExportUserPreset[]
  selectedUserPresetId: string | null
  setSelectedUserPresetId: Dispatch<SetStateAction<string | null>>
  selectedExportUserPreset: FfmpegExportUserPreset | undefined
  lastExportPath: string | null
  lastSnapshotPath: string | null
  snapshotFormat: FfmpegSnapshotFormatId
  setSnapshotFormat: Dispatch<SetStateAction<FfmpegSnapshotFormatId>>
  ffmpegExportSelectOptions: FfmpegExportSelectOptions
  exportExtraArgsParsed: { ok: true; args: string[] } | { ok: false; error: string }
  hydrateExportFieldsFromSettings: (loaded: AppSettings) => void
  bumpManualExportEdit: () => void
  handleSaveExportUserPreset: () => void
  handleDeleteExportUserPreset: () => void
  handleRenameExportUserPreset: () => void
  handleOverwriteExportUserPreset: () => void
  exportPreview: FfmpegExportPreviewResult
  exportPreviewCommand: string
  exportPreviewHint: () => string
  handleCopyExportPreview: () => Promise<void>
  handleOpenLastExport: (mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleCopyLastExportPath: () => Promise<void>
  handleOpenLastSnapshot: (mode: 'file' | 'folder') => Promise<void>
  handleCopyLastSnapshotPath: () => Promise<void>
  processingHistory: ProcessingHistoryEntry[]
  setProcessingHistory: Dispatch<SetStateAction<ProcessingHistoryEntry[]>>
  processingHistoryBusy: boolean
  processingHistoryFilter: ProcessingHistoryFilter
  processingHistoryWeeklySummary: ProcessingHistoryWeeklySummary | null
  setProcessingHistoryWeeklySummary: Dispatch<SetStateAction<ProcessingHistoryWeeklySummary | null>>
  applyProcessingHistoryFilter: (next: ProcessingHistoryFilter) => void
  refreshProcessingHistory: (filter?: ProcessingHistoryFilter) => Promise<void>
  exportVisibleProcessingHistory: () => Promise<void>
  reportBatchPathsAdded: (counts: { added: number; skipped: number }, emptyMsg?: string) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}
