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

/**
 * Компактная подсказка по диапазону яркости (JPEG/full swing) в «Сведения», только для не-HDR:
 * колонка `color_range` в таблице остаётся источником полного значения.
 */
export function formatFfprobeVideoFullRangeBrief(stream: {
  color_range?: string
  color_transfer?: string
  color_trc?: string
  color_primaries?: string
}): string | null {
  if (formatFfprobeVideoHdrColorBrief(stream) !== null) {
    return null
  }
  const r = ffprobeColorTokenNorm(stream.color_range)
  if (r === 'pc' || r === 'jpeg') {
    return 'full range'
  }
  return null
}

/**
 * Не-HDR: компактно подсветить нестандартные `color_primaries` / `color_space` (всё кроме типичного bt709).
 * Полные значения остаются в колонках таблицы; здесь — короткая склейка для «Сведения».
 */
export function formatFfprobeVideoSdGamutBrief(stream: {
  color_transfer?: string
  color_trc?: string
  color_primaries?: string
  color_space?: string
}): string | null {
  if (formatFfprobeVideoHdrColorBrief(stream) !== null) {
    return null
  }
  const prim = ffprobeColorTokenNorm(stream.color_primaries)
  const space = ffprobeColorTokenNorm(stream.color_space)
  const parts: string[] = []
  if (prim && prim !== 'bt709') {
    parts.push(prim)
  }
  if (space && space !== 'bt709' && space !== prim) {
    parts.push(space)
  }
  if (parts.length === 0) {
    return null
  }
  return parts.join('·')
}
