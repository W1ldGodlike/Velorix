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

/** Маркер текущей позиции превью на шкале V1. */
export function buildPlayheadStyle(
  playheadSec: number | null | undefined,
  durationSec: number | null | undefined
): { left: string } | null {
  if (
    playheadSec == null ||
    durationSec == null ||
    !Number.isFinite(playheadSec) ||
    !Number.isFinite(durationSec) ||
    durationSec <= 0
  ) {
    return null
  }
  const pct = Math.min(100, Math.max(0, (playheadSec / durationSec) * 100))
  return { left: `${String(pct)}%` }
}

const TIMELINE_KEYBOARD_SEEK_FINE_SEC = 1
const TIMELINE_KEYBOARD_SEEK_COARSE_SEC = 5

/** Шаг seek по стрелкам на дорожке V1 (Shift = крупный шаг). */
export function timelineKeyboardSeekSec(
  key: string,
  shiftKey: boolean,
  currentSec: number,
  durationSec: number
): number | null {
  if (!Number.isFinite(durationSec) || durationSec <= 0 || !Number.isFinite(currentSec)) {
    return null
  }
  const delta = shiftKey ? TIMELINE_KEYBOARD_SEEK_COARSE_SEC : TIMELINE_KEYBOARD_SEEK_FINE_SEC
  if (key === 'ArrowLeft') {
    return Math.max(0, currentSec - delta)
  }
  if (key === 'ArrowRight') {
    return Math.min(durationSec, currentSec + delta)
  }
  return null
}
