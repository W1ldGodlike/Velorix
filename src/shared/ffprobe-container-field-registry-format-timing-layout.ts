import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { formatFfprobeStreamStartTime } from './ffprobe-stream-start-time'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

import {
  formatFfprobeContainerBitRateCompact,
  formatFfprobeContainerBitRateExportLine,
  formatFfprobeContainerFormatFlagsCompact,
  formatFfprobeContainerSizeCompact,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbChaptersExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  formatScalarTemplateExportLineFromValue
} from './ffprobe-container-field-registry-format-scalar'
/** §9 — probe_score, nb_streams/programs, size и flags одной строкой инспектора. */
export function formatFfprobeContainerProbeLayoutCompactLine(info: {
  probeScore: number | null
  containerNbStreams: number | null
  containerNbPrograms: number | null
  containerNbChapters?: number | null
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
  const nbChapters = info.containerNbChapters ?? null
  if (nbChapters !== null && nbChapters > 0) {
    parts.push(`${nbChapters} ch.`)
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
    formatFfprobeNbChaptersExportLine(info.containerNbChapters, locale),
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
