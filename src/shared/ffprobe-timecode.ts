/** §9 — отображение времени глав и экспорта сводки (секунды из ffprobe → таймкод). */

export function formatProbeChapterTimecode(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) {
    return '—'
  }
  const s = Math.floor(sec)
  const subMs = Math.round((sec - s) * 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const pad = (n: number): string => String(n).padStart(2, '0')
  const core = h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`
  if (subMs > 0) {
    return `${core}.${String(subMs).padStart(3, '0')}`
  }
  return core
}
