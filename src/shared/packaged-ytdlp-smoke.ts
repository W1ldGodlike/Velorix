/**
 * §6/§19 — разрешение пути к bundled yt-dlp и минимальная проверка offline CLI.
 */
import { join } from 'node:path'

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

/** Ненулевой список имён экстракторов из `yt-dlp --list-extractors` (без сети). */
export function isMinimalYtdlpExtractorsOutput(text: string): boolean {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('['))
  return lines.length >= 32
}
