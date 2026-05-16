/**
 * §9 — редкие поля контейнера ffprobe: `probe_score`, `format.tags` (MP4/MOV brands).
 */
import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'

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
