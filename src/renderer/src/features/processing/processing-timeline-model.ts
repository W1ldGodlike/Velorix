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
  if (key === 'Home') {
    return 0
  }
  if (key === 'End') {
    return durationSec
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

export type TimelineRulerMark = {
  left: string
  sec: number
}

export const TIMELINE_ZOOM_MIN = 1
export const TIMELINE_ZOOM_MAX = 4

/** Дискретный zoom таймлайна ref.1 (1 = весь файл, 4 = крупный масштаб). */
export function clampTimelineZoom(value: number): number {
  if (!Number.isFinite(value)) {
    return TIMELINE_ZOOM_MIN
  }
  return Math.min(TIMELINE_ZOOM_MAX, Math.max(TIMELINE_ZOOM_MIN, Math.round(value)))
}

/** Число делений шкалы растёт с zoom (больше меток при увеличении). */
export function timelineRulerTickCountForZoom(zoom: number): number {
  const z = clampTimelineZoom(zoom)
  return 3 + (z - 1) * 2
}

/** Минимальная ширина дорожек в % видимой области (горизонтальный scroll). */
export function buildTimelineZoomTrackMinWidthPercent(zoom: number): string {
  return `${String(clampTimelineZoom(zoom) * 100)}%`
}

/** Горячие клавиши масштаба таймлайна: -, +, 0 (reset), PageUp/PageDown. */
export function timelineKeyboardZoomLevel(key: string, currentZoom: number): number | null {
  const zoom = clampTimelineZoom(currentZoom)
  if (
    key === '-' ||
    key === '_' ||
    key === 'Subtract' ||
    key === 'NumpadSubtract' ||
    key === 'PageDown'
  ) {
    return clampTimelineZoom(zoom - 1)
  }
  if (key === '=' || key === '+' || key === 'Add' || key === 'NumpadAdd' || key === 'PageUp') {
    return clampTimelineZoom(zoom + 1)
  }
  if (key === '0' || key === 'Digit0' || key === 'Numpad0') {
    return TIMELINE_ZOOM_MIN
  }
  return null
}

/**
 * Zoom по колесу: Ctrl/Meta + wheel.
 * Вверх (deltaY < 0) = увеличить, вниз = уменьшить.
 */
export function timelineWheelZoomLevel(deltaY: number, currentZoom: number): number {
  if (!Number.isFinite(deltaY) || deltaY === 0) {
    return clampTimelineZoom(currentZoom)
  }
  const delta = deltaY < 0 ? 1 : -1
  return clampTimelineZoom(currentZoom + delta)
}

/** Метки шкалы 0…duration для ref.1 (без форматирования времени — в UI). */
export function buildTimelineRulerMarks(
  durationSec: number | null | undefined,
  tickCount = 5
): TimelineRulerMark[] {
  if (durationSec == null || !Number.isFinite(durationSec) || durationSec <= 0 || tickCount < 2) {
    return []
  }
  const marks: TimelineRulerMark[] = []
  for (let i = 0; i < tickCount; i++) {
    const ratio = i / (tickCount - 1)
    marks.push({
      left: `${String(ratio * 100)}%`,
      sec: ratio * durationSec
    })
  }
  return marks
}
