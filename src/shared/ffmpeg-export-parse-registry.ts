/**
 * §7.2 — whitelist-парсеры export options (одна таблица, без ctrl+c тел функций).
 */
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId
} from './ffmpeg-export-contract'
import { parseWhitelistEnum } from './parse-whitelist'

const OFF_LIGHT_MEDIUM_STRONG = ['light', 'medium', 'strong'] as const

export function parseFfmpegExportEncodePreset(raw: unknown): FfmpegExportEncodePresetId {
  return parseWhitelistEnum(raw, ['balance', 'smaller', 'quality'], 'balance')
}

export function parseFfmpegExportContainer(raw: unknown): FfmpegExportContainerId {
  return parseWhitelistEnum(raw, ['mkv', 'mov', 'mp4'], 'mp4')
}

export function parseFfmpegExportAudioMode(raw: unknown): FfmpegExportAudioModeId {
  return parseWhitelistEnum(
    raw,
    [
      'none',
      'libmp3lame',
      'ac3',
      'copy',
      'pcm_s16le',
      'libvorbis',
      'libopus',
      'flac',
      'alac'
    ],
    'aac'
  )
}

export function parseFfmpegExportScalePreset(raw: unknown): FfmpegExportScalePresetId {
  return parseWhitelistEnum(raw, ['480p', '720p', '1080p'], 'source')
}

export function parseFfmpegExportVideoTransform(raw: unknown): FfmpegExportVideoTransformId {
  return parseWhitelistEnum(raw, ['cw90', 'ccw90', 'r180', 'hflip', 'vflip'], 'none')
}

export function parseFfmpegExportCropPreset(raw: unknown): FfmpegExportCropPresetId {
  return parseWhitelistEnum(raw, ['center-square', 'center-16-9', 'center-4-3'], 'none')
}

export function parseFfmpegExportSubtitleMode(raw: unknown): FfmpegExportSubtitleModeId {
  return parseWhitelistEnum(raw, ['copy'], 'drop')
}

export function parseFfmpegExportVideoDenoise(raw: unknown): FfmpegExportVideoDenoiseId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoSharpen(raw: unknown): FfmpegExportVideoSharpenId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoDeband(raw: unknown): FfmpegExportVideoDebandId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoHisteq(raw: unknown): FfmpegExportVideoHisteqId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoGrain(raw: unknown): FfmpegExportVideoGrainId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoVignette(raw: unknown): FfmpegExportVideoVignetteId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoBlur(raw: unknown): FfmpegExportVideoBlurId {
  return parseWhitelistEnum(raw, OFF_LIGHT_MEDIUM_STRONG, 'off')
}

export function parseFfmpegExportVideoLut3d(raw: unknown): FfmpegExportVideoLut3dId {
  return parseWhitelistEnum(raw, ['film-warm', 'film-cool', 'punch'], 'off')
}

export function parseFfmpegExportVideoEqPreset(raw: unknown): FfmpegExportVideoEqPresetId {
  return parseWhitelistEnum(raw, ['warm', 'cool', 'vivid', 'flat'], 'off')
}

export function parseFfmpegExportVideoDeinterlace(raw: unknown): FfmpegExportVideoDeinterlaceId {
  return parseWhitelistEnum(raw, ['frame', 'field'], 'off')
}

export function parseFfmpegExportVideoHue(raw: unknown): FfmpegExportVideoHueId {
  return parseWhitelistEnum(raw, ['warmShift', 'coolShift', 'satBoost'], 'off')
}

export function parseFfmpegExportAudioNormalize(raw: unknown): FfmpegExportAudioNormalizeId {
  return parseWhitelistEnum(raw, ['loudnorm', 'dynaudnorm'], 'off')
}
