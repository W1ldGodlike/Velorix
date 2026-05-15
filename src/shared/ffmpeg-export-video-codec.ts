/**
 * §7.2 / §16 — whitelist видеокодека экспорта (CPU + HW из `ffmpeg-hw-encoder-probe`).
 * Общий для renderer и main (без Node/Electron).
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import {
  createEmptyFfmpegHwEncodersSnapshot,
  FFMPEG_HW_VIDEO_ENCODER_IDS,
  type FfmpegHwEncodersProbeResult,
  type FfmpegHwEncodersSnapshot,
  type FfmpegHwVideoEncoderId
} from './ffmpeg-hw-encoder-probe'

const HW_SET = new Set<string>(FFMPEG_HW_VIDEO_ENCODER_IDS)

/** §16 — приоритет для `hw_auto` (лучший доступный H.264 HW, иначе CPU). */
const HW_AUTO_H264_PRIORITY: readonly FfmpegHwVideoEncoderId[] = [
  'h264_nvenc',
  'h264_amf',
  'h264_qsv',
  'h264_videotoolbox',
  'h264_vaapi'
]

export function isFfmpegHwExportVideoCodec(
  c: FfmpegExportVideoCodecId
): c is FfmpegHwVideoEncoderId {
  return HW_SET.has(c)
}

export function isFfmpegHwAutoVideoCodec(c: FfmpegExportVideoCodecId): c is 'hw_auto' {
  return c === 'hw_auto'
}

export function pickFfmpegHwAutoEncoder(
  snap: FfmpegHwEncodersSnapshot
): FfmpegHwVideoEncoderId | 'libx264' {
  for (const id of HW_AUTO_H264_PRIORITY) {
    if (snap[id]) {
      return id
    }
  }
  return 'libx264'
}

/** Подставить `hw_auto` по снимку `-encoders`; для остальных кодеков — как есть. */
export function resolveFfmpegExportVideoCodecForArgv(
  requested: FfmpegExportVideoCodecId,
  snap: FfmpegHwEncodersSnapshot
): Exclude<FfmpegExportVideoCodecId, 'hw_auto'> {
  if (requested === 'hw_auto') {
    return pickFfmpegHwAutoEncoder(snap)
  }
  return requested
}

export function parseFfmpegExportVideoCodec(raw: unknown): FfmpegExportVideoCodecId {
  if (raw === 'hw_auto') {
    return 'hw_auto'
  }
  if (raw === 'libx265') {
    return 'libx265'
  }
  if (typeof raw === 'string' && HW_SET.has(raw)) {
    return raw as FfmpegHwVideoEncoderId
  }
  return 'libx264'
}

export function probeSnapshotOrEmpty(
  probe: FfmpegHwEncodersProbeResult | null
): FfmpegHwEncodersSnapshot {
  if (probe?.ok === true) {
    return probe.snapshot
  }
  return createEmptyFfmpegHwEncodersSnapshot()
}
