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
