/**
 * §19 — npm-скрипты упаковки по платформам (Support ZIP / guard-тесты).
 */

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET,
  formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine
} from './packaged-e2e-help-workflow-crosslinks-meta'
import {
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  formatTerminalContractHintsDiagnosticLine
} from './terminal-contract-hints-meta'
import { formatElectronViteEsmShimFixDiagnosticLine } from './electron-vite-build-meta'
import {
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine,
  formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT
} from './packaged-gui-e2e-playwright-meta'
import {
  BUILD_LINUX_NPM_SCRIPT,
  BUILD_MAC_NPM_SCRIPT,
  ENGINES_CI_LINUX_RUNNER,
  LINUX_RELEASE_LOCAL_ONLY_POLICY,
  MAC_PACK_LOCAL_ONLY_POLICY,
  ENGINES_PREPARE_LINUX_NPM_SCRIPT,
  ENGINES_PREPARE_MAC_NPM_SCRIPT,
  ENGINES_PREPARE_WIN_NPM_SCRIPT,
  PACK_LINUX_DIR_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT
} from './platform-packaging-npm-scripts'
import {
  formatLinuxReleaseCodeSigningRoadmapDiagnosticLine,
  formatMacosReleaseCodeSigningRoadmapDiagnosticLine,
  formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine,
  formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine,
  formatWindowsReleaseCodeSigningRoadmapDiagnosticLine
} from './release-code-signing-roadmap'
import { formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine } from './toolchain-baseline-wip-handoff-meta'

export {
  formatLinuxReleaseCodeSigningRoadmapDiagnosticLine,
  formatLinuxReleaseCodeSigningRoadmapHelpClause,
  formatMacosReleaseCodeSigningRoadmapDiagnosticLine,
  formatMacosReleaseCodeSigningRoadmapHelpClause,
  formatReleaseCodeSigningRoadmapBinReadmeLine,
  formatReleaseCodeSigningRoadmapAgentsElectronBuilderBullet,
  formatReleaseCodeSigningRoadmapReadmeElectronBuilderLine,
  formatWindowsReleaseCodeSigningRoadmapDiagnosticLine,
  formatWindowsReleaseCodeSigningRoadmapHelpClause
} from './release-code-signing-roadmap'

export {
  BUILD_LINUX_NPM_SCRIPT,
  BUILD_MAC_NPM_SCRIPT,
  BUILD_WIN_NPM_SCRIPT,
  ENGINES_CI_LINUX_RUNNER,
  ENGINES_CI_PREPARE_PLATFORM,
  LINUX_RELEASE_LOCAL_ONLY_POLICY,
  MAC_PACK_LOCAL_ONLY_POLICY,
  ENGINES_PREPARE_LINUX_NPM_SCRIPT,
  ENGINES_PREPARE_MAC_NPM_SCRIPT,
  ENGINES_PREPARE_WIN_NPM_SCRIPT,
  PACK_LINUX_DIR_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  PLATFORM_PACKAGING_NPM_SCRIPTS,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT
} from './platform-packaging-npm-scripts'

/** Подсказки без запуска electron-builder. */
export function formatPlatformPackagingDiagnosticLines(): string[] {
  return [
    `windows: npm run check:release | check:release:local | release:win* (${ENGINES_PREPARE_WIN_NPM_SCRIPT} + doctor)`,
    `mac (${MAC_PACK_LOCAL_ONLY_POLICY}): npm run ${PACK_MAC_DIR_NPM_SCRIPT} + ${VERIFY_MAC_UNPACKED_NPM_SCRIPT} на darwin; ${BUILD_MAC_NPM_SCRIPT} (dmg); engines/bin вручную`,
    `linux: CI ${PACK_LINUX_DIR_NPM_SCRIPT} + ${VERIFY_LINUX_UNPACKED_NPM_SCRIPT}; ${LINUX_RELEASE_LOCAL_ONLY_POLICY}: ${BUILD_LINUX_NPM_SCRIPT} + ${VERIFY_LINUX_RELEASE_NPM_SCRIPT} на linux; engines/bin вручную`,
    `engines prepare: npm run ${ENGINES_PREPARE_WIN_NPM_SCRIPT} (Windows; predev via predev-engines.mjs); mac/linux — ${ENGINES_PREPARE_MAC_NPM_SCRIPT}|${ENGINES_PREPARE_LINUX_NPM_SCRIPT} + engines:doctor (bin/ffmpeg, ffprobe, yt-dlp)`,
    `engines mac/linux: положить бинарники в bin/ → engines:doctor → pack:*:dir (см. ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH})`,
    `ci: windows-latest (${ENGINES_PREPARE_WIN_NPM_SCRIPT} + packaged smokes); ${ENGINES_CI_LINUX_RUNNER} (${PACK_LINUX_DIR_NPM_SCRIPT} + ${VERIFY_LINUX_UNPACKED_NPM_SCRIPT}, без engines prepare); mac — job нет`,
    formatElectronViteEsmShimFixDiagnosticLine(),
    'smoke skips: FLUXALLOY_SKIP_PACK_VERIFY, FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_SKIP_FFMPEG_SMOKE, FLUXALLOY_SKIP_YTDLP_SMOKE',
    '§8 terminal RU summaries (optional): npm run check:terminal-summaries-ru after locales:terminal-summaries-ru',
    `terminal hints Help: npm run ${TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT}`,
    `terminal hints shards: ${formatTerminalContractHintsDiagnosticLine()}`,
    formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine(),
    'packaged owner-smoke: npm run check:packaged-manual-smoke-parity (win/linux/macos Step_* + meta)',
    'owner visual smoke: npm run check:owner-visual-smoke-locale (theme/HiDPI settings.json ru/en)',
    'packaging scripts: npm run check:platform-packaging-scripts (PLATFORM_PACKAGING_NPM_SCRIPTS)',
    `help workflow smoke: ${formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine()}`,
    `help workflow partition: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}`,
    `help workflow partition guard: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET} in all ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow Help`,
    formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine(),
    `help smoke guards: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS.join(', ')} (check:help-smoke-guards-package-json)`,
    `§21 e2e registry: npm run check:packaged-e2e-scenarios-registry (2 ci-headless, ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e, 2 manual-owner; per-step e2e <id>:)`,
    formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine(),
    formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine(),
    formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine(),
    '§21 playwright GUI e2e: npm run test:e2e:gui → planned-gui-e2e.spec.ts + planned-gui-e2e-step-runners.ts (skip без FLUXALLOY_E2E_APP)',
    'CI packaged: npm run smoke:packaged-release (verify:win-unpacked + app + engines leaf smokes)',
    'Support ZIP releaseSmoke: win/linux/macos layout (present/missing) + §21 e2e per-step lines',
    formatWindowsReleaseCodeSigningRoadmapDiagnosticLine(),
    formatLinuxReleaseCodeSigningRoadmapDiagnosticLine(),
    formatMacosReleaseCodeSigningRoadmapDiagnosticLine(),
    formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine(),
    formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine(),
    formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine(),
    formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine(),
    'Support ZIP terminalHints: §8 dev guards (formatTerminalContractHintsSupportZipLines; check:support-bundle-terminal-hints)'
  ]
}
