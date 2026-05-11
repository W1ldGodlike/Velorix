function trimNumericLabel(s: string): string {
  if (!s.includes('.')) {
    return s
  }
  return s.replace(/\.?0+$/, '')
}

/**
 * Компактная длительность дорожки из ffprobe `duration` (секунды строкой).
 * Если задана длительность контейнера и совпадает с дорожкой — не дублируем.
 */
export function formatFfprobeStreamDurationDetail(
  raw: string | undefined,
  containerDurationSec: number | null
): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return null
  }
  const sec = Number.parseFloat(t.replace(',', '.'))
  if (!Number.isFinite(sec) || sec <= 0) {
    return null
  }
  if (
    containerDurationSec !== null &&
    Number.isFinite(containerDurationSec) &&
    containerDurationSec > 0 &&
    Math.abs(sec - containerDurationSec) < 0.05
  ) {
    return null
  }
  const label =
    sec >= 100
      ? trimNumericLabel(sec.toFixed(2))
      : sec >= 10
        ? trimNumericLabel(sec.toFixed(2))
        : Number.isInteger(sec)
          ? String(sec)
          : trimNumericLabel(sec.toFixed(3))
  return `dur ${label}s`
}
