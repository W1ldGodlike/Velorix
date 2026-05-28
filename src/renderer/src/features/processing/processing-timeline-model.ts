import type { MediaExportTrimPayload } from '../../../../shared/ffmpeg-export-contract'

export const PROCESSING_TIMELINE_LANES: Array<{ id: string; clip?: string }> = [
  { id: 'V1', clip: 'city_night_4k.mp4' },
  { id: 'V2', clip: 'drive_sequence.mov' },
  { id: 'V3', clip: 'neon_building.mp4' },
  { id: 'A1', clip: 'music_background.mp3' },
  { id: 'A2', clip: 'ambience_city.wav' }
]

export function buildTrimSpanStyle(
  trim: MediaExportTrimPayload | null,
  durationSec: number | null | undefined
): { left: string; width: string } | null {
  if (trim == null || durationSec == null || !Number.isFinite(durationSec) || durationSec <= 0) {
    return null
  }
  const leftPct = Math.min(100, Math.max(0, (trim.inSec / durationSec) * 100))
  const rightPct = Math.min(100, Math.max(leftPct, (trim.outSec / durationSec) * 100))
  return { left: `${String(leftPct)}%`, width: `${String(rightPct - leftPct)}%` }
}

/** Позиция на шкале таймлайна по клику (0…duration). */
export function timelineSecFromPointer(
  clientX: number,
  rect: Pick<DOMRect, 'left' | 'width'>,
  durationSec: number
): number | null {
  if (!Number.isFinite(durationSec) || durationSec <= 0 || rect.width <= 0) {
    return null
  }
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  return ratio * durationSec
}
