/**
 * §9 — поля `format.*` (не tags): parse + простые export-строки из locale-шаблонов.
 * Скалярные `format.tags.*` — `ffprobe-format-tag-registry.ts`.
 */
import type { MediaProbeSuccess } from './ffprobe-contract'
import { parseFfprobeFormatTagScalar } from './ffprobe-format-tag-registry'
import { parseFfprobeTickCount } from './ffprobe-stream-duration-ts'
import { parseFfprobeNontrivialTimeBase } from './ffprobe-stream-time-base'

export type FfprobeFormatJsonSlice = {
  probe_score?: string | number
  filename?: string
  flags?: string | number
  start_time?: string | number
  start_time_real?: string | number
  /** Длительность контейнера в секундах (строка float). */
  duration?: string | number
  /** Длительность контейнера в тиках time_base. */
  duration_ts?: string | number
  /** База времени контейнера. */
  time_base?: string
  /** Байты, прочитанные при зондировании (диагностика глубины probe). */
  probe_size?: string | number
  bit_rate?: string | number
  size?: string | number
  nb_streams?: string | number
  nb_programs?: string | number
  tags?: Record<string, string | number | undefined>
}

export function parseFfprobeFormatProbeScore(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const n = Math.trunc(raw)
    return n >= 0 && n <= 100 ? n : null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '') {
      return null
    }
    const n = Number.parseInt(t, 10)
    return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null
  }
  return null
}

export function parseFfprobeFormatFilename(raw: string | undefined): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim()
  return t.length > 0 ? t : null
}

export function parseFfprobeFormatMajorBrand(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return parseFfprobeFormatTagScalar(tags, 'major_brand')
}

export function parseFfprobeFormatCompatibleBrands(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return parseFfprobeFormatTagScalar(tags, 'compatible_brands')
}

export function parseFfprobeFormatCreationTime(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return parseFfprobeFormatTagScalar(tags, 'creation_time')
}

export function parseFfprobeFormatFlags(raw: string | number | undefined): string | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const u = Math.trunc(raw) >>> 0
    return `0x${u.toString(16)}`
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t.length === 0) {
      return null
    }
    if (/^0x[0-9a-f]+$/i.test(t)) {
      return t.toLowerCase()
    }
    const n = Number.parseInt(t, 10)
    if (Number.isFinite(n)) {
      return `0x${(n >>> 0).toString(16)}`
    }
    return t
  }
  return null
}

/** `format.duration` (секунды), если ffprobe отдал. */
export function parseFfprobeFormatDurationSec(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
    return raw
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '' || /^n\/a$/i.test(t)) {
      return null
    }
    const sec = Number.parseFloat(t.replace(',', '.'))
    return Number.isFinite(sec) && sec >= 0 ? sec : null
  }
  return null
}

export function parseFfprobeFormatStartTimeSec(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.abs(raw) < 0.0005 ? null : raw
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '' || /^n\/a$/i.test(t)) {
      return null
    }
    const sec = Number.parseFloat(t.replace(',', '.'))
    if (!Number.isFinite(sec) || Math.abs(sec) < 0.0005) {
      return null
    }
    return sec
  }
  return null
}

function parseFfprobeFormatPositiveNumber(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return raw
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '') {
      return null
    }
    const n = Number.parseFloat(t.replace(',', '.'))
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return null
}

/** `format.bit_rate` (бит/с) → килобиты/с для UI и registry smoke. */
export function parseFfprobeFormatBitRateKbps(raw: string | number | undefined): number | null {
  const bps = parseFfprobeFormatPositiveNumber(raw)
  return bps === null ? null : bps / 1000
}

export function parseFfprobeFormatSize(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const n = Math.trunc(raw)
    return n >= 0 ? n : null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '') {
      return null
    }
    const n = Number.parseInt(t, 10)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
}

export function parseFfprobeFormatNbStreams(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const n = Math.trunc(raw)
    return n >= 0 ? n : null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '') {
      return null
    }
    const n = Number.parseInt(t, 10)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
}

export function parseFfprobeFormatNbPrograms(raw: string | number | undefined): number | null {
  return parseFfprobeFormatNbStreams(raw)
}

export function parseFfprobeFormatDurationTs(raw: string | number | undefined): number | null {
  return parseFfprobeTickCount(raw)
}

export function parseFfprobeFormatTimeBase(raw: string | undefined): string | null {
  return parseFfprobeNontrivialTimeBase(raw)
}

export function parseFfprobeFormatProbeSize(raw: string | number | undefined): number | null {
  const n = parseFfprobeFormatSize(raw)
  return n === null || n <= 0 ? null : n
}

/** Все поля контейнера из `format` JSON ffprobe (кроме scalar tags — отдельный реестр). */
export function parseFfprobeContainerFieldsFromFormat(
  format: FfprobeFormatJsonSlice | undefined
): Pick<
  MediaProbeSuccess,
  | 'containerMajorBrand'
  | 'containerCreationTime'
  | 'containerCompatibleBrands'
  | 'probeScore'
  | 'containerNbStreams'
  | 'containerNbPrograms'
  | 'containerFormatFlags'
  | 'containerSizeBytes'
  | 'containerStartTimeSec'
  | 'containerStartTimeRealSec'
  | 'containerDurationTs'
  | 'containerTimeBase'
  | 'containerProbeSizeBytes'
  | 'containerFilename'
> {
  const tags = format?.tags
  return {
    containerMajorBrand: parseFfprobeFormatMajorBrand(tags),
    containerCreationTime: parseFfprobeFormatCreationTime(tags),
    containerCompatibleBrands: parseFfprobeFormatCompatibleBrands(tags),
    probeScore: parseFfprobeFormatProbeScore(format?.probe_score),
    containerNbStreams: parseFfprobeFormatNbStreams(format?.nb_streams),
    containerNbPrograms: parseFfprobeFormatNbPrograms(format?.nb_programs),
    containerFormatFlags: parseFfprobeFormatFlags(format?.flags),
    containerSizeBytes: parseFfprobeFormatSize(format?.size),
    containerStartTimeSec: parseFfprobeFormatStartTimeSec(format?.start_time),
    containerStartTimeRealSec: parseFfprobeFormatStartTimeSec(format?.start_time_real),
    containerDurationTs: parseFfprobeFormatDurationTs(format?.duration_ts),
    containerTimeBase: parseFfprobeFormatTimeBase(format?.time_base),
    containerProbeSizeBytes: parseFfprobeFormatProbeSize(format?.probe_size),
    containerFilename: parseFfprobeFormatFilename(format?.filename)
  }
}
