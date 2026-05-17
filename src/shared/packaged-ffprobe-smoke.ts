/**
 * §9/§18/§19 — разрешение пути к bundled ffprobe и проверка JSON probe (+ registry контейнера).
 */
import {
  parseFfprobeContainerFieldsFromFormat,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatDurationSec,
  parseFfprobeFormatNbChapters,
  parseFfprobeFormatNbPrograms
} from './ffprobe-container-format'
import type { FfprobeFormatJsonSlice } from './ffprobe-container-field-registry'
import { parseFfprobeFormatTagScalar } from './ffprobe-format-tag-registry'
import { formatFfprobeCodecLongNameDetail } from './ffprobe-codec-long-name'
import { parseFfprobeTickCount } from './ffprobe-stream-duration-ts'
import { formatFfprobeStreamStereoModeDetail } from './ffprobe-stream-stereo-mode'
import { isFfprobeChaptersArrayOkForSmoke } from './ffprobe-chapters'
import { isFfprobeSideDataListStructureOkForSmoke } from './ffprobe-side-data'
import { parseFfprobeRationalFps } from './ffprobe-video-fps'
import {
  listPackagedFfmpegCandidatePaths,
  listPackagedFfprobeCandidatePaths
} from './packaged-engine-candidate-paths'

export { listPackagedFfmpegCandidatePaths, listPackagedFfprobeCandidatePaths }

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
  side_data_list?: unknown
  tags?: Record<string, string | number | undefined>
}

/** Smoke: опциональные ffprobe-строки (SAR/DAR/layout и т.п.) — как ffprobeScalarDisplay в main. */
function smokeOptionalFfprobeScalarStringField(raw: string | undefined): boolean {
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

export function isMinimalFfprobeProbeJson(parsed: unknown): boolean {
  if (parsed === null || typeof parsed !== 'object') {
    return false
  }
  const o = parsed as Record<string, unknown>
  const streams = o['streams']
  if (!Array.isArray(streams) || streams.length < 1) {
    return false
  }
  const format = o['format']
  if (format === null || typeof format !== 'object') {
    return false
  }
  return true
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
  }
  return true
}

function smokeOptionalFormatTagsField(tags: unknown): boolean {
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

function smokeOptionalContainerStartTimeField(
  raw: string | number | undefined,
  parsedSec: number | null
): boolean {
  if (raw === undefined || raw === null) {
    return true
  }
  const t = String(raw).trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return true
  }
  const sec = Number.parseFloat(t.replace(',', '.'))
  if (Number.isFinite(sec) && Math.abs(sec) < 0.0005) {
    return true
  }
  return parsedSec !== null
}

/** Smoke: реальный ffprobe JSON проходит `parseFfprobeContainerFieldsFromFormat` (связка с §9 registry). */
export function isPackagedFfprobeProbeJsonParsableByContainerRegistry(parsed: unknown): boolean {
  if (!isMinimalFfprobeProbeJson(parsed)) {
    return false
  }
  const format = (parsed as { format: FfprobeFormatJsonSlice }).format
  const formatNameRaw = (format as { format_name?: string }).format_name
  const formatName = typeof formatNameRaw === 'string' ? formatNameRaw.trim() : ''
  if (formatName.length === 0) {
    return false
  }
  const container = parseFfprobeContainerFieldsFromFormat(format)
  const nbStreams = container.containerNbStreams
  if (typeof nbStreams !== 'number' || nbStreams < 1) {
    return false
  }
  const durationTsRaw = (format as { duration_ts?: string | number }).duration_ts
  if (
    durationTsRaw !== undefined &&
    durationTsRaw !== null &&
    String(durationTsRaw).trim() !== ''
  ) {
    if (container.containerDurationTs === null) {
      return false
    }
  }
  const timeBaseRaw = (format as { time_base?: string }).time_base
  if (typeof timeBaseRaw === 'string' && timeBaseRaw.trim().length > 0) {
    const norm = timeBaseRaw.trim().replace(/\s+/g, '')
    if (norm !== '0/1' && norm !== '1/1' && container.containerTimeBase === null) {
      return false
    }
  }
  const probeSizeRaw = (format as { probe_size?: string | number }).probe_size
  if (probeSizeRaw !== undefined && probeSizeRaw !== null && String(probeSizeRaw).trim() !== '') {
    if (container.containerProbeSizeBytes === null) {
      return false
    }
  }
  const flagsRaw = (format as { flags?: string | number }).flags
  if (flagsRaw !== undefined && flagsRaw !== null && String(flagsRaw).trim() !== '') {
    if (container.containerFormatFlags === null) {
      return false
    }
  }
  const probeScoreRaw = (format as { probe_score?: string | number }).probe_score
  if (
    probeScoreRaw !== undefined &&
    probeScoreRaw !== null &&
    String(probeScoreRaw).trim() !== ''
  ) {
    if (container.probeScore === null) {
      return false
    }
  }
  const filenameRaw = (format as { filename?: string }).filename
  if (typeof filenameRaw === 'string' && filenameRaw.trim().length > 0) {
    if (container.containerFilename === null) {
      return false
    }
  }
  const bitRateRaw = (format as { bit_rate?: string | number }).bit_rate
  if (bitRateRaw !== undefined && bitRateRaw !== null && String(bitRateRaw).trim() !== '') {
    if (parseFfprobeFormatBitRateKbps(bitRateRaw) === null) {
      return false
    }
  }
  const durationRaw = (format as { duration?: string | number }).duration
  if (durationRaw !== undefined && durationRaw !== null && String(durationRaw).trim() !== '') {
    const t = String(durationRaw).trim()
    if (!/^n\/a$/i.test(t) && parseFfprobeFormatDurationSec(durationRaw) === null) {
      return false
    }
  }
  const startRaw = (format as { start_time?: string | number }).start_time
  if (!smokeOptionalContainerStartTimeField(startRaw, container.containerStartTimeSec)) {
    return false
  }
  const startRealRaw = (format as { start_time_real?: string | number }).start_time_real
  if (!smokeOptionalContainerStartTimeField(startRealRaw, container.containerStartTimeRealSec)) {
    return false
  }
  const tagsRaw = (format as { tags?: unknown }).tags
  if (!smokeOptionalFormatTagsField(tagsRaw)) {
    return false
  }
  const sizeRaw = (format as { size?: string | number }).size
  if (sizeRaw !== undefined && sizeRaw !== null && String(sizeRaw).trim() !== '') {
    if (container.containerSizeBytes === null) {
      return false
    }
  }
  const nbProgramsRaw = (format as { nb_programs?: string | number }).nb_programs
  if (
    nbProgramsRaw !== undefined &&
    nbProgramsRaw !== null &&
    String(nbProgramsRaw).trim() !== ''
  ) {
    if (parseFfprobeFormatNbPrograms(nbProgramsRaw) === null) {
      return false
    }
  }
  const nbChaptersRaw = (format as { nb_chapters?: string | number }).nb_chapters
  if (
    nbChaptersRaw !== undefined &&
    nbChaptersRaw !== null &&
    String(nbChaptersRaw).trim() !== ''
  ) {
    if (parseFfprobeFormatNbChapters(nbChaptersRaw) === null) {
      return false
    }
  }
  const chaptersRaw = (parsed as { chapters?: unknown }).chapters
  if (!isFfprobeChaptersArrayOkForSmoke(chaptersRaw)) {
    return false
  }
  return isPackagedFfprobeProbeJsonParsableByStreamDetailFields(parsed)
}

/** §9 smoke-скрипт: format registry + stream detail optional fields. */
export function isPackagedFfprobeProbeJsonParsableForSmoke(parsed: unknown): boolean {
  return isPackagedFfprobeProbeJsonParsableByContainerRegistry(parsed)
}

/** §18 Support ZIP — подсказки smoke без запуска ffprobe. */
export function formatPackagedFfprobeSmokeDiagnosticLines(): string[] {
  return [
    'command: npm run smoke:packaged-ffprobe (part of smoke:packaged-engines)',
    'check: isMinimalFfprobeProbeJson + isPackagedFfprobeProbeJsonParsableForSmoke (format + stream detail)',
    'registry optional: format.duration, duration_ts, time_base, size, probe_size, flags, probe_score, filename, bit_rate, start_time, start_time_real, nb_programs, nb_chapters, format.tags.* (parseFfprobeFormatTagScalar)',
    'probe optional: chapters[] (buildChapterRowsFromFfprobeJson / isFfprobeChaptersArrayOkForSmoke)',
    'stream detail optional: codec_type, duration, duration_ts, start_time, fps, bit_rate, nb_frames, width/height/pix_fmt, sample_aspect_ratio, display_aspect_ratio, channel_layout, channels, side_data_list, time_base, codec_long_name, tags.stereo_mode',
    'ui/export: formatFfprobeContainerDiagnostics* (filename + probe layout + offset/timing)',
    'env: FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_FFPROBE_SMOKE_PROBE=0, FLUXALLOY_FFPROBE_PATH'
  ]
}

export function buildSupportZipFfprobeSmokeLines(
  rootDir: string,
  fileExists: (path: string) => boolean
): string[] {
  return [
    ...formatPackagedFfprobeSmokeDiagnosticLines(),
    ...listPackagedFfprobeCandidatePaths(rootDir).map(
      (p) => `candidate: ${p} (${fileExists(p) ? 'present' : 'missing'})`
    )
  ]
}
