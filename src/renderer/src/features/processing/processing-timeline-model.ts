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
