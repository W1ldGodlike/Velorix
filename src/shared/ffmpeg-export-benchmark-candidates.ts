/**
 * §16 — список кодеров для бенчмарка: CPU libx264 + по одному H.264 HW на семейство.
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import {
  isFfmpegHwEncoderFamilyRunnableInBenchmark,
  type FfmpegExportBenchmarkHardwareHints
} from './ffmpeg-export-benchmark-hardware'
import type { FfmpegHwEncodersSnapshot, FfmpegHwVideoEncoderId } from './ffmpeg-hw-encoder-probe'
import {
  FFMPEG_HW_VIDEO_ENCODER_SELECT_ORDER,
  getFfmpegHwEncoderFamily
} from './ffmpeg-export-hw-codec-ui'
import { FFMPEG_EXPORT_BENCHMARK_MAX_CANDIDATES } from './ffmpeg-export-benchmark-contract'

export function buildFfmpegExportBenchmarkCandidates(
  snapshot: FfmpegHwEncodersSnapshot | null | undefined,
  hardware?: FfmpegExportBenchmarkHardwareHints
): FfmpegExportVideoCodecId[] {
  const out: FfmpegExportVideoCodecId[] = ['libx264']
  if (!snapshot) {
    return out
  }
  const familiesSeen = new Set<string>()
  for (const id of FFMPEG_HW_VIDEO_ENCODER_SELECT_ORDER) {
    if (!snapshot[id as FfmpegHwVideoEncoderId]) {
      continue
    }
    if (!id.startsWith('h264_')) {
      continue
    }
    const fam = getFfmpegHwEncoderFamily(id)
    if (familiesSeen.has(fam)) {
      continue
    }
    if (hardware !== undefined && !isFfmpegHwEncoderFamilyRunnableInBenchmark(fam, hardware)) {
      continue
    }
    familiesSeen.add(fam)
    out.push(id)
    if (out.length >= FFMPEG_EXPORT_BENCHMARK_MAX_CANDIDATES) {
      break
    }
  }
  return out
}
