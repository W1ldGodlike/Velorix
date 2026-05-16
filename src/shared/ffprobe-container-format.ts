/**
 * §9 — редкие поля контейнера ffprobe: `probe_score`, `format.tags` (MP4/MOV brands).
 */
import type { MediaProbeSuccess } from './ffprobe-contract'
import { formatFfprobeStreamStartTime } from './ffprobe-stream-start-time'
import {
  type FfprobeSummaryLocale,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

function tagScalar(raw: string | number | undefined): string | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return String(raw)
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length > 0 ? t : null
  }
  return null
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

/** Basename для краткой строки инспектора. */
export function ffprobeContainerFilenameBasename(filename: string): string {
  const normalized = filename.replace(/\\/g, '/')
  const base = normalized.split('/').pop() ?? filename
  const t = base.trim()
  return t.length > 0 ? t : filename
}

export function parseFfprobeFormatMajorBrand(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return tagScalar(tags?.['major_brand'])
}

export function parseFfprobeFormatCompatibleBrands(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return tagScalar(tags?.['compatible_brands'])
}

export function parseFfprobeFormatCreationTime(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return tagScalar(tags?.['creation_time'])
}

export function parseFfprobeFormatEncoder(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return tagScalar(tags?.['encoder'])
}

export function parseFfprobeFormatTitleTag(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return tagScalar(tags?.['title'])
}

export function parseFfprobeFormatCommentTag(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  return tagScalar(tags?.['comment'])
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

/** Компактная подпись размера файла (IEC KiB/MiB/…). */
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

export function parseFfprobeFormatNbPrograms(raw: string | number | undefined): number | null {
  return parseFfprobeFormatNbStreams(raw)
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

export function formatFfprobeContainerTitleExportLine(
  title: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (title === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerTitleTemplate, { title })
}

export function formatFfprobeContainerCommentExportLine(
  comment: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (comment === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerCommentTemplate, { comment })
}

export function formatFfprobeContainerEncoderExportLine(
  encoder: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (encoder === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerEncoderTemplate, { encoder })
}

export function formatFfprobeContainerCreationTimeExportLine(
  creationTime: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (creationTime === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerCreationTimeTemplate, { time: creationTime })
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

export function formatFfprobeProbeScoreExportLine(
  probeScore: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (probeScore === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.probeScoreTemplate, { score: probeScore })
}

export function formatFfprobeFormatFlagsExportLine(
  flags: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (flags === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerFormatFlagsTemplate, { flags })
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

/** Компактная подпись для инспектора (как у дорожек). */
export function formatFfprobeContainerStartTimeCompact(startSec: number | null): string | null {
  if (startSec === null) {
    return null
  }
  return formatFfprobeStreamStartTime(String(startSec))
}

export function formatFfprobeContainerFilenameExportLine(
  filename: string | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (filename === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerFilenameTemplate, { filename })
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

export function formatFfprobeNbProgramsExportLine(
  nbPrograms: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (nbPrograms === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.containerNbProgramsTemplate, { count: nbPrograms })
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

/** §7 — краткая строка «Видео» под таймлайном: разрешение, кодек, опц. major_brand. */
export function formatFfprobeEditorVideoFactLine(
  probe: MediaProbeSuccess | null,
  dashPlaceholder: string
): string {
  if (!probe?.video) {
    return dashPlaceholder
  }
  const base = `${probe.video.width}×${probe.video.height} ${probe.video.codec}`
  const brand = probe.containerMajorBrand?.trim()
  if (brand && brand.length > 0) {
    return `${base} · ${brand}`
  }
  return base
}
