import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import { formatFfprobeEditorVideoFactLine } from '../../../shared/ffprobe-container-format'
import { snapSeekTimeSec } from '../../../shared/video-frame-snap'
import { uiText, uiTextVars } from '../locales/ui-text'

export const MIN_TRIM_GAP_SEC = 0.05

export const TIMELINE_ZOOM_MAX = 8
/** Минимальное смещение указателя (px), после которого жест считается выделением In–Out, а не щелчком. */
export const TRIM_DRAG_THRESHOLD_PX = 4
/** Зона нажатия у вертикали маркера In/Out (ручка), от края выделения в px. */
export const TRIM_HANDLE_HIT_PX = 11

export function formatTimelineTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) {
    return '0:00'
  }
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  const pad = (n: number): string => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/** Время для бейджей In/Out и длительности фрагмента — с миллисекундами (m:ss.mmm или h:mm:ss.mmm). */
export function formatTimelineTimeWithMs(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) {
    return '0:00.000'
  }
  const ms = Math.floor(sec * 1000) % 1000
  const whole = Math.floor(sec)
  const s = whole % 60
  const m = Math.floor(whole / 60) % 60
  const h = Math.floor(whole / 3600)
  const pad2 = (n: number): string => n.toString().padStart(2, '0')
  const pad3 = (n: number): string => n.toString().padStart(3, '0')
  const frac = pad3(ms)
  return h > 0 ? `${h}:${pad2(m)}:${pad2(s)}.${frac}` : `${m}:${pad2(s)}.${frac}`
}

export function minEffectiveTrimGap(duration: number): number {
  return Math.min(MIN_TRIM_GAP_SEC, Math.max(duration * 0.002, 1 / 60))
}

export function approxVideoFpsFromProbe(probe: MediaProbeSuccess | null): number | null {
  if (!probe) {
    return null
  }
  const fromProbe = probe.videoFpsApprox
  if (fromProbe !== null && Number.isFinite(fromProbe) && fromProbe > 0 && fromProbe < 1000) {
    return fromProbe
  }
  const row = probe.tracks.find((t) => t.kind === 'video')
  if (!row) {
    return null
  }
  const mm = /(\d+(?:\.\d+)?)\s*(?:fps|к\/с)\b/i.exec(row.detail)
  if (!mm?.[1]) {
    return null
  }
  const v = Number(mm[1])
  if (!Number.isFinite(v) || v <= 0 || v >= 1000) {
    return null
  }
  return v
}

export function formatProbeVideoFact(probe: MediaProbeSuccess | null): string {
  return formatFfprobeEditorVideoFactLine(probe, uiText('uiPlaceholderDash'))
}

export function formatProbeAudioFact(probe: MediaProbeSuccess | null): string {
  if (!probe) {
    return uiText('uiPlaceholderDash')
  }
  if (probe.audioCodec && probe.audioCodec.trim().length > 0) {
    return probe.audioCodec
  }
  const row = probe.tracks.find((t) => t.kind === 'audio')
  return row?.codec ?? uiText('uiPlaceholderDash')
}

export function formatProbePositionLine(
  currentSec: number,
  durationSec: number,
  fps: number | null
): string {
  const base = `${formatTimelineTime(currentSec)} / ${formatTimelineTime(durationSec)}`
  if (fps !== null && durationSec > 0 && Number.isFinite(currentSec)) {
    const snapped = snapSeekTimeSec(currentSec, durationSec, fps)
    const f = Math.round(snapped * fps)
    const fMax = Math.max(0, Math.round(snapSeekTimeSec(durationSec, durationSec, fps) * fps))
    const frame = Math.min(Math.max(f, 0), fMax)
    return `${base}${uiTextVars('videoTimelineFrameApproxSuffixTemplate', { frame })}`
  }
  return base
}

export function clampTrimRange(
  inSec: number,
  outSec: number,
  duration: number
): { inSec: number; outSec: number } {
  if (!Number.isFinite(duration) || duration <= 0) {
    return { inSec: 0, outSec: 0 }
  }
  let a = Math.min(Math.max(0, inSec), duration)
  let b = Math.min(Math.max(0, outSec), duration)
  if (b < a) {
    ;[a, b] = [b, a]
  }
  const minGap = minEffectiveTrimGap(duration)
  if (b - a < minGap) {
    b = Math.min(duration, a + minGap)
    if (b > duration - 1e-6) {
      a = Math.max(0, b - minGap)
    }
  }
  return { inSec: a, outSec: b }
}
