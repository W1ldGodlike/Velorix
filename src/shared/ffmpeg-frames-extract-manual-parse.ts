/** Парсинг списка временных меток для режима manual §7.6. */

const MANUAL_TIME_SEP = /[,;\n]+/

export function parseFfmpegManualTimesText(text: string): number[] {
  const trimmed = text.trim()
  if (trimmed.length === 0) {
    return []
  }
  const times: number[] = []
  for (const part of trimmed.split(MANUAL_TIME_SEP)) {
    const token = part.trim()
    if (token.length === 0) {
      continue
    }
    const n = Number.parseFloat(token.replace(',', '.'))
    if (Number.isFinite(n) && n >= 0) {
      times.push(n)
    }
  }
  return times
}
