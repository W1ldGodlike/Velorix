import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  type FfprobeSummaryStrings,
  formatFfprobeBitrateLabelFromKbps,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { formatFfprobeStreamStartTime } from './ffprobe-stream-start-time'
import { formatFfprobeContainerTimeBaseCompact } from './ffprobe-stream-time-base'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

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

/** §9 — probe_score, nb_streams/programs, size и flags одной строкой инспектора. */
export function formatFfprobeContainerProbeLayoutCompactLine(info: {
  probeScore: number | null
  containerNbStreams: number | null
  containerNbPrograms: number | null
  containerSizeBytes: number | null
  containerFormatFlags: string | null
  bitrateKbps?: number | null
}): string | null {
  const parts: string[] = []
  if (info.probeScore !== null) {
    parts.push(`probe ${info.probeScore}`)
  }
  if (info.containerNbStreams !== null) {
    parts.push(`${info.containerNbStreams} str.`)
  }
  if (info.containerNbPrograms !== null && info.containerNbPrograms > 0) {
    parts.push(`${info.containerNbPrograms} prog.`)
  }
  if (info.containerSizeBytes !== null) {
    parts.push(formatFfprobeContainerSizeCompact(info.containerSizeBytes))
  }
  const br = formatFfprobeContainerBitRateCompact(info.bitrateKbps ?? null)
  if (br) {
    parts.push(br)
  }
  const flags = formatFfprobeContainerFormatFlagsCompact(info.containerFormatFlags)
  if (flags) {
    parts.push(flags)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — локализованная строка экспорта TXT/HTML: probe_score · streams · programs · size · flags. */
export function formatFfprobeContainerProbeLayoutExportLine(
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale
): string | null {
  const parts = [
    formatFfprobeProbeScoreExportLine(info.probeScore, locale),
    formatFfprobeNbStreamsExportLine(info.containerNbStreams, info.tracks.length, locale),
    formatFfprobeNbProgramsExportLine(info.containerNbPrograms, locale),
    formatFfprobeContainerSizeExportLine(info.containerSizeBytes, locale),
    formatFfprobeContainerBitRateExportLine(info.bitrateKbps, locale),
    formatFfprobeFormatFlagsExportLine(info.containerFormatFlags, locale)
  ].filter((x): x is string => x !== null)
  return parts.length > 0 ? parts.join(' · ') : null
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

/** §9 — краткая строка инспектора: start_time и real при расхождении. */
export function formatFfprobeContainerStartOffsetCompactLine(info: {
  containerStartTimeSec: number | null
  containerStartTimeRealSec: number | null
}): string | null {
  const parts: string[] = []
  const startLabel = formatFfprobeContainerStartTimeCompact(info.containerStartTimeSec)
  if (startLabel) {
    parts.push(startLabel)
  }
  const real = info.containerStartTimeRealSec
  const nominal = info.containerStartTimeSec
  if (real !== null && nominal !== null && Math.abs(real - nominal) >= 0.0005) {
    const realLabel = formatFfprobeContainerStartTimeCompact(real)
    if (realLabel) {
      parts.push(`real ${realLabel.replace(/^start /, '')}`)
    }
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — краткая строка инспектора: timing probe + start offset (порядок как в сводке). */
export function formatFfprobeContainerOffsetTimingCompactLine(info: {
  containerDurationSec?: number | null
  containerDurationTs: number | null
  containerTimeBase: string | null
  containerProbeSizeBytes: number | null
  containerStartTimeSec: number | null
  containerStartTimeRealSec: number | null
}): string | null {
  const parts: string[] = []
  const timing = formatFfprobeContainerTimingProbeCompactLine(info)
  if (timing) {
    parts.push(timing)
  }
  const start = formatFfprobeContainerStartOffsetCompactLine(info)
  if (start) {
    parts.push(start)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — локализованная строка экспорта TXT/HTML: start_time и start_time_real без дубля. */
export function formatFfprobeContainerStartOffsetExportLine(
  info: {
    containerStartTimeSec: number | null
    containerStartTimeRealSec: number | null
  },
  locale: FfprobeSummaryLocale
): string | null {
  const real = info.containerStartTimeRealSec
  const nominal = info.containerStartTimeSec
  const mismatch =
    real !== null && nominal !== null && Math.abs(real - nominal) >= 0.0005
  const parts: string[] = []
  if (mismatch) {
    const start = formatFfprobeContainerStartTimeExportLine(nominal, locale)
    const realLine = formatFfprobeContainerStartTimeRealExportLine(real, nominal, locale)
    if (start) {
      parts.push(start)
    }
    if (realLine) {
      parts.push(realLine)
    }
  } else {
    const line =
      formatFfprobeContainerStartTimeRealExportLine(real, nominal, locale) ??
      formatFfprobeContainerStartTimeExportLine(nominal, locale)
    if (line) {
      parts.push(line)
    }
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — `format.duration` (секунды) в краткой сводке инспектора. */
export function formatFfprobeContainerDurationSecCompact(sec: number | null): string | null {
  if (sec === null || !Number.isFinite(sec) || sec < 0) {
    return null
  }
  return `dur ${formatProbeChapterTimecode(sec)}`
}

export function formatFfprobeContainerDurationSecExportLine(
  sec: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (sec === null || !Number.isFinite(sec) || sec < 0) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerDurationTemplate, {
    time: formatProbeChapterTimecode(sec)
  })
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

/** §9 — краткая строка инспектора: duration + duration_ts + time_base + probe_size. */
export function formatFfprobeContainerTimingProbeCompactLine(info: {
  containerDurationSec?: number | null
  containerDurationTs: number | null
  containerTimeBase: string | null
  containerProbeSizeBytes: number | null
}): string | null {
  const parts: string[] = []
  const dur = formatFfprobeContainerDurationSecCompact(info.containerDurationSec ?? null)
  if (dur) {
    parts.push(dur)
  }
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

/** §9 — локализованная строка экспорта TXT/HTML: timing probe + start offset (как в инспекторе). */
export function formatFfprobeContainerOffsetTimingExportLine(
  info: {
    containerDurationSec?: number | null
    containerDurationTs: number | null
    containerTimeBase: string | null
    containerProbeSizeBytes: number | null
    containerStartTimeSec: number | null
    containerStartTimeRealSec: number | null
  },
  locale: FfprobeSummaryLocale
): string | null {
  const parts: string[] = []
  const timing = formatFfprobeContainerTimingProbeExportLine(info, locale)
  if (timing) {
    parts.push(timing)
  }
  const start = formatFfprobeContainerStartOffsetExportLine(info, locale)
  if (start) {
    parts.push(start)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — краткая строка инспектора: filename + probe layout + offset/timing. */
export function formatFfprobeContainerDiagnosticsCompactLine(info: MediaProbeSuccess): string | null {
  const parts: string[] = []
  const file = formatFfprobeContainerFilenameCompact(info.containerFilename)
  if (file) {
    parts.push(file)
  }
  const layout = formatFfprobeContainerProbeLayoutCompactLine(info)
  if (layout) {
    parts.push(layout)
  }
  const offsetTiming = formatFfprobeContainerOffsetTimingCompactLine({
    containerDurationSec: info.durationSec,
    containerDurationTs: info.containerDurationTs,
    containerTimeBase: info.containerTimeBase,
    containerProbeSizeBytes: info.containerProbeSizeBytes,
    containerStartTimeSec: info.containerStartTimeSec,
    containerStartTimeRealSec: info.containerStartTimeRealSec
  })
  if (offsetTiming) {
    parts.push(offsetTiming)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — локализованная строка экспорта TXT/HTML: filename + probe layout + offset/timing. */
export function formatFfprobeContainerDiagnosticsExportLine(
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale
): string | null {
  const parts = [
    formatFfprobeContainerFilenameExportLine(info.containerFilename, locale),
    formatFfprobeContainerProbeLayoutExportLine(info, locale),
    formatFfprobeContainerOffsetTimingExportLine(
      {
        containerDurationSec: info.durationSec,
        containerDurationTs: info.containerDurationTs,
        containerTimeBase: info.containerTimeBase,
        containerProbeSizeBytes: info.containerProbeSizeBytes,
        containerStartTimeSec: info.containerStartTimeSec,
        containerStartTimeRealSec: info.containerStartTimeRealSec
      },
      locale
    )
  ].filter((x): x is string => x !== null)
  return parts.length > 0 ? parts.join(' · ') : null
}

/** §9 — локализованная строка экспорта TXT/HTML: duration · duration_ts · time_base · probe_size. */
export function formatFfprobeContainerTimingProbeExportLine(
  info: {
    containerDurationSec?: number | null
    containerDurationTs: number | null
    containerTimeBase: string | null
    containerProbeSizeBytes: number | null
  },
  locale: FfprobeSummaryLocale
): string | null {
  const parts = [
    formatFfprobeContainerDurationSecExportLine(info.containerDurationSec ?? null, locale),
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
