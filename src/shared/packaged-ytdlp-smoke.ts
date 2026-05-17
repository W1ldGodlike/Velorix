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

/** §18/§19 Support ZIP — подсказки smoke:packaged-ytdlp без запуска exe. */
export function formatPackagedYtdlpSmokeDiagnosticLines(): string[] {
  return [
    'command: npm run smoke:packaged-ytdlp (part of smoke:packaged-engines)',
    'check: yt-dlp --list-extractors offline (isMinimalYtdlpExtractorsOutput)',
    'env: FLUXALLOY_YTDLP_PATH, FLUXALLOY_SKIP_YTDLP_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)'
  ]
}
