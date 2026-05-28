import type { MediaExportTrimPayload } from '../../../shared/ffmpeg-export-contract'

/** Маркер In на текущей позиции; Out сохраняется или до конца клипа. */
export function applyExportTrimIn(
  currentSec: number,
  durationSec: number,
  prev: MediaExportTrimPayload | null
): MediaExportTrimPayload | null {
  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    return null
  }
  const outSec = prev?.outSec ?? durationSec
  if (outSec <= currentSec) {
    return null
  }
  return { inSec: currentSec, outSec }
}

/** Маркер Out на текущей позиции; In сохраняется или с 0. */
export function applyExportTrimOut(
  currentSec: number,
  prev: MediaExportTrimPayload | null
): MediaExportTrimPayload | null {
  const inSec = prev?.inSec ?? 0
  if (currentSec <= inSec) {
    return null
  }
  return { inSec, outSec: currentSec }
}

/** Подсветка диапазона In–Out на слайдере позиции превью. */
export function buildSeekTrimTrackBackground(
  trim: MediaExportTrimPayload | null,
  durationSec: number
): string | null {
  if (trim == null || !Number.isFinite(durationSec) || durationSec <= 0) {
    return null
  }
  const leftPct = Math.min(100, Math.max(0, (trim.inSec / durationSec) * 100))
  const rightPct = Math.min(100, Math.max(leftPct, (trim.outSec / durationSec) * 100))
  const accent = 'color-mix(in srgb, var(--fa-accent) 38%, transparent)'
  return `linear-gradient(to right, transparent 0%, transparent ${String(leftPct)}%, ${accent} ${String(leftPct)}%, ${accent} ${String(rightPct)}%, transparent ${String(rightPct)}%, transparent 100%)`
}
