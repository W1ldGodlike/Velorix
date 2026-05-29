/**
 * §19 — npm-скрипты упаковки по платформам (Support ZIP / guard-тесты).
 */

import {
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  formatTerminalContractHintsDiagnosticLine
} from './terminal-contract-hints-meta'
import { formatElectronViteEsmShimFixDiagnosticLine } from './electron-vite-build-meta'
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
    'engines mac/linux: положить бинарники в bin/ → engines:doctor → pack:*:dir (см. bin/README.md)',
    `ci: windows-latest (${ENGINES_PREPARE_WIN_NPM_SCRIPT} + packaged smokes); ${ENGINES_CI_LINUX_RUNNER} (${PACK_LINUX_DIR_NPM_SCRIPT} + ${VERIFY_LINUX_UNPACKED_NPM_SCRIPT}, без engines prepare); mac — job нет`,
    formatElectronViteEsmShimFixDiagnosticLine(),
    'pack verify skip: VELORIX_SKIP_PACK_VERIFY',
    '§8 terminal RU summaries (optional): npm run check:terminal-summaries-ru after locales:terminal-summaries-ru',
    `terminal hints Help: npm run ${TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT}`,
    `terminal hints shards: ${formatTerminalContractHintsDiagnosticLine()}`,
    formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine(),
    'packaging scripts: npm run check:platform-packaging-scripts (PLATFORM_PACKAGING_NPM_SCRIPTS)',
    'CI packaged: npm run pack:dir && npm run verify:win-unpacked',
    'Support ZIP unpackedLayout: win/linux/macos layout (present/missing)',
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
