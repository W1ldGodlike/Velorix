import type { MediaProbeResult } from '../shared/ffprobe-contract'

/** §7.6 — длительность для расписания кадров: из запроса или ffprobe. */
export async function resolveFfmpegFramesExtractDurationSec(params: {
  durationSecFromClient: number
  probeMedia: () => Promise<MediaProbeResult>
}): Promise<{ ok: true; durationSec: number } | { ok: false; error: string }> {
  let duration = Number.isFinite(params.durationSecFromClient)
    ? Math.max(0, params.durationSecFromClient)
    : 0
  if (duration >= 0.05) {
    return { ok: true, durationSec: duration }
  }
  const probe = await params.probeMedia()
  if (!probe.ok) {
    return { ok: false, error: probe.error }
  }
  duration = probe.durationSec ?? 0
  if (duration < 0.05) {
    return { ok: false, error: 'duration_too_short' }
  }
  return { ok: true, durationSec: duration }
}
