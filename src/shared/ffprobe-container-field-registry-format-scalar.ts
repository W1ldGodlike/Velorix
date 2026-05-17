import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  type FfprobeSummaryStrings,
  formatFfprobeBitrateLabelFromKbps,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'

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
    localeTemplateKey: 'containerNbChaptersTemplate',
    fillKey: 'count',
    read: (info) => info.containerNbChapters
  },
  {
    localeTemplateKey: 'containerFormatFlagsTemplate',
    fillKey: 'flags',
    read: (info) => info.containerFormatFlags
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

export function formatScalarTemplateExportLineFromValue(
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

export function formatFfprobeNbChaptersExportLine(
  nbChapters: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  return formatScalarTemplateExportLineFromValue(
    'containerNbChaptersTemplate',
    'count',
    nbChapters,
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

/** §9 — `format.flags` в краткой сводке инспектора. */
export function formatFfprobeContainerFormatFlagsCompact(flags: string | null): string | null {
  return flags === null ? null : `flags ${flags}`
}

/** Basename для краткой строки `format.filename`. */
export function ffprobeContainerFilenameBasename(filename: string): string {
  const normalized = filename.replace(/\\/g, '/')
  const base = normalized.split('/').pop() ?? filename
  const t = base.trim()
  return t.length > 0 ? t : filename
}

/** §9 — `format.bit_rate` в краткой сводке инспектора (англ. аббревиатура, как size/str.). */
export function formatFfprobeContainerBitRateCompact(kbps: number | null): string | null {
  const label = formatFfprobeBitrateLabelFromKbps(kbps, 'en')
  return label === null ? null : `br ${label}`
}

export function formatFfprobeContainerBitRateExportLine(
  kbps: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  const label = formatFfprobeBitrateLabelFromKbps(kbps, locale)
  if (label === null) {
    return null
  }
  return ffprobeSummaryFill(ffprobeSummaryStrings(locale).containerBitRateTemplate, { label })
}

/** §9 — `format.filename` в краткой сводке (basename). */
export function formatFfprobeContainerFilenameCompact(filename: string | null): string | null {
  if (filename === null) {
    return null
  }
  const base = ffprobeContainerFilenameBasename(filename)
  return base.length > 0 ? `file ${base}` : null
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
