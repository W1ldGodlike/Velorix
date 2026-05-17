/**
 * §19 — npm-цепочки `check:release` / `check:release:local` (Support ZIP и guard-тесты).
 */

export const CHECK_RELEASE_NPM_SCRIPT = 'check:release'
export const CHECK_RELEASE_LOCAL_NPM_SCRIPT = 'check:release:local'

/** Подсказки без запуска npm (Support ZIP / Vitest). */
export function formatCheckReleaseScriptDiagnosticLines(): string[] {
  return [
    `full: npm run ${CHECK_RELEASE_NPM_SCRIPT} (check + engines:prepare:win + doctor + build + pack:dir + smoke:packaged-release + audit:moderate)`,
    `local: npm run ${CHECK_RELEASE_LOCAL_NPM_SCRIPT} (engines:doctor + build + pack:dir + smoke:packaged-release + audit:moderate; project bin/ must exist)`,
    'prerequisite local: npm run engines:prepare:win once (or predev)',
    'smoke skips: FLUXALLOY_SKIP_PACK_VERIFY, FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_SKIP_FFMPEG_SMOKE, FLUXALLOY_SKIP_YTDLP_SMOKE'
  ]
}
