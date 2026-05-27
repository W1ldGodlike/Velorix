import type {
  FfmpegExportEncodePresetId,
  FfmpegExportUserPresetSnapshot
} from '../../../shared/ffmpeg-export-contract'
import type { AppSettingsView } from '../../../shared/settings-contract'

import { readEncodePresetForExport } from './read-encode-preset-for-export'

/** Снимок текущих настроек экспорта для пользовательского пресета (§7.2). */
export function exportSettingsToPresetSnapshot(
  view: AppSettingsView
): FfmpegExportUserPresetSnapshot {
  const encodePreset: FfmpegExportEncodePresetId =
    readEncodePresetForExport(view.ffmpegExportEncodePreset) ?? 'balance'
  return {
    encodePreset,
    container: view.ffmpegExportContainer ?? 'mp4',
    crf: view.ffmpegExportCrf ?? null,
    videoBitrate: view.ffmpegExportVideoBitrate ?? null,
    audioMode: view.ffmpegExportAudioMode ?? 'aac',
    audioBitrate: view.ffmpegExportAudioBitrate ?? '192k',
    fps: view.ffmpegExportFps ?? null,
    scalePreset: view.ffmpegExportScalePreset ?? 'source',
    videoTransform: view.ffmpegExportVideoTransform ?? 'none',
    cropPreset: view.ffmpegExportCropPreset ?? 'none',
    ...(view.ffmpegExportVideoCodec != null ? { videoCodec: view.ffmpegExportVideoCodec } : {}),
    ...(view.ffmpegExportTwoPass === true ? { twoPass: true } : {}),
    ...(view.ffmpegExportEconomyMode === true ? { economyMode: true } : {}),
    ...(view.ffmpegExportHwDecode === true ? { hwDecode: true } : {}),
    ...(view.ffmpegExportExtraArgsLine != null && view.ffmpegExportExtraArgsLine.length > 0
      ? { extraArgsLine: view.ffmpegExportExtraArgsLine }
      : {}),
    ...(view.ffmpegExportAudioGainDb != null ? { audioGainDb: view.ffmpegExportAudioGainDb } : {}),
    ...(view.ffmpegExportStripMetadata === true ? { stripMetadata: true } : {}),
    ...(view.ffmpegExportStripChapters === true ? { stripChapters: true } : {}),
    ...(view.ffmpegExportSubtitleMode != null
      ? { subtitleMode: view.ffmpegExportSubtitleMode }
      : {}),
    ...(view.ffmpegExportVideoDenoise != null
      ? { videoDenoise: view.ffmpegExportVideoDenoise }
      : {}),
    ...(view.ffmpegExportVideoSharpen != null
      ? { videoSharpen: view.ffmpegExportVideoSharpen }
      : {}),
    ...(view.ffmpegExportVideoDeband != null ? { videoDeband: view.ffmpegExportVideoDeband } : {}),
    ...(view.ffmpegExportVideoHisteq != null ? { videoHisteq: view.ffmpegExportVideoHisteq } : {}),
    ...(view.ffmpegExportVideoLut3d != null ? { videoLut3d: view.ffmpegExportVideoLut3d } : {}),
    ...(view.ffmpegExportVideoEqPreset != null
      ? { videoEqPreset: view.ffmpegExportVideoEqPreset }
      : {}),
    ...(view.ffmpegExportVideoHue != null ? { videoHue: view.ffmpegExportVideoHue } : {}),
    ...(view.ffmpegExportVideoGrain != null ? { videoGrain: view.ffmpegExportVideoGrain } : {}),
    ...(view.ffmpegExportVideoVignette != null
      ? { videoVignette: view.ffmpegExportVideoVignette }
      : {}),
    ...(view.ffmpegExportVideoBlur != null ? { videoBlur: view.ffmpegExportVideoBlur } : {}),
    ...(view.ffmpegExportVideoDeinterlace != null
      ? { videoDeinterlace: view.ffmpegExportVideoDeinterlace }
      : {}),
    ...(view.ffmpegExportAudioNormalize != null
      ? { audioNormalize: view.ffmpegExportAudioNormalize }
      : {})
  }
}
