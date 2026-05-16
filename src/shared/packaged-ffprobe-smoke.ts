/**
 * §9/§19 — разрешение пути к bundled ffprobe и минимальная проверка JSON probe.
 */
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
