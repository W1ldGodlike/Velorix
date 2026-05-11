/**
 * §9 — компактная метка цветопередачи HDR в «Сведения» видеодорожки.
 * Полные `color_*` остаются в колонках таблицы; здесь только короткий якорь для сканирования.
 */

function ffprobeColorTokenNorm(raw: string | undefined | null): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const s = raw.trim().toLowerCase()
  if (s === '' || s === 'unknown' || s === 'n/a') {
    return null
  }
  return s
}

export function formatFfprobeVideoHdrColorBrief(stream: {
  color_transfer?: string
  color_trc?: string
  color_primaries?: string
}): string | null {
  const transfer =
    ffprobeColorTokenNorm(stream.color_transfer) ?? ffprobeColorTokenNorm(stream.color_trc)
  const prim = ffprobeColorTokenNorm(stream.color_primaries)
  const isBt2020 = prim === 'bt2020'

  if (transfer === 'smpte2084') {
    return isBt2020 ? 'PQ·bt2020' : 'PQ'
  }
  if (transfer === 'arib-std-b67') {
    return isBt2020 ? 'HLG·bt2020' : 'HLG'
  }

  return null
}
