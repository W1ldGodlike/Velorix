/**
 * §9 — компактная сводка по `streams[].side_data_list` из ffprobe.
 *
 * ffprobe отдаёт side data как loosely typed JSON, поэтому этот модуль остаётся чистым
 * и консервативным: показываем только короткие подписи Dolby Vision/HDR и несколько
 * безопасных неизвестных типов, без попытки интерпретировать все поля стандарта.
 * Stereo 3D и ATSC Audio Service Type дают короткие подписи для видео и аудио.
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

function parseAtscAudioServiceType(
  o: Record<string, unknown>,
  key: string
): number | null {
  const raw = o[key]
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const n = Math.trunc(raw)
    return n >= 0 && n <= 7 ? n : null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (!/^\d{1,2}$/.test(t)) {
      return null
    }
    const n = Number.parseInt(t, 10)
    return n >= 0 && n <= 7 ? n : null
  }
  return null
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
  if (low.includes('spherical')) {
    return '360°'
  }
  if (low.includes('stereo') && low.includes('3d')) {
    return '3D'
  }
  if (low.includes('audio service type')) {
    const svc =
      parseAtscAudioServiceType(o, 'service_type') ??
      parseAtscAudioServiceType(o, 'audio_service_type')
    return svc !== null ? `ATSC svc ${svc}` : 'ATSC audio svc'
  }
  return shortSideDataType(type)
}

/**
 * Угол поворота из `Display Matrix` в `side_data_list` (ffprobe), если есть.
 * Тег `rotate` обрабатывается отдельно в `ffprobe-service` — здесь только matrix.
 */
export function extractFfprobeDisplayMatrixRotation(sideDataList: unknown): number | null {
  if (!Array.isArray(sideDataList)) {
    return null
  }
  for (const item of sideDataList) {
    const o = recordFromUnknown(item)
    if (o === null) {
      continue
    }
    const type = scalarToken(o, 'side_data_type')
    if (type === null || !/display\s*matrix/i.test(type)) {
      continue
    }
    const rot = o['rotation']
    if (typeof rot === 'number' && Number.isFinite(rot)) {
      return rot
    }
    if (typeof rot === 'string') {
      const n = Number.parseFloat(rot.trim().replace(',', '.'))
      return Number.isFinite(n) ? n : null
    }
  }
  return null
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
