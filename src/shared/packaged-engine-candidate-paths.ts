/**
 * §19 — кандидаты путей bundled engines (только join/env; без ffprobe parse).
 * Импортируется Node smoke-скриптами через `.ts` без тяжёлых зависимостей.
 */
import { join } from 'node:path'

import { nativeMainEngineBinaryName } from './native-main-platform'

export function listPackagedFfprobeCandidatePaths(rootDir: string): string[] {
  const fromEnv =
    typeof process.env['FLUXALLOY_FFPROBE_PATH'] === 'string'
      ? process.env['FLUXALLOY_FFPROBE_PATH'].trim()
      : ''
  const winName = nativeMainEngineBinaryName('ffprobe')
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
  const winName = nativeMainEngineBinaryName('ffmpeg')
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
  const winName = nativeMainEngineBinaryName('yt-dlp')
  const candidates: string[] = []
  if (fromEnv.length > 0) {
    candidates.push(fromEnv)
  }
  candidates.push(join(rootDir, 'dist', 'win-unpacked', 'resources', 'bin', winName))
  candidates.push(join(rootDir, 'bin', winName))
  return candidates
}
