import { useMemo, useState } from 'react'

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
} from '../../shared/ffmpeg-export-contract'
import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  type EditorUrlPasteBehaviorId
} from '../../shared/editor-url-paste-behavior'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../shared/ffmpeg-export-batch-output-suffix'
import { type FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { ExportPresetNameDialogState } from './editor-export-settings-types'

type ExportPresetNameDialog = ExportPresetNameDialogState

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ffmpeg export field useState bundle
export function useEditorExportSettingsFieldState() {
  const [exportEncodePreset, setExportEncodePreset] =
    useState<FfmpegExportEncodePresetId>('balance')
  const [exportVideoCodec, setExportVideoCodec] = useState<FfmpegExportVideoCodecId>('libx264')
  const [hwEncoderProbe, setHwEncoderProbe] = useState<FfmpegHwEncodersProbeResult | null>(null)
  const [exportContainer, setExportContainer] = useState<FfmpegExportContainerId>('mp4')
  const [exportCrf, setExportCrf] = useState<number | null>(null)
  const [exportVideoBitrate, setExportVideoBitrate] = useState<string | null>(null)
  const [exportAudioMode, setExportAudioMode] = useState<FfmpegExportAudioModeId>('aac')
  const [exportAudioBitrate, setExportAudioBitrate] = useState('192k')
  const [exportFps, setExportFps] = useState<number | null>(null)
  const [exportVideoTransform, setExportVideoTransform] =
    useState<FfmpegExportVideoTransformId>('none')
  const [exportCropPreset, setExportCropPreset] = useState<FfmpegExportCropPresetId>('none')
  const [exportScalePreset, setExportScalePreset] = useState<FfmpegExportScalePresetId>('source')
  const [exportTwoPass, setExportTwoPass] = useState(false)
  const [exportEconomyMode, setExportEconomyMode] = useState(false)
  const [exportBenchmarkLoadThreshold, setExportBenchmarkLoadThreshold] = useState(80)
  const [exportHwDecode, setExportHwDecode] = useState(false)
  const [exportExtraArgsLine, setExportExtraArgsLine] = useState('')
  const [editorUrlPasteBehavior, setEditorUrlPasteBehavior] = useState<EditorUrlPasteBehaviorId>(
    DEFAULT_EDITOR_URL_PASTE_BEHAVIOR
  )
  const [batchOutputSuffix, setBatchOutputSuffix] = useState(
    DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  )
  const [batchOutputDirectory, setBatchOutputDirectory] = useState('')
  const [exportAudioGainDb, setExportAudioGainDb] = useState<number>(0)
  const [exportStripMetadata, setExportStripMetadata] = useState(false)
  const [exportStripChapters, setExportStripChapters] = useState(false)
  const [exportSubtitleMode, setExportSubtitleMode] = useState<FfmpegExportSubtitleModeId>('drop')
  const [exportVideoDeinterlace, setExportVideoDeinterlace] =
    useState<FfmpegExportVideoDeinterlaceId>('off')
  const [exportVideoDenoise, setExportVideoDenoise] = useState<FfmpegExportVideoDenoiseId>('off')
  const [exportVideoDeband, setExportVideoDeband] = useState<FfmpegExportVideoDebandId>('off')
  const [exportVideoHisteq, setExportVideoHisteq] = useState<FfmpegExportVideoHisteqId>('off')
  const [exportVideoLut3d, setExportVideoLut3d] = useState<FfmpegExportVideoLut3dId>('off')
  const [lutCubePathForPreview, setLutCubePathForPreview] = useState<string | null>(null)
  const [exportVideoSharpen, setExportVideoSharpen] = useState<FfmpegExportVideoSharpenId>('off')
  const [exportVideoEqPreset, setExportVideoEqPreset] = useState<FfmpegExportVideoEqPresetId>('off')
  const [exportVideoHue, setExportVideoHue] = useState<FfmpegExportVideoHueId>('off')
  const [exportVideoGrain, setExportVideoGrain] = useState<FfmpegExportVideoGrainId>('off')
  const [exportVideoVignette, setExportVideoVignette] = useState<FfmpegExportVideoVignetteId>('off')
  const [exportVideoBlur, setExportVideoBlur] = useState<FfmpegExportVideoBlurId>('off')
  const [exportAudioNormalize, setExportAudioNormalize] =
    useState<FfmpegExportAudioNormalizeId>('off')
  const [exportUserPresets, setExportUserPresets] = useState<FfmpegExportUserPreset[]>([])
  const [selectedUserPresetId, setSelectedUserPresetId] = useState<string | null>(null)
  const selectedExportUserPreset = useMemo(
    () =>
      selectedUserPresetId
        ? exportUserPresets.find((p) => p.id === selectedUserPresetId)
        : undefined,
    [exportUserPresets, selectedUserPresetId]
  )
  const [exportPresetNameDialog, setExportPresetNameDialog] = useState<ExportPresetNameDialog>(null)
  const [exportPresetSaving, setExportPresetSaving] = useState(false)
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)
  const [snapshotFormat, setSnapshotFormat] = useState<FfmpegSnapshotFormatId>('png')
  const [snapshotBusy, setSnapshotBusy] = useState(false)
  const [extractFramesBusy, setExtractFramesBusy] = useState(false)
  const [exportExternalFilterKind, setExportExternalFilterKind] = useState<
    'off' | 'avisynth' | 'vapoursynth'
  >('off')
  const [exportExternalFilterScriptPath, setExportExternalFilterScriptPath] = useState('')

  return {
    exportEncodePreset,
    setExportEncodePreset,
    exportVideoCodec,
    setExportVideoCodec,
    hwEncoderProbe,
    setHwEncoderProbe,
    exportContainer,
    setExportContainer,
    exportCrf,
    setExportCrf,
    exportVideoBitrate,
    setExportVideoBitrate,
    exportAudioMode,
    setExportAudioMode,
    exportAudioBitrate,
    setExportAudioBitrate,
    exportFps,
    setExportFps,
    exportVideoTransform,
    setExportVideoTransform,
    exportCropPreset,
    setExportCropPreset,
    exportScalePreset,
    setExportScalePreset,
    exportTwoPass,
    setExportTwoPass,
    exportEconomyMode,
    setExportEconomyMode,
    exportBenchmarkLoadThreshold,
    setExportBenchmarkLoadThreshold,
    exportHwDecode,
    setExportHwDecode,
    exportExtraArgsLine,
    setExportExtraArgsLine,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    batchOutputSuffix,
    setBatchOutputSuffix,
    batchOutputDirectory,
    setBatchOutputDirectory,
    exportAudioGainDb,
    setExportAudioGainDb,
    exportStripMetadata,
    setExportStripMetadata,
    exportStripChapters,
    setExportStripChapters,
    exportSubtitleMode,
    setExportSubtitleMode,
    exportVideoDeinterlace,
    setExportVideoDeinterlace,
    exportVideoDenoise,
    setExportVideoDenoise,
    exportVideoDeband,
    setExportVideoDeband,
    exportVideoHisteq,
    setExportVideoHisteq,
    exportVideoLut3d,
    setExportVideoLut3d,
    lutCubePathForPreview,
    setLutCubePathForPreview,
    exportVideoSharpen,
    setExportVideoSharpen,
    exportVideoEqPreset,
    setExportVideoEqPreset,
    exportVideoHue,
    setExportVideoHue,
    exportVideoGrain,
    setExportVideoGrain,
    exportVideoVignette,
    setExportVideoVignette,
    exportVideoBlur,
    setExportVideoBlur,
    exportAudioNormalize,
    setExportAudioNormalize,
    exportUserPresets,
    setExportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    selectedExportUserPreset,
    exportPresetNameDialog,
    setExportPresetNameDialog,
    exportPresetSaving,
    setExportPresetSaving,
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath,
    snapshotFormat,
    setSnapshotFormat,
    snapshotBusy,
    setSnapshotBusy,
    extractFramesBusy,
    setExtractFramesBusy,
    exportExternalFilterKind,
    setExportExternalFilterKind,
    exportExternalFilterScriptPath,
    setExportExternalFilterScriptPath
  }
}

export type EditorExportSettingsFieldState = ReturnType<typeof useEditorExportSettingsFieldState>
