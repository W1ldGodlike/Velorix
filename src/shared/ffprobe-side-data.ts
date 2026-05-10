/**
 * §9 — компактная сводка по `streams[].side_data_list` из ffprobe.
 *
 * ffprobe отдаёт side data как loosely typed JSON, поэтому этот модуль остаётся чистым
 * и консервативным: показываем только короткие подписи Dolby Vision/HDR и несколько
 * безопасных неизвестных типов, без попытки интерпретировать все поля стандарта.
 */

function recordFromUnknown(raw: unknown): Record<string, unknown> | null {
  return raw !== null && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null
}

function scalarToken(o: Record<string, unknown>, key: string): string | null {
  const v = o[key]
  if (typeof v === 'number' && Number.isFinite(v)) {
    return String(v)
  }
  if (typeof v === 'string') {
    const t = v.trim()
    if (t.length > 0 && t.length <= 48) {
      return t.replace(/\s+/g, ' ')
    }
  }
  return null
}

function shortSideDataType(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, 64)
}

function summarizeDolbyVision(o: Record<string, unknown>): string {
  const profile = scalarToken(o, 'dv_profile')
  const level = scalarToken(o, 'dv_level')
  const compat = scalarToken(o, 'dv_bl_signal_compatibility_id')
  const parts = ['Dolby Vision']
  if (profile !== null) {
    parts.push(`profile ${profile}`)
  }
  if (level !== null) {
    parts.push(`level ${level}`)
  }
  if (compat !== null) {
    parts.push(`compat ${compat}`)
  }
  return parts.join(' ')
}

function summarizeMasteringDisplay(o: Record<string, unknown>): string {
  const minLum = scalarToken(o, 'min_luminance')
  const maxLum = scalarToken(o, 'max_luminance')
  if (minLum !== null || maxLum !== null) {
    return `HDR mastering ${minLum ?? '?'}-${maxLum ?? '?'} cd/m2`
  }
  return 'HDR mastering display'
}

function summarizeContentLight(o: Record<string, unknown>): string {
  const maxContent = scalarToken(o, 'max_content')
  const maxAverage = scalarToken(o, 'max_average')
  if (maxContent !== null || maxAverage !== null) {
    return `HDR CLL ${maxContent ?? '?'}/${maxAverage ?? '?'} nits`
  }
  return 'HDR content light'
}

function summarizeSideDataItem(raw: unknown): string | null {
  const o = recordFromUnknown(raw)
  if (o === null) {
    return null
  }
  const type = scalarToken(o, 'side_data_type')
  if (type === null) {
    return null
  }
  const low = type.toLowerCase()
  if (low.includes('dovi') || low.includes('dolby vision')) {
    return summarizeDolbyVision(o)
  }
  if (low.includes('mastering display')) {
    return summarizeMasteringDisplay(o)
  }
  if (low.includes('content light')) {
    return summarizeContentLight(o)
  }
  if (low.includes('ambient viewing')) {
    return 'HDR ambient viewing'
  }
  return shortSideDataType(type)
}

export function summarizeFfprobeSideDataList(raw: unknown): string | null {
  if (!Array.isArray(raw)) {
    return null
  }
  const out: string[] = []
  for (const item of raw) {
    const label = summarizeSideDataItem(item)
    if (label === null || out.includes(label)) {
      continue
    }
    out.push(label)
    if (out.length >= 4) {
      break
    }
  }
  return out.length > 0 ? out.join(' · ') : null
}
