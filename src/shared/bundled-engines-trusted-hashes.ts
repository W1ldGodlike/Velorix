/**
 * §3/§19 — bundled engines и `Data/trusted_hashes.json` (документация для Support ZIP / guards).
 */

export const BUNDLED_ENGINE_EXE_JSON_KEYS = ['yt-dlp.exe', 'ffmpeg.exe', 'ffprobe.exe'] as const

/** §18 Support ZIP / diagnostics — без чтения `trusted_hashes.json` с диска. */
export function formatBundledEnginesTrustedHashDiagnosticLines(): string[] {
  return [
    'engines: npm run engines:doctor (verify-bundled + report-hashes; part of check:release)',
    'fill SHA: npm run engines:report-hashes → Data/trusted_hashes.json windows-x64',
    `trusted_keys: ${BUNDLED_ENGINE_EXE_JSON_KEYS.join(', ')}`,
    'strict: FLUXALLOY_ENGINES_STRICT=1 — non-empty SHA256 must match bin/*.exe',
    'smoke skips (engines): FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_SKIP_FFMPEG_SMOKE, FLUXALLOY_SKIP_YTDLP_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)'
  ]
}
