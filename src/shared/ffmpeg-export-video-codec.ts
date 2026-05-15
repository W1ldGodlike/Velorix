/**
 * §7.2 / §16 — whitelist видеокодека экспорта (CPU + HW из `ffmpeg-hw-encoder-probe`).
 * Общий для renderer и main (без Node/Electron).
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
} from './ffmpeg-export-contract'
import {
  createEmptyFfmpegHwEncodersSnapshot,
  FFMPEG_HW_VIDEO_ENCODER_IDS,
  type FfmpegHwEncodersProbeResult,
  type FfmpegHwEncodersSnapshot,
  type FfmpegHwVideoEncoderId
} from './ffmpeg-hw-encoder-probe'

const HW_SET = new Set<string>(FFMPEG_HW_VIDEO_ENCODER_IDS)

/** §16 — приоритет для `hw_auto` (H.264 HW, затем AV1 HW, иначе CPU). */
const HW_AUTO_H264_PRIORITY: readonly FfmpegHwVideoEncoderId[] = [
  'h264_nvenc',
  'h264_amf',
  'h264_qsv',
  'h264_videotoolbox',
  'h264_vaapi'
]

const HW_AUTO_AV1_PRIORITY: readonly FfmpegHwVideoEncoderId[] = [
  'av1_nvenc',
  'av1_amf',
  'av1_qsv',
  'av1_vaapi'
]

/** §16 — `hw_auto_hevc`: HEVC HW, затем AV1 HW, иначе libx265. */
const HW_AUTO_HEVC_PRIORITY: readonly FfmpegHwVideoEncoderId[] = [
  'hevc_nvenc',
  'hevc_amf',
  'hevc_qsv',
  'hevc_videotoolbox',
  'hevc_vaapi'
]

const MKV_ONLY_CPU_CODECS = new Set<FfmpegExportVideoCodecId>(['libvpx-vp9', 'libsvtav1', 'libaom-av1'])

/** VP9/AV1 (CPU) в текущей модели экспорта допускаются только в MKV. */
export function cpuFfmpegVideoCodecRequiresMkv(codec: FfmpegExportVideoCodecId): boolean {
  return MKV_ONLY_CPU_CODECS.has(codec)
}

export function exportCpuCodecMkvOnlyErrorMessage(codec: FfmpegExportVideoCodecId): string {
  if (codec === 'libvpx-vp9') {
    return FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
  }
  if (codec === 'libsvtav1') {
    return FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR
  }
  if (codec === 'libaom-av1') {
    return FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR
  }
  return FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
}

export function isFfmpegHwExportVideoCodec(
  c: FfmpegExportVideoCodecId
): c is FfmpegHwVideoEncoderId {
  return HW_SET.has(c)
}

export type FfmpegHwAutoVideoCodecId = 'hw_auto' | 'hw_auto_hevc'

export function isFfmpegHwAutoVideoCodec(
  c: FfmpegExportVideoCodecId
): c is FfmpegHwAutoVideoCodecId {
  return c === 'hw_auto' || c === 'hw_auto_hevc'
}

export function pickFfmpegHwAutoEncoder(
  snap: FfmpegHwEncodersSnapshot
): FfmpegHwVideoEncoderId | 'libx264' {
  for (const id of HW_AUTO_H264_PRIORITY) {
    if (snap[id]) {
      return id
    }
  }
  for (const id of HW_AUTO_AV1_PRIORITY) {
    if (snap[id]) {
      return id
    }
  }
  return 'libx264'
}

export function pickFfmpegHwAutoHevcEncoder(
  snap: FfmpegHwEncodersSnapshot
): FfmpegHwVideoEncoderId | 'libx265' {
  for (const id of HW_AUTO_HEVC_PRIORITY) {
    if (snap[id]) {
      return id
    }
  }
  for (const id of HW_AUTO_AV1_PRIORITY) {
    if (snap[id]) {
      return id
    }
  }
  return 'libx265'
}

/** Подставить `hw_auto` / `hw_auto_hevc` по снимку `-encoders`; для остальных — как есть. */
export function resolveFfmpegExportVideoCodecForArgv(
  requested: FfmpegExportVideoCodecId,
  snap: FfmpegHwEncodersSnapshot
): Exclude<FfmpegExportVideoCodecId, 'hw_auto' | 'hw_auto_hevc'> {
  if (requested === 'hw_auto') {
    return pickFfmpegHwAutoEncoder(snap)
  }
  if (requested === 'hw_auto_hevc') {
    return pickFfmpegHwAutoHevcEncoder(snap)
  }
  return requested
}

export function parseFfmpegExportVideoCodec(raw: unknown): FfmpegExportVideoCodecId {
  if (raw === 'hw_auto_hevc') {
    return 'hw_auto_hevc'
  }
  if (raw === 'hw_auto') {
    return 'hw_auto'
  }
  if (raw === 'libx265') {
    return 'libx265'
  }
  if (raw === 'libvpx-vp9') {
    return 'libvpx-vp9'
  }
  if (raw === 'libsvtav1') {
    return 'libsvtav1'
  }
  if (raw === 'libaom-av1') {
    return 'libaom-av1'
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
