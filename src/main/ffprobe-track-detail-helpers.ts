import type { MediaProbeTrackRow } from '../shared/ffprobe-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { formatFfprobeBitrateLabelFromKbps } from '../shared/ffprobe-summary-export-locale'
export function parsePositiveNumber(raw: string | undefined): number | null {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return null
  }
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function parseFfprobeOptionalInt(raw: string | number | undefined): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.trunc(raw)
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '' || /^n\/a$/i.test(t)) {
      return null
    }
    const n = Number.parseInt(t, 10)
    return Number.isFinite(n) ? n : null
  }
  return null
}

/** FourCC из контейнера: скрываем `unknown` и «пустой» `[0][0][0][0]`. */
export function ffprobeContainerFourccDisplay(raw: string | undefined): string | null {
  const t = ffprobeScalarDisplay(raw)
  if (t === null) {
    return null
  }
  const low = t.toLowerCase()
  if (low === 'unknown') {
    return null
  }
  if (/^\[0\]\[0\]\[0\]\[0\]$/.test(low)) {
    return null
  }
  return t
}

/** Hex `codec_tag`, если строковый FourCC недоступен. */
export function formatFfprobeCodecTagHexDetail(
  codecTag: string | number | undefined
): string | null {
  if (typeof codecTag === 'number' && Number.isFinite(codecTag)) {
    const u = Math.trunc(codecTag) >>> 0
    if (u === 0) {
      return null
    }
    return `tag 0x${u.toString(16)}`
  }
  if (typeof codecTag === 'string') {
    const raw = codecTag.trim().replace(/\s+/g, '')
    if (raw === '' || /^n\/a$/i.test(raw)) {
      return null
    }
    if (/^0x[0-9a-f]+$/i.test(raw)) {
      const n = Number.parseInt(raw.slice(2), 16)
      if (!Number.isFinite(n) || n === 0) {
        return null
      }
      return `tag ${raw.toLowerCase()}`
    }
  }
  return null
}

/** Битрейт контейнера из ffprobe (`bit_rate` в бит/с) → килобиты/с для UI. */
export function formatBitrateKbps(bitRateBitsPerSec: string | undefined): number | null {
  const bps = parsePositiveNumber(bitRateBitsPerSec)
  return bps === null ? null : bps / 1000
}

/** Метка битрейта для колонки «Сведения» (как в `MediaProbePanel` / экспорт сводки). */
export function appendMaxBitrateDetailIfNotable(
  parts: string[],
  bitRate: string | undefined,
  maxBitRate: string | undefined,
  locale: DownloadsWindowUiLocale
): void {
  const brKbps = formatBitrateKbps(typeof bitRate === 'string' ? bitRate : undefined)
  const maxKbps = formatBitrateKbps(typeof maxBitRate === 'string' ? maxBitRate : undefined)
  const maxLab = formatFfprobeBitrateLabelFromKbps(maxKbps, locale)
  if (maxLab === null || maxKbps === null) {
    return
  }
  const nominal = brKbps !== null && Number.isFinite(brKbps) && brKbps > 0 ? brKbps : null
  const threshold = nominal !== null ? Math.max(50, nominal * 0.03) : 0
  if (nominal === null || maxKbps - nominal > threshold) {
    parts.push(`max ${maxLab}`)
  }
}

/** Строки полей ffprobe вроде ratio/pix_fmt: пусто и `N/A` не показываем. */
export function ffprobeScalarDisplay(raw: string | undefined): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return null
  }
  return t
}

/** SAR 1:1 и варианты не дублируем в компактной строке detail. */
export function isSquarePixelSar(raw: string): boolean {
  const t = raw.replace(/\s+/g, '').toLowerCase()
  return t === '1:1' || t === '1/1' || t === '1'
}

export function parseTagRotateDegrees(raw: string | null): number | null {
  if (raw === null) {
    return null
  }
  const n = Number.parseFloat(raw.trim().replace(',', '.'))
  if (!Number.isFinite(n) || n === 0) {
    return null
  }
  return Math.trunc(n)
}

export function tagString(
  tags: Record<string, string | number | undefined> | undefined,
  key: string
): string | null {
  if (!tags) {
    return null
  }
  const v = tags[key]
  if (typeof v === 'string' && v.trim() !== '') {
    return v.trim()
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    return String(v)
  }
  return null
}

/** Первый непустой тег: точные ключи, затем то же имя без учёта регистра (Matroska vs Vorbis). */
export function tagStringFirstMatch(
  tags: Record<string, string | number | undefined> | undefined,
  keyOptions: readonly string[]
): string | null {
  if (!tags) {
    return null
  }
  for (const key of keyOptions) {
    const v = tagString(tags, key)
    if (v !== null) {
      return v
    }
  }
  const want = new Set(keyOptions.map((k) => k.toLowerCase()))
  for (const [k, raw] of Object.entries(tags)) {
    if (!want.has(k.toLowerCase())) {
      continue
    }
    if (typeof raw === 'string' && raw.trim() !== '') {
      return raw.trim()
    }
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return String(raw)
    }
  }
  return null
}

const FFPROBE_DETAIL_ENCODER_MAX = 64

export function collapseFfprobeDetailSnippet(raw: string): string {
  const collapsed = raw.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= FFPROBE_DETAIL_ENCODER_MAX) {
    return collapsed
  }
  return `${collapsed.slice(0, FFPROBE_DETAIL_ENCODER_MAX - 1)}…`
}

/**
 * Единая выкладка `tags.language`/`title`/`handler_name` в detail дорожки:
 * язык как есть, title с collapse, handler_name с collapse и без дубля при
 * совпадении с title (без учёта регистра/окружающих пробелов).
 */
export function appendTrackTagsLangTitleHandler(
  parts: string[],
  tags: Record<string, string | number | undefined> | undefined
): void {
  const lang = tagString(tags, 'language')
  const title = tagString(tags, 'title')
  if (lang) {
    parts.push(lang)
  }
  if (title) {
    parts.push(collapseFfprobeDetailSnippet(title))
  }
  const handlerRaw = tagString(tags, 'handler_name')
  if (handlerRaw !== null) {
    const titleNorm = title?.trim().toLowerCase() ?? ''
    const handlerNorm = handlerRaw.trim().toLowerCase()
    if (handlerNorm === '' || handlerNorm !== titleNorm) {
      parts.push(collapseFfprobeDetailSnippet(handlerRaw))
    }
  }
}

export function appendFfprobeNbFramesDetail(
  parts: string[],
  nbFramesRaw: string | number | undefined
): void {
  const nbFramesParsed =
    typeof nbFramesRaw === 'string' && nbFramesRaw.trim() !== ''
      ? Number.parseInt(nbFramesRaw.replace(/\s+/g, ''), 10)
      : typeof nbFramesRaw === 'number' && Number.isFinite(nbFramesRaw)
        ? Math.trunc(nbFramesRaw)
        : NaN
  if (Number.isFinite(nbFramesParsed) && nbFramesParsed > 0) {
    parts.push(`${nbFramesParsed} frm`)
  }
}

export function appendFfprobeReplayGainAudioDetail(
  parts: string[],
  tags: Record<string, string | number | undefined> | undefined
): void {
  const track = tagStringFirstMatch(tags, ['replaygain_track_gain', 'REPLAYGAIN_TRACK_GAIN'])
  const album = tagStringFirstMatch(tags, ['replaygain_album_gain', 'REPLAYGAIN_ALBUM_GAIN'])
  const trackPk = tagStringFirstMatch(tags, ['replaygain_track_peak', 'REPLAYGAIN_TRACK_PEAK'])
  const albumPk = tagStringFirstMatch(tags, ['replaygain_album_peak', 'REPLAYGAIN_ALBUM_PEAK'])
  if (track !== null) {
    parts.push(`RG tr ${collapseFfprobeDetailSnippet(track)}`)
  }
  if (trackPk !== null) {
    parts.push(`RG tr pk ${collapseFfprobeDetailSnippet(trackPk)}`)
  }
  if (album !== null) {
    parts.push(`RG al ${collapseFfprobeDetailSnippet(album)}`)
  }
  if (albumPk !== null) {
    parts.push(`RG al pk ${collapseFfprobeDetailSnippet(albumPk)}`)
  }
}

/** Компактная строка `tags.encoder` для колонки «Сведения» (отдельной колонки нет). */
export function formatFfprobeTagEncoderBrief(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  const raw = tagString(tags, 'encoder')
  if (raw === null) {
    return null
  }
  return collapseFfprobeDetailSnippet(raw)
}

export function formatFfprobeStartPtsDetail(
  startPts: string | number | undefined,
  timeBase: string | undefined
): string | null {
  const pts =
    typeof startPts === 'number' && Number.isFinite(startPts)
      ? String(Math.trunc(startPts))
      : typeof startPts === 'string'
        ? startPts.trim()
        : ''
  if (pts === '' || /^n\/a$/i.test(pts) || pts === '0') {
    return null
  }
  const tb = ffprobeScalarDisplay(timeBase)
  return tb === null ? `pts ${pts}` : `pts ${pts}@${tb}`
}

export function mapCodecType(raw: string | undefined): MediaProbeTrackRow['kind'] {
  switch (raw) {
    case 'video':
      return 'video'
    case 'audio':
      return 'audio'
    case 'subtitle':
      return 'subtitle'
    case 'attachment':
      return 'attachment'
    case 'data':
      return 'data'
    default:
      return 'other'
  }
}
