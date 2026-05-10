/** Парсинг ffprobe `avg_frame_rate` / `r_frame_rate` вида `24000/1001`, `30/1`, отсекая `0/0`. */
export function parseFfprobeRationalFps(rate: string | undefined): number | null {
  if (!rate || rate === '0/0') {
    return null
  }
  const parts = rate.split('/')
  if (parts.length !== 2) {
    return null
  }
  const a = Number(parts[0])
  const b = Number(parts[1])
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) {
    return null
  }
  const q = a / b
  return Number.isFinite(q) && q > 0 ? q : null
}

/** Если ffprobe даёт только `nb_frames` и есть длительность контейнера — грубая оценка fps. */
export function inferVideoFpsFromNbFrames(
  nbFrames: string | undefined,
  durationSec: number | null
): number | null {
  if (durationSec === null || !Number.isFinite(durationSec) || durationSec <= 0.05) {
    return null
  }
  if (typeof nbFrames !== 'string' || nbFrames.trim() === '') {
    return null
  }
  const n = Number.parseInt(nbFrames.trim(), 10)
  if (!Number.isFinite(n) || n < 2) {
    return null
  }
  const q = n / durationSec
  return q > 0 && q < 1000 ? q : null
}

/** Оценка FPS первого видеопотока для UI (§1.1 снап кадра и сводки). */
export function resolveVideoFpsApprox(params: {
  avgFrameRate?: string
  rFrameRate?: string
  nbFrames?: string
  durationSec: number | null
}): number | null {
  const fromRate =
    parseFfprobeRationalFps(params.avgFrameRate) ?? parseFfprobeRationalFps(params.rFrameRate)
  if (fromRate !== null && fromRate > 0 && fromRate < 1000) {
    return fromRate
  }
  return inferVideoFpsFromNbFrames(params.nbFrames, params.durationSec)
}
