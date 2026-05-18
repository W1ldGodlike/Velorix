import {
  FFMPEG_FRAMES_EXTRACT_MAX_FRAMES,
  FFMPEG_FRAMES_EXTRACT_MIN_INTERVAL_SEC,
  type FfmpegFramesExtractModeId
} from './ffmpeg-frames-extract-contract'

export function buildFfmpegFrameExtractTimestamps(params: {
  durationSec: number
  mode: FfmpegFramesExtractModeId
  intervalSec: number | null
  frameCount: number | null
  manualTimesSec: number[] | null
}): { ok: true; times: number[] } | { ok: false; error: string } {
  const duration = Number.isFinite(params.durationSec) ? Math.max(0, params.durationSec) : 0
  if (duration < 0.05) {
    return { ok: false, error: 'duration_too_short' }
  }

  let times: number[] = []

  if (params.mode === 'manual') {
    const raw = params.manualTimesSec
    if (!Array.isArray(raw) || raw.length === 0) {
      return { ok: false, error: 'invalid_manual' }
    }
    const seen = new Set<number>()
    for (const t of raw) {
      if (typeof t !== 'number' || !Number.isFinite(t) || t < 0) {
        continue
      }
      const clamped = Math.min(Math.max(0, t), duration)
      const key = Math.round(clamped * 1000)
      seen.add(key)
    }
    times = [...seen].sort((a, b) => a - b).map((ms) => ms / 1000)
    if (times.length === 0) {
      return { ok: false, error: 'invalid_manual' }
    }
    if (times.length > FFMPEG_FRAMES_EXTRACT_MAX_FRAMES) {
      return { ok: false, error: 'too_many_frames' }
    }
  } else if (params.mode === 'interval') {
    const step =
      typeof params.intervalSec === 'number' && Number.isFinite(params.intervalSec)
        ? Math.max(FFMPEG_FRAMES_EXTRACT_MIN_INTERVAL_SEC, params.intervalSec)
        : 1
    for (let t = 0; t <= duration + 1e-6; t += step) {
      times.push(Math.min(t, duration))
      if (times.length > FFMPEG_FRAMES_EXTRACT_MAX_FRAMES) {
        return { ok: false, error: 'too_many_frames' }
      }
    }
  } else {
    const count =
      typeof params.frameCount === 'number' && Number.isFinite(params.frameCount)
        ? Math.floor(params.frameCount)
        : 0
    if (count < 1) {
      return { ok: false, error: 'invalid_count' }
    }
    if (count > FFMPEG_FRAMES_EXTRACT_MAX_FRAMES) {
      return { ok: false, error: 'too_many_frames' }
    }
    if (count === 1) {
      times = [0]
    } else {
      for (let i = 0; i < count; i += 1) {
        times.push((duration * i) / (count - 1))
      }
    }
  }

  if (times.length === 0) {
    times = [0]
  }

  return { ok: true, times }
}
