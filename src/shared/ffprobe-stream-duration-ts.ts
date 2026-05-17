/**
 * §9 — `stream.duration_ts` (длительность в тиках time_base) в компактной строке detail.
 */

export function formatFfprobeStreamDurationTsDetail(
  durationTs: string | number | undefined
): string | null {
  if (typeof durationTs === 'number' && Number.isFinite(durationTs)) {
    const n = Math.trunc(durationTs)
    return n > 0 ? `dur_ts ${n}` : null
  }
  if (typeof durationTs === 'string') {
    const t = durationTs.trim()
    if (t.length === 0 || /^n\/a$/i.test(t)) {
      return null
    }
    const n = Number.parseFloat(t.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) {
      return null
    }
    return `dur_ts ${Math.trunc(n)}`
  }
  return null
}
