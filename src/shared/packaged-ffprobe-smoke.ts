/**
 * §9/§18/§19 — разрешение пути к bundled ffprobe и проверка JSON probe (+ registry контейнера).
 */
import {
  parseFfprobeContainerFieldsFromFormat,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatDurationSec
} from './ffprobe-container-format'
import type { FfprobeFormatJsonSlice } from './ffprobe-container-field-registry'
import { formatFfprobeCodecLongNameDetail } from './ffprobe-codec-long-name'
import { parseFfprobeTickCount } from './ffprobe-stream-duration-ts'
import { formatFfprobeStreamStereoModeDetail } from './ffprobe-stream-stereo-mode'
import {
  listPackagedFfmpegCandidatePaths,
  listPackagedFfprobeCandidatePaths
} from './packaged-engine-candidate-paths'

export { listPackagedFfmpegCandidatePaths, listPackagedFfprobeCandidatePaths }

type FfprobeSmokeStreamSlice = {
  codec_name?: string
  codec_long_name?: string
  codec_time_base?: string
  time_base?: string
  duration_ts?: string | number
  start_time?: string | number
  tags?: Record<string, string | number | undefined>
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
    if (!smokeOptionalStreamDurationTsField(stream.duration_ts)) {
      return false
    }
    if (!smokeOptionalStreamNumericField(stream.start_time)) {
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
    'registry optional: format.duration, duration_ts, time_base, probe_size, flags, probe_score, filename, bit_rate, start_time, start_time_real (parse must not fail)',
    'stream detail optional: duration_ts, start_time, codec_time_base, time_base, codec_long_name, tags.stereo_mode',
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
