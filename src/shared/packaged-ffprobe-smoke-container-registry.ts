/**
 * §9/§18/§19 — packaged ffprobe smoke (split modules).
 */
import {
  parseFfprobeContainerFieldsFromFormat,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatDurationSec,
  parseFfprobeFormatNbChapters,
  parseFfprobeFormatNbPrograms
} from './ffprobe-container-format'
import type { FfprobeFormatJsonSlice } from './ffprobe-container-field-registry'
import { isFfprobeChaptersArrayOkForSmoke } from './ffprobe-chapters'
import {
  isPackagedFfprobeProbeJsonParsableByStreamDetailFields,
  smokeOptionalFfprobeScalarStringField,
  smokeOptionalFormatTagsField
} from './packaged-ffprobe-smoke-stream-validators'
import { isMinimalFfprobeProbeJson } from './packaged-ffprobe-smoke-minimal'

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
  const formatLongNameRaw = (format as { format_long_name?: unknown }).format_long_name
  if (formatLongNameRaw !== undefined && formatLongNameRaw !== null) {
    if (typeof formatLongNameRaw !== 'string') {
      return false
    }
    if (!smokeOptionalFfprobeScalarStringField(formatLongNameRaw)) {
      return false
    }
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
