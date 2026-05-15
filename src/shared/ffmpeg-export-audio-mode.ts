/**
 * §7.2 — whitelist режима аудио экспорта и правила контейнера (без Node/Electron).
 */

import type { FfmpegExportAudioModeId } from './ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_AUDIO_FLAC_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR
} from './ffmpeg-export-contract'

const MKV_ONLY_AUDIO_MODES = new Set<FfmpegExportAudioModeId>(['libopus', 'flac'])

export function ffmpegExportAudioModeRequiresMkv(mode: FfmpegExportAudioModeId): boolean {
  return MKV_ONLY_AUDIO_MODES.has(mode)
}

export function exportAudioModeMkvOnlyErrorMessage(mode: FfmpegExportAudioModeId): string {
  if (mode === 'libopus') {
    return FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR
  }
  if (mode === 'flac') {
    return FFMPEG_EXPORT_AUDIO_FLAC_MKV_ONLY_ERROR
  }
  return FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR
}

/** Режимы, для которых в argv используется `-b:a` из `audioBitrate`. */
export function ffmpegExportAudioModeUsesBitrate(mode: FfmpegExportAudioModeId): boolean {
  return mode === 'aac' || mode === 'libopus'
}
