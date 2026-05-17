/**
 * §9/§18/§19 — разрешение пути к bundled ffprobe и проверка JSON probe (+ registry контейнера).
 */
import { parseFfprobeContainerFieldsFromFormat } from './ffprobe-container-format'
import type { FfprobeFormatJsonSlice } from './ffprobe-container-field-registry'
import { join } from 'node:path'

export function listPackagedFfprobeCandidatePaths(rootDir: string): string[] {
  const fromEnv =
    typeof process.env['FLUXALLOY_FFPROBE_PATH'] === 'string'
      ? process.env['FLUXALLOY_FFPROBE_PATH'].trim()
      : ''
  const winName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
  const candidates: string[] = []
  if (fromEnv.length > 0) {
    candidates.push(fromEnv)
  }
  candidates.push(join(rootDir, 'dist', 'win-unpacked', 'resources', 'bin', winName))
  candidates.push(join(rootDir, 'bin', winName))
  return candidates
}

export function listPackagedFfmpegCandidatePaths(rootDir: string): string[] {
  const fromEnv =
    typeof process.env['FLUXALLOY_FFMPEG_PATH'] === 'string'
      ? process.env['FLUXALLOY_FFMPEG_PATH'].trim()
      : ''
  const winName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  const candidates: string[] = []
  if (fromEnv.length > 0) {
    candidates.push(fromEnv)
  }
  candidates.push(join(rootDir, 'dist', 'win-unpacked', 'resources', 'bin', winName))
  candidates.push(join(rootDir, 'bin', winName))
  return candidates
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
  if (durationTsRaw !== undefined && durationTsRaw !== null && String(durationTsRaw).trim() !== '') {
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
  return true
}

/** §18 Support ZIP — подсказки smoke без запуска ffprobe. */
export function formatPackagedFfprobeSmokeDiagnosticLines(): string[] {
  return [
    'command: npm run smoke:packaged-ffprobe (part of smoke:packaged-engines)',
    'check: isMinimalFfprobeProbeJson + isPackagedFfprobeProbeJsonParsableByContainerRegistry',
    'registry optional: format.duration_ts, format.time_base, format.probe_size (parse must not fail)',
    'stream detail optional: codec_time_base (ctb when distinct from time_base)',
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
