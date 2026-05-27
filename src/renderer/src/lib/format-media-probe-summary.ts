import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'

function formatDurationSec(sec: number): string {
  const total = Math.max(0, Math.floor(sec))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Одна строка для бейджа превью ref.1 после ffprobe. */
export function formatMediaProbeSummary(probe: MediaProbeSuccess): string {
  const parts: string[] = []
  if (probe.video != null) {
    parts.push(`${probe.video.width}×${probe.video.height}`)
    parts.push(probe.video.codec)
  }
  if (probe.videoFpsApprox != null && Number.isFinite(probe.videoFpsApprox)) {
    parts.push(`${probe.videoFpsApprox.toFixed(2)} fps`)
  }
  if (probe.durationSec != null && Number.isFinite(probe.durationSec)) {
    parts.push(formatDurationSec(probe.durationSec))
  }
  if (probe.formatName != null && probe.formatName.length > 0) {
    parts.push(probe.formatName)
  }
  return parts.length > 0 ? parts.join(' · ') : 'Медиа'
}
