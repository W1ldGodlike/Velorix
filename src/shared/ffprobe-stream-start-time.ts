/**
 * Компактная подпись смещения начала дорожки из ffprobe `start_time` (секунды строкой).
 * Нулевое / N/A / нечисловое — не показываем.
 */
export function formatFfprobeStreamStartTime(raw: string | undefined): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return null
  }
  const sec = Number.parseFloat(t.replace(',', '.'))
  if (!Number.isFinite(sec) || Math.abs(sec) < 0.0005) {
    return null
  }
  const sign = sec > 0 ? '+' : '−'
  const abs = Math.abs(sec)
  if (abs < 1) {
    const ms = Math.round(sec * 1000)
    if (ms === 0) {
      return null
    }
    return `start ${ms > 0 ? '+' : '−'}${Math.abs(ms)}ms`
  }
  let s = abs.toFixed(3)
  s = s.replace(/0+$/, '').replace(/\.$/, '')
  return `start ${sign}${s}s`
}
