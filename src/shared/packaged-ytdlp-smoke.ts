/**
 * §6/§19 — разрешение пути к bundled yt-dlp и минимальная проверка offline CLI.
 */
export { listPackagedYtdlpCandidatePaths } from './packaged-engine-candidate-paths'

/** Ненулевой список имён экстракторов из `yt-dlp --list-extractors` (без сети). */
export function isMinimalYtdlpExtractorsOutput(text: string): boolean {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('['))
  return lines.length >= 32
}
