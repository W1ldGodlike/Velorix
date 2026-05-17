/**
 * §19 — кандидаты путей bundled engines (только join/env; без ffprobe parse).
 * Импортируется Node smoke-скриптами через `.ts` без тяжёлых зависимостей.
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

export function listPackagedYtdlpCandidatePaths(rootDir: string): string[] {
  const fromEnv =
    typeof process.env['FLUXALLOY_YTDLP_PATH'] === 'string'
      ? process.env['FLUXALLOY_YTDLP_PATH'].trim()
      : ''
  const winName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
  const candidates: string[] = []
  if (fromEnv.length > 0) {
    candidates.push(fromEnv)
  }
  candidates.push(join(rootDir, 'dist', 'win-unpacked', 'resources', 'bin', winName))
  candidates.push(join(rootDir, 'bin', winName))
  return candidates
}
