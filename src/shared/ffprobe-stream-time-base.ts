/**
 * §9 — `stream.time_base` в detail, если не показан вместе с `start_pts`.
 */

export function formatFfprobeStreamTimeBaseDetail(
  timeBase: string | undefined,
  timeBaseAlreadyShown: boolean
): string | null {
  if (timeBaseAlreadyShown) {
    return null
  }
  const tb = typeof timeBase === 'string' ? timeBase.trim() : ''
  if (tb.length === 0 || /^n\/a$/i.test(tb)) {
    return null
  }
  const norm = tb.replace(/\s+/g, '')
  if (norm === '0/1' || norm === '1/1') {
    return null
  }
  return `tb ${tb}`
}
