/**
 * §9 — единый реестр скалярных `format.tags.*` (ffprobe → probe → export → инспектор).
 * Новый тег — одна строка здесь, без копипасты parse/export/brief-функций.
 */
import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  type FfprobeSummaryStrings,
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

/** Парсинг одного скалярного `format.tags.*`. */
export function parseFfprobeFormatTagScalar(
  tags: Record<string, string | number | undefined> | undefined,
  ffprobeKey: string
): string | null {
  return tagScalar(tags?.[ffprobeKey])
}

/** Поля `MediaProbeSuccess`, заполняемые из `format.tags` (кроме brand/creation_time). */
export type FfprobeFormatScalarTagProbeField =
  | 'containerEncoder'
  | 'containerPublisherTag'
  | 'containerEncodedByTag'
  | 'containerSoftwareTag'
  | 'containerTitleTag'
  | 'containerSortTitleTag'
  | 'containerCommentTag'
  | 'containerSynopsisTag'
  | 'containerDescriptionTag'
  | 'containerKeywordsTag'
  | 'containerLyricsTag'
  | 'containerArtistTag'
  | 'containerPerformerTag'
  | 'containerSortArtistTag'
  | 'containerAlbumTag'
  | 'containerAlbumArtistTag'
  | 'containerSortAlbumTag'
  | 'containerGenreTag'
  | 'containerTrackTag'
  | 'containerDiscTag'
  | 'containerCopyrightTag'
  | 'containerIsrcTag'
  | 'containerDateTag'
  | 'containerLocationTag'
  | 'containerPurchaseDateTag'

export type FfprobeFormatScalarTagSpec = {
  ffprobeKey: string
  probeField: FfprobeFormatScalarTagProbeField
  localeTemplateKey: keyof FfprobeSummaryStrings
  fillKey: string
  inspectorBriefPrefix: string
  /** `title` — кавычки «…» без префикса. */
  inspectorBriefQuoted?: boolean
}

/** Порядок = probe summary TXT/HTML и краткая строка инспектора. */
export const FFPROBE_FORMAT_SCALAR_TAG_SPECS: readonly FfprobeFormatScalarTagSpec[] = [
  {
    ffprobeKey: 'encoder',
    probeField: 'containerEncoder',
    localeTemplateKey: 'containerEncoderTemplate',
    fillKey: 'encoder',
    inspectorBriefPrefix: 'enc'
  },
  {
    ffprobeKey: 'publisher',
    probeField: 'containerPublisherTag',
    localeTemplateKey: 'containerPublisherTemplate',
    fillKey: 'publisher',
    inspectorBriefPrefix: 'pub'
  },
  {
    ffprobeKey: 'encoded_by',
    probeField: 'containerEncodedByTag',
    localeTemplateKey: 'containerEncodedByTemplate',
    fillKey: 'encodedBy',
    inspectorBriefPrefix: 'eby'
  },
  {
    ffprobeKey: 'software',
    probeField: 'containerSoftwareTag',
    localeTemplateKey: 'containerSoftwareTemplate',
    fillKey: 'software',
    inspectorBriefPrefix: 'soft'
  },
  {
    ffprobeKey: 'title',
    probeField: 'containerTitleTag',
    localeTemplateKey: 'containerTitleTemplate',
    fillKey: 'title',
    inspectorBriefPrefix: '',
    inspectorBriefQuoted: true
  },
  {
    ffprobeKey: 'sort_title',
    probeField: 'containerSortTitleTag',
    localeTemplateKey: 'containerSortTitleTemplate',
    fillKey: 'sortTitle',
    inspectorBriefPrefix: 'stit'
  },
  {
    ffprobeKey: 'comment',
    probeField: 'containerCommentTag',
    localeTemplateKey: 'containerCommentTemplate',
    fillKey: 'comment',
    inspectorBriefPrefix: 'cmt'
  },
  {
    ffprobeKey: 'synopsis',
    probeField: 'containerSynopsisTag',
    localeTemplateKey: 'containerSynopsisTemplate',
    fillKey: 'synopsis',
    inspectorBriefPrefix: 'syn'
  },
  {
    ffprobeKey: 'description',
    probeField: 'containerDescriptionTag',
    localeTemplateKey: 'containerDescriptionTemplate',
    fillKey: 'description',
    inspectorBriefPrefix: 'desc'
  },
  {
    ffprobeKey: 'keywords',
    probeField: 'containerKeywordsTag',
    localeTemplateKey: 'containerKeywordsTemplate',
    fillKey: 'keywords',
    inspectorBriefPrefix: 'kw'
  },
  {
    ffprobeKey: 'lyrics',
    probeField: 'containerLyricsTag',
    localeTemplateKey: 'containerLyricsTemplate',
    fillKey: 'lyrics',
    inspectorBriefPrefix: 'lyr'
  },
  {
    ffprobeKey: 'artist',
    probeField: 'containerArtistTag',
    localeTemplateKey: 'containerArtistTemplate',
    fillKey: 'artist',
    inspectorBriefPrefix: 'art'
  },
  {
    ffprobeKey: 'performer',
    probeField: 'containerPerformerTag',
    localeTemplateKey: 'containerPerformerTemplate',
    fillKey: 'performer',
    inspectorBriefPrefix: 'perf'
  },
  {
    ffprobeKey: 'sort_artist',
    probeField: 'containerSortArtistTag',
    localeTemplateKey: 'containerSortArtistTemplate',
    fillKey: 'sortArtist',
    inspectorBriefPrefix: 'sart'
  },
  {
    ffprobeKey: 'album',
    probeField: 'containerAlbumTag',
    localeTemplateKey: 'containerAlbumTemplate',
    fillKey: 'album',
    inspectorBriefPrefix: 'alb'
  },
  {
    ffprobeKey: 'album_artist',
    probeField: 'containerAlbumArtistTag',
    localeTemplateKey: 'containerAlbumArtistTemplate',
    fillKey: 'albumArtist',
    inspectorBriefPrefix: 'aart'
  },
  {
    ffprobeKey: 'sort_album',
    probeField: 'containerSortAlbumTag',
    localeTemplateKey: 'containerSortAlbumTemplate',
    fillKey: 'sortAlbum',
    inspectorBriefPrefix: 'salb'
  },
  {
    ffprobeKey: 'genre',
    probeField: 'containerGenreTag',
    localeTemplateKey: 'containerGenreTemplate',
    fillKey: 'genre',
    inspectorBriefPrefix: 'gen'
  },
  {
    ffprobeKey: 'track',
    probeField: 'containerTrackTag',
    localeTemplateKey: 'containerTrackTemplate',
    fillKey: 'track',
    inspectorBriefPrefix: 'trk'
  },
  {
    ffprobeKey: 'disc',
    probeField: 'containerDiscTag',
    localeTemplateKey: 'containerDiscTemplate',
    fillKey: 'disc',
    inspectorBriefPrefix: 'disc'
  },
  {
    ffprobeKey: 'copyright',
    probeField: 'containerCopyrightTag',
    localeTemplateKey: 'containerCopyrightTemplate',
    fillKey: 'copyright',
    inspectorBriefPrefix: 'cpy'
  },
  {
    ffprobeKey: 'isrc',
    probeField: 'containerIsrcTag',
    localeTemplateKey: 'containerIsrcTemplate',
    fillKey: 'isrc',
    inspectorBriefPrefix: 'isrc'
  },
  {
    ffprobeKey: 'date',
    probeField: 'containerDateTag',
    localeTemplateKey: 'containerDateTemplate',
    fillKey: 'date',
    inspectorBriefPrefix: 'date'
  },
  {
    ffprobeKey: 'location',
    probeField: 'containerLocationTag',
    localeTemplateKey: 'containerLocationTemplate',
    fillKey: 'location',
    inspectorBriefPrefix: 'loc'
  },
  {
    ffprobeKey: 'purchase_date',
    probeField: 'containerPurchaseDateTag',
    localeTemplateKey: 'containerPurchaseDateTemplate',
    fillKey: 'purchaseDate',
    inspectorBriefPrefix: 'pdt'
  }
] as const

const INSPECTOR_BRIEF_MAX = 20

function trimInspectorBriefValue(value: string): string {
  return value.length > INSPECTOR_BRIEF_MAX ? `${value.slice(0, INSPECTOR_BRIEF_MAX - 1)}…` : value
}

export function parseFfprobeFormatScalarTagsFromFfprobe(
  tags: Record<string, string | number | undefined> | undefined
): Pick<MediaProbeSuccess, FfprobeFormatScalarTagProbeField> {
  const out = {} as Pick<MediaProbeSuccess, FfprobeFormatScalarTagProbeField>
  for (const spec of FFPROBE_FORMAT_SCALAR_TAG_SPECS) {
    out[spec.probeField] = parseFfprobeFormatTagScalar(tags, spec.ffprobeKey)
  }
  return out
}

export function formatFfprobeFormatScalarTagExportLine(
  value: string | null,
  spec: FfprobeFormatScalarTagSpec,
  locale: FfprobeSummaryLocale
): string | null {
  if (value === null) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  const template = b[spec.localeTemplateKey]
  if (typeof template !== 'string') {
    return null
  }
  return ffprobeSummaryFill(template, { [spec.fillKey]: value })
}

export function collectFfprobeFormatScalarTagExportLines(
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale
): string[] {
  const lines: string[] = []
  for (const spec of FFPROBE_FORMAT_SCALAR_TAG_SPECS) {
    const value = info[spec.probeField]
    const line = formatFfprobeFormatScalarTagExportLine(
      typeof value === 'string' ? value : null,
      spec,
      locale
    )
    if (line !== null) {
      lines.push(line)
    }
  }
  return lines
}

export function formatFfprobeFormatScalarTagInspectorBrief(
  value: string | null,
  spec: FfprobeFormatScalarTagSpec
): string | null {
  if (value === null) {
    return null
  }
  const trimmed = trimInspectorBriefValue(value)
  if (spec.inspectorBriefQuoted) {
    return ` · «${trimmed}»`
  }
  return ` · ${spec.inspectorBriefPrefix} ${trimmed}`
}

export function collectFfprobeFormatScalarTagInspectorBriefs(info: MediaProbeSuccess): string[] {
  const parts: string[] = []
  for (const spec of FFPROBE_FORMAT_SCALAR_TAG_SPECS) {
    const value = info[spec.probeField]
    const brief = formatFfprobeFormatScalarTagInspectorBrief(
      typeof value === 'string' ? value : null,
      spec
    )
    if (brief !== null) {
      parts.push(brief)
    }
  }
  return parts
}
