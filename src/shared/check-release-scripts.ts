/**
 * §19 — npm-цепочки `check:release` / `check:release:local` (Support ZIP и guard-тесты).
 */

import { formatElectronViteEsmShimFixDiagnosticLine } from './electron-vite-build-meta'
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
    `full: npm run ${CHECK_RELEASE_NPM_SCRIPT} (check + engines:prepare:win + doctor + build + pack:dir + verify:win-unpacked + audit:moderate)`,
    `local: npm run ${CHECK_RELEASE_LOCAL_NPM_SCRIPT} (engines:doctor + build + pack:dir + verify:win-unpacked + audit:moderate; project bin/ must exist)`,
    'prerequisite local: npm run engines:prepare:win once (or predev)',
    formatElectronViteEsmShimFixDiagnosticLine(),
    formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine(),
    formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine(),
    formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine(),
    formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine(),
    'pack verify skip: VELORIX_SKIP_PACK_VERIFY',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (2× locales:terminal-summaries-ru, 0 replacements / 0 gloss)'
  ]
}
