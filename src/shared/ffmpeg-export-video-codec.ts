/**
 * §7.2 / §16 — whitelist видеокодека экспорта (CPU + HW из `ffmpeg-hw-encoder-probe`).
 * Общий для renderer и main (без Node/Electron).
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'
import {
  FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_DNXHD_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_FFV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_RAV1E_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
} from './ffmpeg-export-contract'
import {
  buildFfmpegExportBenchmarkHardwareHintsFromHwProbe,
  filterFfmpegHwEncodersSnapshotForHardware
} from './ffmpeg-export-benchmark-hardware'
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

const MKV_ONLY_CPU_CODECS = new Set<FfmpegExportVideoCodecId>([
  'libvpx-vp9',
  'libsvtav1',
  'libaom-av1',
  'librav1e',
  'ffv1'
])

const MOV_ONLY_VIDEO_CODECS = new Set<FfmpegExportVideoCodecId>(['prores_ks', 'dnxhd'])

/** VP9/AV1 (CPU) в текущей модели экспорта допускаются только в MKV. */
export function cpuFfmpegVideoCodecRequiresMkv(codec: FfmpegExportVideoCodecId): boolean {
  return MKV_ONLY_CPU_CODECS.has(codec)
}

/** Кодеки, для которых в экспорте разрешён только MOV (spawn и превью). */
export function ffmpegExportVideoCodecRequiresMov(codec: FfmpegExportVideoCodecId): boolean {
  return MOV_ONLY_VIDEO_CODECS.has(codec)
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
  if (codec === 'librav1e') {
    return FFMPEG_EXPORT_RAV1E_MKV_ONLY_ERROR
  }
  if (codec === 'ffv1') {
    return FFMPEG_EXPORT_FFV1_MKV_ONLY_ERROR
  }
  return FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
}

export function exportMovOnlyCodecErrorMessage(codec: FfmpegExportVideoCodecId): string {
  if (codec === 'prores_ks') {
    return FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR
  }
  if (codec === 'dnxhd') {
    return FFMPEG_EXPORT_DNXHD_MOV_ONLY_ERROR
  }
  return FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR
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

/** CPU-замена выбранного HW-кодека, если его нет в снимке `-encoders` (§16 export resolve). */
export function ffmpegHwEncoderCpuFallback(codec: FfmpegHwVideoEncoderId): 'libx264' | 'libx265' {
  if (codec.startsWith('hevc_')) {
    return 'libx265'
  }
  return 'libx264'
}

/** stderr ffmpeg похож на сбой HW-энкодера (§16 — один повтор с CPU в `runFfmpegExportJob`). */
export function ffmpegExportSpawnFailureLooksLikeHwEncoder(error: string): boolean {
  const e = error.toLowerCase()
  return (
    /unknown encoder|encoder .* not found|error selecting an encoder|could not open encoder|cannot create encoder|no capable devices found|no device available|failed to initialize .*encoder|invalid data found when processing input.*nvenc/i.test(
      e
    ) || /\b(nvenc|amf|qsv|vaapi|videotoolbox)\b.*\b(error|failed|not found)\b/i.test(e)
  )
}

/** argv для повтора экспорта на CPU после сбоя HW (без `-hwaccel` и HW `-c:v`). */
export function ffmpegExportArgvParamsWithCpuFallback(
  base: FfmpegExportArgvParams,
  fallbackCodec: 'libx264' | 'libx265'
): FfmpegExportArgvParams {
  const { hwaccelDecode: _hwaccel, videoCodec: _codec, ...rest } = base
  void _hwaccel
  void _codec
  if (fallbackCodec === 'libx264') {
    return rest
  }
  return { ...rest, videoCodec: fallbackCodec }
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
  if (isFfmpegHwExportVideoCodec(requested) && !snap[requested]) {
    return ffmpegHwEncoderCpuFallback(requested)
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
  if (raw === 'librav1e') {
    return 'librav1e'
  }
  if (raw === 'prores_ks') {
    return 'prores_ks'
  }
  if (raw === 'dnxhd') {
    return 'dnxhd'
  }
  if (raw === 'ffv1') {
    return 'ffv1'
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

/** HW-кодеки без GPU под семейство отключены (`false`); CPU/`hw_auto` — по полному снимку. */
export function probeRunnableHwSnapshot(
  probe: FfmpegHwEncodersProbeResult | null
): FfmpegHwEncodersSnapshot {
  if (probe?.ok !== true) {
    return createEmptyFfmpegHwEncodersSnapshot()
  }
  return filterFfmpegHwEncodersSnapshotForHardware(
    probe.snapshot,
    buildFfmpegExportBenchmarkHardwareHintsFromHwProbe(probe)
  )
}
