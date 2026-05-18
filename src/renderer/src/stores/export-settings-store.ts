import type { SetStateAction } from 'react'

import { createRendererStore } from './create-renderer-store'

import {
  type FfmpegExportAudioModeId,
  type FfmpegExportAudioNormalizeId,
  type FfmpegExportContainerId,
  type FfmpegExportCropPresetId,
  type FfmpegExportEncodePresetId,
  type FfmpegExportScalePresetId,
  type FfmpegExportSubtitleModeId,
  type FfmpegExportUserPreset,
  type FfmpegExportVideoCodecId,
  type FfmpegExportVideoDebandId,
  type FfmpegExportVideoDeinterlaceId,
  type FfmpegExportVideoHisteqId,
  type FfmpegExportVideoDenoiseId,
  type FfmpegExportVideoEqPresetId,
  type FfmpegExportVideoGrainId,
  type FfmpegExportVideoHueId,
  type FfmpegExportVideoBlurId,
  type FfmpegExportVideoLut3dId,
  type FfmpegExportVideoVignetteId,
  type FfmpegExportVideoSharpenId,
  type FfmpegExportVideoTransformId
} from '../../../shared/ffmpeg-export-contract'
import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  type EditorUrlPasteBehaviorId
} from '../../../shared/editor-url-paste-behavior'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../../shared/ffmpeg-export-batch-output-suffix'
import { type FfmpegHwEncodersProbeResult } from '../../../shared/ffmpeg-hw-encoder-probe'
import type { FfmpegSnapshotFormatId } from '../../../shared/ffmpeg-snapshot-contract'
import type { ExportPresetNameDialogState } from '../editor-export-settings-types'
import { applySetStateAction } from './store-set-action'

export type ExportSettingsStoreState = {
  exportEncodePreset: FfmpegExportEncodePresetId
  exportVideoCodec: FfmpegExportVideoCodecId
  hwEncoderProbe: FfmpegHwEncodersProbeResult | null
  exportContainer: FfmpegExportContainerId
  exportCrf: number | null
  exportVideoBitrate: string | null
  exportAudioMode: FfmpegExportAudioModeId
  exportAudioBitrate: string
  exportFps: number | null
  exportVideoTransform: FfmpegExportVideoTransformId
  exportCropPreset: FfmpegExportCropPresetId
  exportScalePreset: FfmpegExportScalePresetId
  exportTwoPass: boolean
  exportEconomyMode: boolean
  exportBenchmarkLoadThreshold: number
  exportHwDecode: boolean
  exportExtraArgsLine: string
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  batchOutputSuffix: string
  batchOutputDirectory: string
  exportAudioGainDb: number
  exportStripMetadata: boolean
  exportStripChapters: boolean
  exportSubtitleMode: FfmpegExportSubtitleModeId
  exportVideoDeinterlace: FfmpegExportVideoDeinterlaceId
  exportVideoDenoise: FfmpegExportVideoDenoiseId
  exportVideoDeband: FfmpegExportVideoDebandId
  exportVideoHisteq: FfmpegExportVideoHisteqId
  exportVideoLut3d: FfmpegExportVideoLut3dId
  lutCubePathForPreview: string | null
  exportVideoSharpen: FfmpegExportVideoSharpenId
  exportVideoEqPreset: FfmpegExportVideoEqPresetId
  exportVideoHue: FfmpegExportVideoHueId
  exportVideoGrain: FfmpegExportVideoGrainId
  exportVideoVignette: FfmpegExportVideoVignetteId
  exportVideoBlur: FfmpegExportVideoBlurId
  exportAudioNormalize: FfmpegExportAudioNormalizeId
  exportUserPresets: FfmpegExportUserPreset[]
  selectedUserPresetId: string | null
  exportPresetNameDialog: ExportPresetNameDialogState
  exportPresetSaving: boolean
  lastExportPath: string | null
  lastSnapshotPath: string | null
  snapshotFormat: FfmpegSnapshotFormatId
  snapshotBusy: boolean
  extractFramesBusy: boolean
  exportExternalFilterKind: 'off' | 'avisynth' | 'vapoursynth'
  exportExternalFilterScriptPath: string
}

export const initialExportSettingsState: ExportSettingsStoreState = {
  exportEncodePreset: 'balance',
  exportVideoCodec: 'libx264',
  hwEncoderProbe: null,
  exportContainer: 'mp4',
  exportCrf: null,
  exportVideoBitrate: null,
  exportAudioMode: 'aac',
  exportAudioBitrate: '192k',
  exportFps: null,
  exportVideoTransform: 'none',
  exportCropPreset: 'none',
  exportScalePreset: 'source',
  exportTwoPass: false,
  exportEconomyMode: false,
  exportBenchmarkLoadThreshold: 80,
  exportHwDecode: false,
  exportExtraArgsLine: '',
  editorUrlPasteBehavior: DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  batchOutputSuffix: DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  batchOutputDirectory: '',
  exportAudioGainDb: 0,
  exportStripMetadata: false,
  exportStripChapters: false,
  exportSubtitleMode: 'drop',
  exportVideoDeinterlace: 'off',
  exportVideoDenoise: 'off',
  exportVideoDeband: 'off',
  exportVideoHisteq: 'off',
  exportVideoLut3d: 'off',
  lutCubePathForPreview: null,
  exportVideoSharpen: 'off',
  exportVideoEqPreset: 'off',
  exportVideoHue: 'off',
  exportVideoGrain: 'off',
  exportVideoVignette: 'off',
  exportVideoBlur: 'off',
  exportAudioNormalize: 'off',
  exportUserPresets: [],
  selectedUserPresetId: null,
  exportPresetNameDialog: null,
  exportPresetSaving: false,
  lastExportPath: null,
  lastSnapshotPath: null,
  snapshotFormat: 'png',
  snapshotBusy: false,
  extractFramesBusy: false,
  exportExternalFilterKind: 'off',
  exportExternalFilterScriptPath: ''
}

type ExportSetterKey = {
  [K in keyof ExportSettingsStoreState as `set${Capitalize<string & K>}`]: (
    next: SetStateAction<ExportSettingsStoreState[K]>
  ) => void
}

export type ExportSettingsStore = ExportSettingsStoreState & ExportSetterKey & { reset: () => void }

function fieldSetter<K extends keyof ExportSettingsStoreState>(
  key: K,
  set: (partial: Partial<ExportSettingsStoreState>) => void,
  get: () => ExportSettingsStoreState
): (next: SetStateAction<ExportSettingsStoreState[K]>) => void {
  return (next: SetStateAction<ExportSettingsStoreState[K]>) => {
    set({ [key]: applySetStateAction(next, get()[key]) } as Partial<ExportSettingsStoreState>)
  }
}

export const useExportSettingsStore = createRendererStore<ExportSettingsStore>(
  'ExportSettings',
  (set, get) => ({
    ...initialExportSettingsState,
    setExportEncodePreset: fieldSetter('exportEncodePreset', set, get),
    setExportVideoCodec: fieldSetter('exportVideoCodec', set, get),
    setHwEncoderProbe: fieldSetter('hwEncoderProbe', set, get),
    setExportContainer: fieldSetter('exportContainer', set, get),
    setExportCrf: fieldSetter('exportCrf', set, get),
    setExportVideoBitrate: fieldSetter('exportVideoBitrate', set, get),
    setExportAudioMode: fieldSetter('exportAudioMode', set, get),
    setExportAudioBitrate: fieldSetter('exportAudioBitrate', set, get),
    setExportFps: fieldSetter('exportFps', set, get),
    setExportVideoTransform: fieldSetter('exportVideoTransform', set, get),
    setExportCropPreset: fieldSetter('exportCropPreset', set, get),
    setExportScalePreset: fieldSetter('exportScalePreset', set, get),
    setExportTwoPass: fieldSetter('exportTwoPass', set, get),
    setExportEconomyMode: fieldSetter('exportEconomyMode', set, get),
    setExportBenchmarkLoadThreshold: fieldSetter('exportBenchmarkLoadThreshold', set, get),
    setExportHwDecode: fieldSetter('exportHwDecode', set, get),
    setExportExtraArgsLine: fieldSetter('exportExtraArgsLine', set, get),
    setEditorUrlPasteBehavior: fieldSetter('editorUrlPasteBehavior', set, get),
    setBatchOutputSuffix: fieldSetter('batchOutputSuffix', set, get),
    setBatchOutputDirectory: fieldSetter('batchOutputDirectory', set, get),
    setExportAudioGainDb: fieldSetter('exportAudioGainDb', set, get),
    setExportStripMetadata: fieldSetter('exportStripMetadata', set, get),
    setExportStripChapters: fieldSetter('exportStripChapters', set, get),
    setExportSubtitleMode: fieldSetter('exportSubtitleMode', set, get),
    setExportVideoDeinterlace: fieldSetter('exportVideoDeinterlace', set, get),
    setExportVideoDenoise: fieldSetter('exportVideoDenoise', set, get),
    setExportVideoDeband: fieldSetter('exportVideoDeband', set, get),
    setExportVideoHisteq: fieldSetter('exportVideoHisteq', set, get),
    setExportVideoLut3d: fieldSetter('exportVideoLut3d', set, get),
    setLutCubePathForPreview: fieldSetter('lutCubePathForPreview', set, get),
    setExportVideoSharpen: fieldSetter('exportVideoSharpen', set, get),
    setExportVideoEqPreset: fieldSetter('exportVideoEqPreset', set, get),
    setExportVideoHue: fieldSetter('exportVideoHue', set, get),
    setExportVideoGrain: fieldSetter('exportVideoGrain', set, get),
    setExportVideoVignette: fieldSetter('exportVideoVignette', set, get),
    setExportVideoBlur: fieldSetter('exportVideoBlur', set, get),
    setExportAudioNormalize: fieldSetter('exportAudioNormalize', set, get),
    setExportUserPresets: fieldSetter('exportUserPresets', set, get),
    setSelectedUserPresetId: fieldSetter('selectedUserPresetId', set, get),
    setExportPresetNameDialog: fieldSetter('exportPresetNameDialog', set, get),
    setExportPresetSaving: fieldSetter('exportPresetSaving', set, get),
    setLastExportPath: fieldSetter('lastExportPath', set, get),
    setLastSnapshotPath: fieldSetter('lastSnapshotPath', set, get),
    setSnapshotFormat: fieldSetter('snapshotFormat', set, get),
    setSnapshotBusy: fieldSetter('snapshotBusy', set, get),
    setExtractFramesBusy: fieldSetter('extractFramesBusy', set, get),
    setExportExternalFilterKind: fieldSetter('exportExternalFilterKind', set, get),
    setExportExternalFilterScriptPath: fieldSetter('exportExternalFilterScriptPath', set, get),
    reset: () => {
      set(initialExportSettingsState)
    }
  })
)

export function selectSelectedExportUserPreset(
  state: ExportSettingsStoreState
): FfmpegExportUserPreset | undefined {
  return state.selectedUserPresetId
    ? state.exportUserPresets.find((p) => p.id === state.selectedUserPresetId)
    : undefined
}
