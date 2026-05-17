/**
 * §9 — `time_base` stream/format: пропуск тривиальных `0/1` и `1/1`.
 */

export function parseFfprobeNontrivialTimeBase(raw: string | undefined): string | null {
  const tb = typeof raw === 'string' ? raw.trim() : ''
  if (tb.length === 0 || /^n\/a$/i.test(tb)) {
    return null
  }
  const norm = tb.replace(/\s+/g, '')
  if (norm === '0/1' || norm === '1/1') {
    return null
  }
  return tb
}

/** `stream.time_base` в detail, если не показан вместе с `start_pts`. */
export function formatFfprobeStreamTimeBaseDetail(
  timeBase: string | undefined,
  timeBaseAlreadyShown: boolean
): string | null {
  if (timeBaseAlreadyShown) {
    return null
  }
  const tb = parseFfprobeNontrivialTimeBase(timeBase)
  return tb === null ? null : `tb ${tb}`
}

/** `format.time_base` в краткой сводке инспектора. */
export function formatFfprobeContainerTimeBaseCompact(timeBase: string | null): string | null {
  return timeBase === null ? null : `tb ${timeBase}`
}
