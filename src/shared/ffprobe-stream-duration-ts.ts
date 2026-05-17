/**
 * §9 — `duration_ts` (тики time_base) для stream/format в detail и контейнере.
 */

export function parseFfprobeTickCount(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const n = Math.trunc(raw)
    return n > 0 ? n : null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t.length === 0 || /^n\/a$/i.test(t)) {
      return null
    }
    const n = Number.parseFloat(t.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) {
      return null
    }
    return Math.trunc(n)
  }
  return null
}

export function formatFfprobeStreamDurationTsDetail(
  durationTs: string | number | undefined
): string | null {
  const n = parseFfprobeTickCount(durationTs)
  return n === null ? null : `dur_ts ${n}`
}
