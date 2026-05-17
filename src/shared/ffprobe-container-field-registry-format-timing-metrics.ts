import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { formatFfprobeContainerTimeBaseCompact } from './ffprobe-stream-time-base'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

import {
  formatFfprobeContainerFilenameCompact,
  formatFfprobeContainerSizeCompact,
  formatScalarTemplateExportLineFromValue
} from './ffprobe-container-field-registry-format-scalar'
import {
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerProbeLayoutCompactLine,
  formatFfprobeContainerProbeLayoutExportLine,
  formatFfprobeContainerStartOffsetCompactLine,
  formatFfprobeContainerStartTimeExportLine
} from './ffprobe-container-field-registry-format-timing-layout'

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

/** В§9 вЂ” РєСЂР°С‚РєР°СЏ СЃС‚СЂРѕРєР° РёРЅСЃРїРµРєС‚РѕСЂР°: duration + duration_ts + time_base + probe_size. */
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

/** В§9 вЂ” РєСЂР°С‚РєР°СЏ СЃС‚СЂРѕРєР° РёРЅСЃРїРµРєС‚РѕСЂР°: timing probe + start offset (РїРѕСЂСЏРґРѕРє РєР°Рє РІ СЃРІРѕРґРєРµ). */
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

/** В§9 вЂ” Р»РѕРєР°Р»РёР·РѕРІР°РЅРЅР°СЏ СЃС‚СЂРѕРєР° СЌРєСЃРїРѕСЂС‚Р° TXT/HTML: duration В· duration_ts В· time_base В· probe_size. */
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

/** В§9 вЂ” Р»РѕРєР°Р»РёР·РѕРІР°РЅРЅР°СЏ СЃС‚СЂРѕРєР° СЌРєСЃРїРѕСЂС‚Р° TXT/HTML: start_time Рё start_time_real Р±РµР· РґСѓР±Р»СЏ. */
export function formatFfprobeContainerStartOffsetExportLine(
  info: {
    containerStartTimeSec: number | null
    containerStartTimeRealSec: number | null
  },
  locale: FfprobeSummaryLocale
): string | null {
  const real = info.containerStartTimeRealSec
  const nominal = info.containerStartTimeSec
  const mismatch = real !== null && nominal !== null && Math.abs(real - nominal) >= 0.0005
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

/** В§9 вЂ” Р»РѕРєР°Р»РёР·РѕРІР°РЅРЅР°СЏ СЃС‚СЂРѕРєР° СЌРєСЃРїРѕСЂС‚Р° TXT/HTML: timing probe + start offset (РєР°Рє РІ РёРЅСЃРїРµРєС‚РѕСЂРµ). */
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

/** В§9 вЂ” РєСЂР°С‚РєР°СЏ СЃС‚СЂРѕРєР° РёРЅСЃРїРµРєС‚РѕСЂР°: filename + probe layout + offset/timing. */
export function formatFfprobeContainerDiagnosticsCompactLine(
  info: MediaProbeSuccess
): string | null {
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

/** В§9 вЂ” Р»РѕРєР°Р»РёР·РѕРІР°РЅРЅР°СЏ СЃС‚СЂРѕРєР° СЌРєСЃРїРѕСЂС‚Р° TXT/HTML: filename + probe layout + offset/timing. */
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
