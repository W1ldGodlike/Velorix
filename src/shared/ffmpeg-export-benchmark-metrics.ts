/**
 * §16 — метрики бенчмарка из stderr ffmpeg (`-stats`).
 */

import { parseFfmpegSpeedToken } from './ffmpeg-export-progress-parse'

export function parseFfmpegFpsToken(line: string): number | null {
  const m = line.match(/\bfps=\s*([\d.]+)/)
  if (!m) {
    return null
  }
  const n = Number(m[1])
  return Number.isFinite(n) && n > 0 ? n : null
}

export function collectFfmpegBenchmarkStatsFromStderr(text: string): {
  avgFps: number | null
  lastSpeed: string | null
} {
  let lastFps: number | null = null
  let lastSpeed: string | null = null
  for (const rawLine of text.split(/\r?\n/)) {
    const fps = parseFfmpegFpsToken(rawLine)
    if (fps !== null) {
      lastFps = fps
    }
    const spd = parseFfmpegSpeedToken(rawLine)
    if (spd !== null) {
      lastSpeed = spd
    }
  }
  return { avgFps: lastFps, lastSpeed }
}

export function estimateFfmpegBenchmarkFullEncodeSec(
  elapsedMs: number,
  sampleSec: number,
  fullDurationSec: number
): number | null {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return null
  }
  if (!Number.isFinite(sampleSec) || sampleSec <= 0.05) {
    return null
  }
  if (!Number.isFinite(fullDurationSec) || fullDurationSec <= 0) {
    return null
  }
  return (elapsedMs / 1000) * (fullDurationSec / sampleSec)
}

export function formatFfmpegBenchmarkBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '—'
  }
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`
}

/** ETA для всего файла: `m:ss` или `Ns` если короче минуты. */
export function formatFfmpegBenchmarkEtaMmSs(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec) || sec < 0) {
    return '—'
  }
  const total = Math.round(sec)
  if (total < 60) {
    return `${total}s`
  }
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
