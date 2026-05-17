/**
 * §9 — поля `format.*` (не tags): parse + простые export-строки из locale-шаблонов.
 * Скалярные `format.tags.*` — `ffprobe-format-tag-registry.ts`.
 */
import type { MediaProbeSuccess } from './ffprobe-contract'
import { parseFfprobeFormatTagScalar } from './ffprobe-format-tag-registry'
import { formatFfprobeStreamStartTime } from './ffprobe-stream-start-time'
import {
  type FfprobeSummaryLocale,
  type FfprobeSummaryStrings,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { parseFfprobeTickCount } from './ffprobe-stream-duration-ts'
import {
  formatFfprobeContainerTimeBaseCompact,
  parseFfprobeNontrivialTimeBase
} from './ffprobe-stream-time-base'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

export type FfprobeFormatJsonSlice = {
  probe_score?: string | number
  filename?: string
  flags?: string | number
  start_time?: string | number
  start_time_real?: string | number
  /** Длительность контейнера в тиках time_base. */
  duration_ts?: string | number
  /** База времени контейнера. */
  time_base?: string
  /** Байты, прочитанные при зондировании (диагностика глубины probe). */
  probe_size?: string | number
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

export function formatFfprobeContainerSizeCompact(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  const units = ['KiB', 'MiB', 'GiB', 'TiB'] as const
  let value = bytes
  let unitIndex = -1
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const label =
    value < 10 ? value.toFixed(2) : value < 100 ? value.toFixed(1) : String(Math.round(value))
  return `${label} ${units[unitIndex]}`
}

type FfprobeContainerScalarExportSpec = {
  localeTemplateKey: keyof FfprobeSummaryStrings
  fillKey: string
  read: (info: MediaProbeSuccess) => string | number | null
  formatValue?: (value: string | number) => string | number
}

const FFPROBE_CONTAINER_SCALAR_EXPORT_SPECS: readonly FfprobeContainerScalarExportSpec[] = [
  {
    localeTemplateKey: 'containerCreationTimeTemplate',
    fillKey: 'time',
    read: (info) => info.containerCreationTime
  },
  {
    localeTemplateKey: 'probeScoreTemplate',
    fillKey: 'score',
    read: (info) => info.probeScore
  },
  {
    localeTemplateKey: 'containerNbProgramsTemplate',
    fillKey: 'count',
    read: (info) => info.containerNbPrograms
  },
  {
    localeTemplateKey: 'containerFormatFlagsTemplate',
    fillKey: 'flags',
    read: (info) => info.containerFormatFlags
  },
  {
    localeTemplateKey: 'containerFilenameTemplate',
    fillKey: 'filename',
    read: (info) => info.containerFilename
  },
  {
    localeTemplateKey: 'containerDurationTsTemplate',
    fillKey: 'ticks',
    read: (info) => info.containerDurationTs
  },
  {
    localeTemplateKey: 'containerTimeBaseTemplate',
    fillKey: 'timeBase',
    read: (info) => info.containerTimeBase
  }
]

function formatScalarTemplateExportLine(
  spec: FfprobeContainerScalarExportSpec,
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale
): string | null {
  const raw = spec.read(info)
  if (raw === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  const value = spec.formatValue ? spec.formatValue(raw) : raw
  return ffprobeSummaryFill(b[spec.localeTemplateKey] as string, { [spec.fillKey]: value })
}

function formatScalarTemplateExportLineFromValue(
  templateKey: keyof FfprobeSummaryStrings,
  fillKey: string,
  value: string | number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (value === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b[templateKey] as string, { [fillKey]: value })
}

export function formatFfprobeContainerCreationTimeExportLine(
  creationTime: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerCreationTimeTemplate',
    'time',
    creationTime,
    locale
  )
}

export function formatFfprobeProbeScoreExportLine(
  probeScore: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue('probeScoreTemplate', 'score', probeScore, locale)
}

export function formatFfprobeNbProgramsExportLine(
  nbPrograms: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerNbProgramsTemplate',
    'count',
    nbPrograms,
    locale
  )
}

export function formatFfprobeFormatFlagsExportLine(
  flags: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerFormatFlagsTemplate',
    'flags',
    flags,
    locale
  )
}

export function formatFfprobeContainerFilenameExportLine(
  filename: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerFilenameTemplate',
    'filename',
    filename,
    locale
  )
}

export function collectFfprobeContainerScalarExportLines(
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale
): string[] {
  const out: string[] = []
  for (const spec of FFPROBE_CONTAINER_SCALAR_EXPORT_SPECS) {
    const line = formatScalarTemplateExportLine(spec, info, locale)
    if (line !== null) {
      out.push(line)
    }
  }
  return out
}

export function formatFfprobeContainerBrandExportLine(
  majorBrand: string | null,
  compatibleBrands: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (majorBrand === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  if (compatibleBrands !== null) {
    return ffprobeSummaryFill(b.containerBrandWithCompatTemplate, {
      brand: majorBrand,
      compat: compatibleBrands
    })
  }
  return ffprobeSummaryFill(b.containerBrandTemplate, { brand: majorBrand })
}

export function formatFfprobeContainerSizeExportLine(
  sizeBytes: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (sizeBytes === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerSizeTemplate, {
    label: formatFfprobeContainerSizeCompact(sizeBytes),
    bytes: sizeBytes
  })
}

export function formatFfprobeContainerStartTimeExportLine(
  startSec: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (startSec === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerStartTimeTemplate, {
    time: formatProbeChapterTimecode(startSec)
  })
}

export function formatFfprobeContainerStartTimeCompact(startSec: number | null): string | null {
  if (startSec === null) {
    return null
  }
  return formatFfprobeStreamStartTime(String(startSec))
}

export function formatFfprobeContainerDurationTsCompact(ticks: number | null): string | null {
  if (ticks === null || ticks <= 0) {
    return null
  }
  return `dur_ts ${ticks}`
}

export function formatFfprobeContainerDurationTsExportLine(
  ticks: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerDurationTsTemplate',
    'ticks',
    ticks,
    locale
  )
}

export function formatFfprobeContainerTimeBaseExportLine(
  timeBase: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerTimeBaseTemplate',
    'timeBase',
    timeBase,
    locale
  )
}

export function formatFfprobeContainerProbeSizeCompact(bytes: number | null): string | null {
  if (bytes === null || bytes <= 0) {
    return null
  }
  return `probe_io ${formatFfprobeContainerSizeCompact(bytes)}`
}

export function formatFfprobeContainerProbeSizeExportLine(
  bytes: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (bytes === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerProbeSizeTemplate, {
    label: formatFfprobeContainerSizeCompact(bytes),
    bytes
  })
}

/** §9 — краткая строка инспектора: duration_ts + time_base + probe_size без дублирования отдельных IIFE. */
export function formatFfprobeContainerTimingProbeCompactLine(info: {
  containerDurationTs: number | null
  containerTimeBase: string | null
  containerProbeSizeBytes: number | null
}): string | null {
  const parts: string[] = []
  const dts = formatFfprobeContainerDurationTsCompact(info.containerDurationTs)
  if (dts) {
    parts.push(dts)
  }
  const tb = formatFfprobeContainerTimeBaseCompact(info.containerTimeBase)
  if (tb) {
    parts.push(tb)
  }
  const probeIo = formatFfprobeContainerProbeSizeCompact(info.containerProbeSizeBytes)
  if (probeIo) {
    parts.push(probeIo)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — локализованная строка экспорта TXT/HTML: duration_ts · time_base · probe_size. */
export function formatFfprobeContainerTimingProbeExportLine(
  info: {
    containerDurationTs: number | null
    containerTimeBase: string | null
    containerProbeSizeBytes: number | null
  },
  locale: FfprobeSummaryLocale
): string | null {
  const parts = [
    formatFfprobeContainerDurationTsExportLine(info.containerDurationTs, locale),
    formatFfprobeContainerTimeBaseExportLine(info.containerTimeBase, locale),
    formatFfprobeContainerProbeSizeExportLine(info.containerProbeSizeBytes, locale)
  ].filter((x): x is string => x !== null)
  return parts.length > 0 ? parts.join(' · ') : null
}

export function formatFfprobeContainerStartTimeRealExportLine(
  startRealSec: number | null,
  startSec: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (startRealSec === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  if (startSec !== null && startRealSec !== startSec) {
    return ffprobeSummaryFill(b.containerStartTimeRealMismatchTemplate, {
      real: formatProbeChapterTimecode(startRealSec),
      nominal: formatProbeChapterTimecode(startSec)
    })
  }
  return ffprobeSummaryFill(b.containerStartTimeRealTemplate, {
    time: formatProbeChapterTimecode(startRealSec)
  })
}

export function formatFfprobeNbStreamsExportLine(
  nbStreams: number | null,
  parsedTrackCount: number,
  locale: FfprobeSummaryLocale
): string | null {
  if (nbStreams === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  if (nbStreams !== parsedTrackCount) {
    return ffprobeSummaryFill(b.containerNbStreamsMismatchTemplate, {
      nb: nbStreams,
      parsed: parsedTrackCount
    })
  }
  return ffprobeSummaryFill(b.containerNbStreamsTemplate, { count: nbStreams })
}
