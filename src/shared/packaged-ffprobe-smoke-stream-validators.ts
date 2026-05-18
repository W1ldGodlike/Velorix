/**
 * §9/§18/§19 — packaged ffprobe smoke (split modules).
 */
import { parseFfprobeFormatBitRateKbps } from './ffprobe-container-format'
import { parseFfprobeFormatTagScalar } from './ffprobe-format-tag-registry'
import { formatFfprobeCodecLongNameDetail } from './ffprobe-codec-long-name'
import { formatFfprobeDispositionSummary } from './ffprobe-disposition'
import { parseFfprobeTickCount } from './ffprobe-stream-duration-ts'
import { formatFfprobeStreamStereoModeDetail } from './ffprobe-stream-stereo-mode'
import { isFfprobeSideDataListStructureOkForSmoke } from './ffprobe-side-data'
import { parseFfprobeRationalFps } from './ffprobe-video-fps'
import { isMinimalFfprobeProbeJson } from './packaged-ffprobe-smoke-minimal'

const FFPROBE_SMOKE_CODEC_TYPES = new Set(['video', 'audio', 'subtitle', 'data', 'attachment'])

type FfprobeSmokeStreamSlice = {
  codec_type?: string
  codec_name?: string
  codec_long_name?: string
  codec_time_base?: string
  time_base?: string
  duration?: string | number
  duration_ts?: string | number
  start_time?: string | number
  avg_frame_rate?: string
  r_frame_rate?: string
  bit_rate?: string | number
  max_bit_rate?: string | number
  nb_frames?: string | number
  width?: string | number
  height?: string | number
  pix_fmt?: string
  sample_aspect_ratio?: string
  display_aspect_ratio?: string
  channel_layout?: string
  channels?: string | number
  sample_rate?: string | number
  sample_fmt?: string
  profile?: string
  level?: string | number
  bits_per_sample?: string | number
  start_pts?: string | number
  codec_tag?: string | number
  codec_tag_string?: string
  color_space?: string
  color_primaries?: string
  color_transfer?: string
  color_trc?: string
  color_range?: string
  field_order?: string
  chroma_location?: string
  bits_per_raw_sample?: string | number
  bits_per_coded_sample?: string | number
  coded_width?: string | number
  coded_height?: string | number
  extradata_size?: string | number
  refs?: string | number
  has_b_frames?: string | number
  closed_captions?: string | number
  is_avc?: string | number
  ticks_per_frame?: string | number
  initial_padding?: string | number
  index?: string | number
  stream_index?: string | number
  nb_read_frames?: string | number
  nb_read_packets?: string | number
  id?: string
  disposition?: unknown
  side_data_list?: unknown
  tags?: Record<string, string | number | undefined>
}

/** Smoke: опциональные ffprobe-строки (SAR/DAR/layout и т.п.) — как ffprobeScalarDisplay в main. */
export function smokeOptionalFfprobeScalarStringField(raw: string | undefined): boolean {
  if (raw === undefined) {
    return true
  }
  if (typeof raw !== 'string') {
    return false
  }
  const t = raw.trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  return t.length > 0
}

function smokeStreamTimeBaseFractionOk(raw: string | undefined): boolean {
  if (typeof raw !== 'string' || raw.trim().length === 0 || /^n\/a$/i.test(raw.trim())) {
    return true
  }
  const norm = raw.trim().replace(/\s+/g, '')
  if (norm === '0/1' || norm === '1/1') {
    return true
  }
  return /^\d+\s*\/\s*\d+$/.test(norm)
}

function smokeOptionalStreamCodecTypeField(raw: string | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  if (typeof raw !== 'string') {
    return false
  }
  const t = raw.trim().toLowerCase()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  return FFPROBE_SMOKE_CODEC_TYPES.has(t)
}

function smokeOptionalStreamNumericField(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  const t = String(raw).trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  return Number.isFinite(Number.parseFloat(t.replace(',', '.')))
}

function smokeOptionalStreamBitRateField(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  const t = String(raw).trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  return parseFfprobeFormatBitRateKbps(raw) !== null
}

function smokeOptionalStreamPositiveIntField(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  const t = String(raw).trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  const n = Number.parseInt(t, 10)
  return Number.isFinite(n) && n > 0
}

function smokeOptionalStreamPixFmtField(raw: string | undefined): boolean {
  if (typeof raw !== 'string' || raw.trim().length === 0 || /^n\/a$/i.test(raw.trim())) {
    return true
  }
  return raw.trim().length > 0
}

function smokeOptionalStreamNbFramesField(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  const t = String(raw).trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  const n = Number.parseInt(t.replace(',', '.'), 10)
  return Number.isFinite(n) && n >= 0
}

function smokeOptionalStreamRationalFpsField(raw: string | undefined): boolean {
  if (typeof raw !== 'string' || raw.trim().length === 0 || /^n\/a$/i.test(raw.trim())) {
    return true
  }
  const norm = raw.trim().replace(/\s+/g, '')
  if (norm === '0/0') {
    return true
  }
  return parseFfprobeRationalFps(raw) !== null
}

function smokeOptionalStreamDurationTsField(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  const t = String(raw).trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  return parseFfprobeTickCount(raw) !== null
}

function smokeOptionalStreamDispositionField(raw: unknown): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return false
  }
  const o = raw as Record<string, unknown>
  for (const v of Object.values(o)) {
    if (v === undefined || v === null) {
      continue
    }
    if (typeof v === 'boolean') {
      continue
    }
    if (typeof v === 'number' && Number.isFinite(v)) {
      continue
    }
    if (typeof v === 'string') {
      const t = v.trim()
      if (t === '' || /^n\/a$/i.test(t)) {
        continue
      }
      const n = Number.parseInt(t, 10)
      if (Number.isFinite(n)) {
        continue
      }
      return false
    }
    return false
  }
  return true
}

function smokeOptionalStreamCodecTagField(raw: string | number | undefined): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  if (typeof raw === 'number') {
    return Number.isFinite(raw)
  }
  const t = raw.trim()
  if (t === '' || /^n\/a$/i.test(t) || t === '0' || t === '0x0') {
    return true
  }
  if (/^0x[0-9a-f]+$/i.test(t.replace(/\s+/g, ''))) {
    return true
  }
  const n = Number.parseInt(t, 10)
  return Number.isFinite(n)
}

/** Smoke: опциональные поля stream detail (§9) не ломают парсеры при наличии в JSON. */
export function isPackagedFfprobeProbeJsonParsableByStreamDetailFields(parsed: unknown): boolean {
  if (!isMinimalFfprobeProbeJson(parsed)) {
    return false
  }
  const streams = (parsed as { streams: unknown[] }).streams
  for (const item of streams) {
    if (item === null || typeof item !== 'object') {
      continue
    }
    const stream = item as FfprobeSmokeStreamSlice
    if (!smokeOptionalStreamCodecTypeField(stream.codec_type)) {
      return false
    }
    if (!smokeOptionalStreamDurationTsField(stream.duration_ts)) {
      return false
    }
    if (!smokeOptionalStreamNumericField(stream.start_time)) {
      return false
    }
    if (!smokeOptionalStreamNumericField(stream.duration)) {
      return false
    }
    if (!smokeOptionalStreamRationalFpsField(stream.avg_frame_rate)) {
      return false
    }
    if (!smokeOptionalStreamRationalFpsField(stream.r_frame_rate)) {
      return false
    }
    if (!smokeOptionalStreamBitRateField(stream.bit_rate)) {
      return false
    }
    if (!smokeOptionalStreamBitRateField(stream.max_bit_rate)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.nb_frames)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.width)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.height)) {
      return false
    }
    if (!smokeOptionalStreamPixFmtField(stream.pix_fmt)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.sample_aspect_ratio)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.display_aspect_ratio)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.channel_layout)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.channels)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.codec_name)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.sample_rate)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.sample_fmt)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.profile)) {
      return false
    }
    if (!smokeOptionalStreamNumericField(stream.level)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.bits_per_sample)) {
      return false
    }
    if (!smokeOptionalStreamDurationTsField(stream.start_pts)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.codec_tag_string)) {
      return false
    }
    if (!smokeOptionalStreamCodecTagField(stream.codec_tag)) {
      return false
    }
    if (!smokeOptionalFormatTagsField(stream.tags)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.color_space)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.color_primaries)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.color_transfer)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.color_trc)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.color_range)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.field_order)) {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(stream.chroma_location)) {
      return false
    }
    if (!smokeOptionalStreamNumericField(stream.bits_per_raw_sample)) {
      return false
    }
    if (!smokeOptionalStreamNumericField(stream.bits_per_coded_sample)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.coded_width)) {
      return false
    }
    if (!smokeOptionalStreamPositiveIntField(stream.coded_height)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.extradata_size)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.refs)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.has_b_frames)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.closed_captions)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.is_avc)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.ticks_per_frame)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.initial_padding)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.index)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.stream_index)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.nb_read_frames)) {
      return false
    }
    if (!smokeOptionalStreamNbFramesField(stream.nb_read_packets)) {
      return false
    }
    if (!smokeOptionalStreamCodecTagField(stream.id)) {
      return false
    }
    if (!smokeOptionalStreamDispositionField(stream.disposition)) {
      return false
    }
    if (!isFfprobeSideDataListStructureOkForSmoke(stream.side_data_list)) {
      return false
    }
    if (!smokeStreamTimeBaseFractionOk(stream.codec_time_base)) {
      return false
    }
    if (!smokeStreamTimeBaseFractionOk(stream.time_base)) {
      return false
    }
    const longRaw = stream.codec_long_name
    if (typeof longRaw === 'string' && longRaw.trim().length > 0) {
      formatFfprobeCodecLongNameDetail(stream.codec_name, longRaw)
    }
    formatFfprobeStreamStereoModeDetail(stream.tags)
    formatFfprobeDispositionSummary(stream.disposition)
  }
  return true
}
export function smokeOptionalFormatTagsField(tags: unknown): boolean {
  if (tags === undefined || tags === null) {
    return true
  }
  if (typeof tags !== 'object' || Array.isArray(tags)) {
    return false
  }
  const rec = tags as Record<string, string | number | undefined>
  for (const [key, val] of Object.entries(rec)) {
    if (val === undefined || val === null) {
      continue
    }
    if (typeof val === 'string' && val.trim() === '') {
      continue
    }
    const parsed = parseFfprobeFormatTagScalar(rec, key)
    if (parsed === null && !(typeof val === 'number' && Number.isFinite(val))) {
      return false
    }
  }
  return true
}
