/**
 * §9 — компактная сводка по `streams[].side_data_list` из ffprobe.
 *
 * ffprobe отдаёт side data как loosely typed JSON, поэтому этот модуль остаётся чистым
 * и консервативным: показываем только короткие подписи Dolby Vision/HDR и несколько
 * безопасных неизвестных типов, без попытки интерпретировать все поля стандарта.
 * Stereo 3D и ATSC Audio Service Type дают короткие подписи для видео и аудио.
 */

import {
  type FfprobeSummaryLocale,
  formatFfprobeBitrateLabelFromBps
} from './ffprobe-summary-export-locale'

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

function parseAtscAudioServiceType(o: Record<string, unknown>, key: string): number | null {
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

function summarizeAfd(o: Record<string, unknown>): string {
  const value = scalarToken(o, 'active_format') ?? scalarToken(o, 'afd')
  return value !== null ? `AFD ${value}` : 'AFD'
}

function summarizeReplayGain(o: Record<string, unknown>): string {
  const track = scalarToken(o, 'track_gain') ?? scalarToken(o, 'album_gain')
  return track !== null ? `Replay gain ${track}` : 'Replay gain'
}

function summarizeSmpteTimecode(o: Record<string, unknown>): string {
  const value = scalarToken(o, 'timecode') ?? scalarToken(o, 'tc')
  return value !== null ? `SMPTE TC ${value}` : 'SMPTE TC'
}

function formatCompactBitrate(raw: string | null, locale: FfprobeSummaryLocale): string | null {
  if (raw === null) {
    return null
  }
  const n = Number(raw.replace(',', '.'))
  if (!Number.isFinite(n) || n <= 0) {
    return null
  }
  return formatFfprobeBitrateLabelFromBps(n, locale)
}

function summarizeCpb(o: Record<string, unknown>, locale: FfprobeSummaryLocale): string {
  const max = formatCompactBitrate(
    scalarToken(o, 'max_bitrate') ?? scalarToken(o, 'max_bit_rate'),
    locale
  )
  const avg = formatCompactBitrate(
    scalarToken(o, 'avg_bitrate') ?? scalarToken(o, 'avg_bit_rate'),
    locale
  )
  if (max !== null) {
    return `CPB max ${max}`
  }
  return avg !== null ? `CPB avg ${avg}` : 'CPB'
}

function summarizeGopTimecode(o: Record<string, unknown>): string {
  const value = scalarToken(o, 'timecode') ?? scalarToken(o, 'tc')
  return value !== null ? `GOP TC ${value}` : 'GOP TC'
}

function summarizeProducerReferenceTime(o: Record<string, unknown>): string {
  const value =
    scalarToken(o, 'wallclock') ?? scalarToken(o, 'wallclock_time') ?? scalarToken(o, 'pts')
  return value !== null ? `PRFT ${value}` : 'PRFT'
}

function summarizeAtscAudioService(o: Record<string, unknown>): string {
  const svc =
    parseAtscAudioServiceType(o, 'service_type') ??
    parseAtscAudioServiceType(o, 'audio_service_type')
  return svc !== null ? `ATSC svc ${svc}` : 'ATSC audio svc'
}

function summarizeFilmGrain(low: string): string {
  return low.includes('av1') ? 'AV1 film grain' : 'Film grain'
}

type FfprobeSideDataRule = {
  match: (low: string) => boolean
  summarize: (o: Record<string, unknown>, locale: FfprobeSummaryLocale) => string | null
}

/** Порядок важен: первое совпадение wins; `null` — не показывать в сводке (Display Matrix). */
const FFPROBE_SIDE_DATA_RULES: readonly FfprobeSideDataRule[] = [
  {
    match: (low) => low.includes('dovi') || low.includes('dolby vision'),
    summarize: summarizeDolbyVision
  },
  { match: (low) => low.includes('mastering display'), summarize: summarizeMasteringDisplay },
  { match: (low) => low.includes('content light'), summarize: summarizeContentLight },
  {
    match: (low) => low.includes('display matrix'),
    summarize: () => null
  },
  { match: (low) => low.includes('ambient viewing'), summarize: () => 'HDR ambient viewing' },
  { match: (low) => low.includes('spherical'), summarize: () => '360°' },
  { match: (low) => low.includes('stereo') && low.includes('3d'), summarize: () => '3D' },
  { match: (low) => low.includes('audio service type'), summarize: summarizeAtscAudioService },
  { match: (low) => low.includes('active format') || low === 'afd', summarize: summarizeAfd },
  {
    match: (low) =>
      low.includes('closed captions') || low.includes('eia-608') || low.includes('eia-708'),
    summarize: () => 'CC'
  },
  { match: (low) => low.includes('replay gain'), summarize: summarizeReplayGain },
  { match: (low) => low.includes('skip samples'), summarize: () => 'Skip samples' },
  {
    match: (low) =>
      low.includes('smpte') &&
      (low.includes('timecode') || low.includes('12m') || low.includes('12-m')),
    summarize: summarizeSmpteTimecode
  },
  {
    match: (low) => low.includes('gop') && low.includes('timecode'),
    summarize: summarizeGopTimecode
  },
  {
    match: (low) => low.includes('producer reference time'),
    summarize: summarizeProducerReferenceTime
  },
  {
    match: (low) => low.includes('film grain'),
    summarize: (o) => summarizeFilmGrain((scalarToken(o, 'side_data_type') ?? '').toLowerCase())
  },
  { match: (low) => low.includes('cpb'), summarize: summarizeCpb }
]

function summarizeSideDataItem(raw: unknown, locale: FfprobeSummaryLocale): string | null {
  const o = recordFromUnknown(raw)
  if (o === null) {
    return null
  }
  const type = scalarToken(o, 'side_data_type')
  if (type === null) {
    return null
  }
  const low = type.toLowerCase()
  for (const rule of FFPROBE_SIDE_DATA_RULES) {
    if (!rule.match(low)) {
      continue
    }
    const label = rule.summarize(o, locale)
    if (label !== null) {
      return label
    }
    return null
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

/** Smoke §9/§19: `stream.side_data_list` — массив объектов с непустым `side_data_type`. */
export function isFfprobeSideDataListStructureOkForSmoke(sideDataList: unknown): boolean {
  if (sideDataList === undefined || sideDataList === null) {
    return true
  }
  if (!Array.isArray(sideDataList)) {
    return false
  }
  for (const item of sideDataList) {
    const o = recordFromUnknown(item)
    if (o === null || scalarToken(o, 'side_data_type') === null) {
      return false
    }
  }
  summarizeFfprobeSideDataList(sideDataList, 'en')
  return true
}

export function summarizeFfprobeSideDataList(
  raw: unknown,
  locale: FfprobeSummaryLocale = 'ru'
): string | null {
  if (!Array.isArray(raw)) {
    return null
  }
  const out: string[] = []
  for (const item of raw) {
    const label = summarizeSideDataItem(item, locale)
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
