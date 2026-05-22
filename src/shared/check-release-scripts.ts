/**
 * §19 — npm-цепочки `check:release` / `check:release:local` (Support ZIP и guard-тесты).
 */

import { formatElectronViteEsmShimFixDiagnosticLine } from './electron-vite-build-meta'
import {
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine,
  formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine
} from './packaged-gui-e2e-playwright-meta'
import {
  formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine,
  formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine
} from './release-code-signing-roadmap'
import { formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine } from './toolchain-baseline-wip-handoff-meta'

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
    formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine(),
    formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine(),
    formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine(),
    formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine(),
    formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine(),
    formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine(),
    'smoke skips: VELORIX_SKIP_PACK_VERIFY, VELORIX_SKIP_FFPROBE_SMOKE, VELORIX_SKIP_FFMPEG_SMOKE, VELORIX_SKIP_YTDLP_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (2× locales:terminal-summaries-ru, 0 replacements / 0 gloss)'
  ]
}
