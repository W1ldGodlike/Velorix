/**
 * Снап секунды к ближайшей границе кадра по известному fps (обычно оценка из ffprobe).
 * Без fps — только clamp к [0, duration−epsilon], как у `<video>` seek в редакторе.
 */
export function snapSeekTimeSec(
  sec: number,
  duration: number,
  fps: number | null | undefined,
  epsilonSec = 0.02
): number {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0
  }
  const maxT = Math.max(0, duration - epsilonSec)
  if (!Number.isFinite(sec)) {
    return 0
  }
  const capped = Math.min(Math.max(sec, 0), maxT)

  if (fps === undefined || fps === null || !Number.isFinite(fps) || fps <= 0 || fps >= 1000) {
    return capped
  }

  const fd = 1 / fps
  let n = Math.round(capped / fd)
  let snapped = n * fd

  if (snapped > maxT) {
    n = Math.max(0, Math.floor(maxT / fd))
    snapped = n * fd
  }
  return Math.min(Math.max(snapped, 0), maxT)
}
