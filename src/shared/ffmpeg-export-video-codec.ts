/**
 * §7.2 / §16 — whitelist видеокодека экспорта (CPU + HW из `ffmpeg-hw-encoder-probe`).
 * Общий для renderer и main (без Node/Electron).
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import { FFMPEG_HW_VIDEO_ENCODER_IDS, type FfmpegHwVideoEncoderId } from './ffmpeg-hw-encoder-probe'

const HW_SET = new Set<string>(FFMPEG_HW_VIDEO_ENCODER_IDS)

export function isFfmpegHwExportVideoCodec(
  c: FfmpegExportVideoCodecId
): c is FfmpegHwVideoEncoderId {
  return HW_SET.has(c)
}

export function parseFfmpegExportVideoCodec(raw: unknown): FfmpegExportVideoCodecId {
  if (raw === 'libx265') {
    return 'libx265'
  }
  if (typeof raw === 'string' && HW_SET.has(raw)) {
    return raw as FfmpegHwVideoEncoderId
  }
  return 'libx264'
}
