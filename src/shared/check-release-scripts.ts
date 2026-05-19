/**
 * §19 — npm-цепочки `check:release` / `check:release:local` (Support ZIP и guard-тесты).
 */

import { formatElectronViteEsmShimFixDiagnosticLine } from './electron-vite-build-meta'
import { formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine } from './packaged-gui-e2e-playwright-meta'

export const CHECK_RELEASE_NPM_SCRIPT = 'check:release'
export const CHECK_RELEASE_LOCAL_NPM_SCRIPT = 'check:release:local'

/** Подсказки без запуска npm (Support ZIP / Vitest). */
export function formatCheckReleaseScriptDiagnosticLines(): string[] {
  return [
    `full: npm run ${CHECK_RELEASE_NPM_SCRIPT} (check + engines:prepare:win + doctor + build + pack:dir + smoke:packaged-release + audit:moderate)`,
    `local: npm run ${CHECK_RELEASE_LOCAL_NPM_SCRIPT} (engines:doctor + build + pack:dir + smoke:packaged-release + audit:moderate; project bin/ must exist)`,
    'prerequisite local: npm run engines:prepare:win once (or predev)',
    formatElectronViteEsmShimFixDiagnosticLine(),
    formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine(),
    'smoke skips: FLUXALLOY_SKIP_PACK_VERIFY, FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_SKIP_FFMPEG_SMOKE, FLUXALLOY_SKIP_YTDLP_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (2× locales:terminal-summaries-ru, 0 replacements / 0 gloss)'
  ]
}
