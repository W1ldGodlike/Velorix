/**
 * §16 — выбор рекомендованного кодера по результатам бенчмарка.
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import type { FfmpegExportBenchmarkRow } from './ffmpeg-export-benchmark-contract'

export function ffmpegExportBenchmarkEffectiveLoadPeakPercent(
  row: Pick<FfmpegExportBenchmarkRow, 'cpuLoadPeakPercent' | 'gpuLoadPeakPercent'>
): number | null {
  const peaks: number[] = []
  if (row.cpuLoadPeakPercent !== null && Number.isFinite(row.cpuLoadPeakPercent)) {
    peaks.push(row.cpuLoadPeakPercent)
  }
  if (row.gpuLoadPeakPercent !== null && Number.isFinite(row.gpuLoadPeakPercent)) {
    peaks.push(row.gpuLoadPeakPercent)
  }
  if (peaks.length === 0) {
    return null
  }
  return Math.max(...peaks)
}

function rowUnderLoadThreshold(row: FfmpegExportBenchmarkRow, thresholdPercent: number): boolean {
  if (!row.ok) {
    return false
  }
  const peak = ffmpegExportBenchmarkEffectiveLoadPeakPercent(row)
  if (peak === null) {
    return true
  }
  return peak <= thresholdPercent
}

function pickFastestRow(
  rows: readonly FfmpegExportBenchmarkRow[]
): FfmpegExportBenchmarkRow | null {
  let best: FfmpegExportBenchmarkRow | null = null
  for (const row of rows) {
    if (!row.ok || row.elapsedMs === null) {
      continue
    }
    if (best === null) {
      best = row
      continue
    }
    const bestMs = best.elapsedMs ?? Number.POSITIVE_INFINITY
    const rowMs = row.elapsedMs
    if (rowMs < bestMs) {
      best = row
      continue
    }
    if (rowMs === bestMs) {
      const bestFps = best.avgFps ?? 0
      const rowFps = row.avgFps ?? 0
      if (rowFps > bestFps) {
        best = row
      }
    }
  }
  return best
}

export type FfmpegExportBenchmarkRecommendation = {
  codec: FfmpegExportVideoCodecId
  ignoredLoadThreshold: boolean
}

export function pickFfmpegExportBenchmarkRecommended(
  rows: readonly FfmpegExportBenchmarkRow[],
  loadThresholdPercent: number
): FfmpegExportBenchmarkRecommendation | null {
  const okRows = rows.filter((r) => r.ok && r.elapsedMs !== null)
  if (okRows.length === 0) {
    return null
  }
  const underThreshold = okRows.filter((r) => rowUnderLoadThreshold(r, loadThresholdPercent))
  const pool = underThreshold.length > 0 ? underThreshold : okRows
  const best = pickFastestRow(pool)
  if (best === null) {
    return null
  }
  return {
    codec: best.videoCodec,
    ignoredLoadThreshold: underThreshold.length === 0
  }
}

/** @deprecated Use pickFfmpegExportBenchmarkRecommended */
export function pickFfmpegExportBenchmarkRecommendedCodec(
  rows: readonly FfmpegExportBenchmarkRow[]
): FfmpegExportVideoCodecId | null {
  return pickFfmpegExportBenchmarkRecommended(rows, 100)?.codec ?? null
}

export function ffmpegExportBenchmarkOnlyAvailable(
  rows: readonly FfmpegExportBenchmarkRow[]
): boolean {
  return rows.filter((r) => r.ok).length <= 1
}
