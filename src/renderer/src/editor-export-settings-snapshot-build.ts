import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId
} from '../../shared/ffmpeg-export-contract'

/** Поля тулбара экспорта для сборки snapshot/overrides без React-хука. */
export type EditorExportSnapshotFields = {
  exportEncodePreset: FfmpegExportEncodePresetId
  exportVideoCodec: FfmpegExportVideoCodecId
  exportContainer: FfmpegExportContainerId
  exportCrf: number | null
  exportVideoBitrate: string | null
  exportAudioMode: FfmpegExportAudioModeId
  exportAudioBitrate: string
  exportFps: number | null
  exportScalePreset: FfmpegExportScalePresetId
  exportVideoTransform: FfmpegExportVideoTransformId
  exportCropPreset: FfmpegExportCropPresetId
  exportTwoPass: boolean
  exportEconomyMode: boolean
  exportHwDecode: boolean
  exportExtraArgsLine: string
  exportAudioGainDb: number
  exportStripMetadata: boolean
  exportStripChapters: boolean
  exportSubtitleMode: FfmpegExportSubtitleModeId
  exportVideoDeinterlace: FfmpegExportVideoDeinterlaceId
  exportVideoDenoise: FfmpegExportVideoDenoiseId
  exportVideoDeband: FfmpegExportVideoDebandId
  exportVideoHisteq: FfmpegExportVideoHisteqId
  exportVideoLut3d: FfmpegExportVideoLut3dId
  exportVideoSharpen: FfmpegExportVideoSharpenId
  exportVideoEqPreset: FfmpegExportVideoEqPresetId
  exportVideoHue: FfmpegExportVideoHueId
  exportVideoGrain: FfmpegExportVideoGrainId
  exportVideoVignette: FfmpegExportVideoVignetteId
  exportVideoBlur: FfmpegExportVideoBlurId
  exportAudioNormalize: FfmpegExportAudioNormalizeId
}

export function buildEditorExportUserPresetSnapshot(
  f: EditorExportSnapshotFields
): FfmpegExportUserPresetSnapshot {
  return {
    encodePreset: f.exportEncodePreset,
    ...(f.exportVideoCodec !== 'libx264' ? { videoCodec: f.exportVideoCodec } : {}),
    container: f.exportContainer,
    crf: f.exportCrf,
    videoBitrate: f.exportVideoBitrate,
    audioMode: f.exportAudioMode,
    audioBitrate: f.exportAudioBitrate,
    fps: f.exportFps,
    scalePreset: f.exportScalePreset,
    videoTransform: f.exportVideoTransform,
    cropPreset: f.exportCropPreset,
    ...(f.exportTwoPass && f.exportVideoCodec === 'libx264' ? { twoPass: true as const } : {}),
    ...(f.exportEconomyMode ? { economyMode: true as const } : {}),
    ...(f.exportHwDecode ? { hwDecode: true as const } : {}),
    ...(f.exportExtraArgsLine.trim().length > 0
      ? { extraArgsLine: f.exportExtraArgsLine.trim() }
      : {}),
    ...(f.exportAudioGainDb !== 0 ? { audioGainDb: f.exportAudioGainDb } : {}),
    ...(f.exportStripMetadata ? { stripMetadata: true } : {}),
    ...(f.exportStripChapters ? { stripChapters: true } : {}),
    ...(f.exportSubtitleMode === 'copy' ? { subtitleMode: 'copy' as const } : {}),
    ...(f.exportVideoDeinterlace !== 'off' ? { videoDeinterlace: f.exportVideoDeinterlace } : {}),
    ...(f.exportVideoDenoise !== 'off' ? { videoDenoise: f.exportVideoDenoise } : {}),
    ...(f.exportVideoDeband !== 'off' ? { videoDeband: f.exportVideoDeband } : {}),
    ...(f.exportVideoHisteq !== 'off' ? { videoHisteq: f.exportVideoHisteq } : {}),
    ...(f.exportVideoLut3d !== 'off' ? { videoLut3d: f.exportVideoLut3d } : {}),
    ...(f.exportVideoSharpen !== 'off' ? { videoSharpen: f.exportVideoSharpen } : {}),
    ...(f.exportVideoEqPreset !== 'off' ? { videoEqPreset: f.exportVideoEqPreset } : {}),
    ...(f.exportVideoHue !== 'off' ? { videoHue: f.exportVideoHue } : {}),
    ...(f.exportVideoGrain !== 'off' ? { videoGrain: f.exportVideoGrain } : {}),
    ...(f.exportVideoVignette !== 'off' ? { videoVignette: f.exportVideoVignette } : {}),
    ...(f.exportVideoBlur !== 'off' ? { videoBlur: f.exportVideoBlur } : {}),
    ...(f.exportAudioNormalize !== 'off' ? { audioNormalize: f.exportAudioNormalize } : {})
  }
}

export function buildEditorFfmpegExportOverrides(f: EditorExportSnapshotFields): {
  encodePreset: FfmpegExportEncodePresetId
  videoCodec: FfmpegExportVideoCodecId
  container: FfmpegExportContainerId
  crf: number | null
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId
  audioBitrate: string
  fps: number | null
  scalePreset: FfmpegExportScalePresetId
  videoTransform: FfmpegExportVideoTransformId
  cropPreset: FfmpegExportCropPresetId
  twoPass: boolean
  economyMode: boolean
  hwDecode: boolean
  extraArgsLine: string
  audioGainDb: number | null
  stripMetadata: boolean
  stripChapters: boolean
  subtitleMode: FfmpegExportSubtitleModeId
  videoDeinterlace: FfmpegExportVideoDeinterlaceId
  videoDenoise: FfmpegExportVideoDenoiseId
  videoDeband: FfmpegExportVideoDebandId
  videoHisteq: FfmpegExportVideoHisteqId
  videoLut3d: FfmpegExportVideoLut3dId
  videoSharpen: FfmpegExportVideoSharpenId
  videoEqPreset: FfmpegExportVideoEqPresetId
  videoHue: FfmpegExportVideoHueId
  videoGrain: FfmpegExportVideoGrainId
  videoVignette: FfmpegExportVideoVignetteId
  videoBlur: FfmpegExportVideoBlurId
  audioNormalize: FfmpegExportAudioNormalizeId
} {
  return {
    encodePreset: f.exportEncodePreset,
    videoCodec: f.exportVideoCodec,
    container: f.exportContainer,
    crf: f.exportCrf,
    videoBitrate: f.exportVideoBitrate,
    audioMode: f.exportAudioMode,
    audioBitrate: f.exportAudioBitrate,
    fps: f.exportFps,
    scalePreset: f.exportScalePreset,
    videoTransform: f.exportVideoTransform,
    cropPreset: f.exportCropPreset,
    twoPass: f.exportTwoPass && f.exportVideoBitrate !== null && f.exportVideoCodec === 'libx264',
    economyMode: f.exportEconomyMode,
    hwDecode: f.exportHwDecode,
    extraArgsLine: f.exportExtraArgsLine,
    audioGainDb: f.exportAudioGainDb === 0 ? null : f.exportAudioGainDb,
    stripMetadata: f.exportStripMetadata,
    stripChapters: f.exportStripChapters,
    subtitleMode: f.exportSubtitleMode,
    videoDeinterlace: f.exportVideoDeinterlace,
    videoDenoise: f.exportVideoDenoise,
    videoDeband: f.exportVideoDeband,
    videoHisteq: f.exportVideoHisteq,
    videoLut3d: f.exportVideoLut3d,
    videoSharpen: f.exportVideoSharpen,
    videoEqPreset: f.exportVideoEqPreset,
    videoHue: f.exportVideoHue,
    videoGrain: f.exportVideoGrain,
    videoVignette: f.exportVideoVignette,
    videoBlur: f.exportVideoBlur,
    audioNormalize: f.exportAudioNormalize
  }
}
