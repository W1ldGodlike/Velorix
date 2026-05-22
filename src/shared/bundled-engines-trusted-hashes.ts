/**
 * §3/§19 — bundled engines и `Data/trusted_hashes.json` (документация для Support ZIP / guards).
 */

export const BUNDLED_ENGINE_EXE_JSON_KEYS = ['yt-dlp.exe', 'ffmpeg.exe', 'ffprobe.exe'] as const

export const BUNDLED_ENGINE_UNIX_BIN_NAMES = ['yt-dlp', 'ffmpeg', 'ffprobe'] as const

/** §18 Support ZIP / diagnostics — без чтения `trusted_hashes.json` с диска. */
export function formatBundledEnginesTrustedHashDiagnosticLines(): string[] {
  return [
    'engines: npm run engines:doctor (verify bin/ win *.exe or mac/linux ffmpeg, ffprobe, yt-dlp)',
    'fill SHA: npm run engines:report-hashes → Data/trusted_hashes.json windows-x64',
    `trusted_win: ${BUNDLED_ENGINE_EXE_JSON_KEYS.join(', ')}`,
    `trusted_unix: ${BUNDLED_ENGINE_UNIX_BIN_NAMES.join(', ')}`,
    'strict: VELORIX_ENGINES_STRICT=1 — non-empty SHA256 must match bin/*.exe',
    'smoke skips (engines): VELORIX_SKIP_FFPROBE_SMOKE, VELORIX_SKIP_FFMPEG_SMOKE, VELORIX_SKIP_YTDLP_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)'
  ]
}
