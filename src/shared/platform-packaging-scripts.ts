/**
 * §19 — npm-скрипты упаковки по платформам (Support ZIP / guard-тесты).
 */

export const BUILD_MAC_NPM_SCRIPT = 'build:mac'
export const BUILD_LINUX_NPM_SCRIPT = 'build:linux'
export const BUILD_WIN_NPM_SCRIPT = 'build:win'
export const ENGINES_PREPARE_WIN_NPM_SCRIPT = 'engines:prepare:win'

/** CI: Windows runner + prepare win (см. `.github/workflows/ci.yml` job `check`). */
export const ENGINES_CI_PREPARE_PLATFORM = 'win32' as const

/** CI: Linux packaging smoke без macOS runner (job `linux-packaging`). */
export const ENGINES_CI_LINUX_RUNNER = 'ubuntu-latest' as const
export const PACK_LINUX_DIR_NPM_SCRIPT = 'pack:linux:dir'
export const PACK_MAC_DIR_NPM_SCRIPT = 'pack:mac:dir'
export const VERIFY_LINUX_UNPACKED_NPM_SCRIPT = 'verify:linux-unpacked'
export const VERIFY_LINUX_RELEASE_NPM_SCRIPT = 'verify:linux-release'
export const VERIFY_MAC_UNPACKED_NPM_SCRIPT = 'verify:mac-unpacked'

/** Реестр npm-скриптов §19 для `check:platform-packaging-scripts` и Vitest. */
export const PLATFORM_PACKAGING_NPM_SCRIPTS = [
  BUILD_WIN_NPM_SCRIPT,
  BUILD_MAC_NPM_SCRIPT,
  BUILD_LINUX_NPM_SCRIPT,
  ENGINES_PREPARE_WIN_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  PACK_LINUX_DIR_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT
] as const

/** Подсказки без запуска electron-builder. */
export function formatPlatformPackagingDiagnosticLines(): string[] {
  return [
    `windows: npm run check:release | check:release:local | release:win* (${ENGINES_PREPARE_WIN_NPM_SCRIPT} + doctor)`,
    `mac: npm run ${BUILD_MAC_NPM_SCRIPT} (dmg) или ${PACK_MAC_DIR_NPM_SCRIPT} + ${VERIFY_MAC_UNPACKED_NPM_SCRIPT}; engines/bin вручную`,
    `linux: npm run ${BUILD_LINUX_NPM_SCRIPT} + ${VERIFY_LINUX_RELEASE_NPM_SCRIPT} или ${PACK_LINUX_DIR_NPM_SCRIPT} + ${VERIFY_LINUX_UNPACKED_NPM_SCRIPT}; engines/bin вручную`,
    `engines prepare: npm run ${ENGINES_PREPARE_WIN_NPM_SCRIPT} (Windows x64 only; predev/prebuild:win)`,
    'engines mac/linux: нет engines:prepare:mac|linux — положить бинарники в bin/ вручную, затем engines:doctor',
    `ci: windows-latest (${ENGINES_PREPARE_WIN_NPM_SCRIPT} + packaged smokes); ${ENGINES_CI_LINUX_RUNNER} (${PACK_LINUX_DIR_NPM_SCRIPT} + ${VERIFY_LINUX_UNPACKED_NPM_SCRIPT}, без engines prepare); mac — job нет`,
    'smoke skips: FLUXALLOY_SKIP_PACK_VERIFY, FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_SKIP_FFMPEG_SMOKE, FLUXALLOY_SKIP_YTDLP_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)',
    'config: electron-builder.yml targets win (nsis/portable/zip), mac (dmg), linux (AppImage, deb)',
    'packaged owner-smoke: npm run check:packaged-manual-smoke-parity (win/linux/macos Step_* + meta)',
    'owner visual smoke: npm run check:owner-visual-smoke-locale (theme/HiDPI settings.json ru/en)',
    'packaging scripts: npm run check:platform-packaging-scripts (PLATFORM_PACKAGING_NPM_SCRIPTS)',
    '§21 e2e registry: npm run check:packaged-e2e-scenarios-registry (ciSmokeScript ↔ package.json; per-step e2e <id>:)',
    'CI packaged: npm run smoke:packaged-release (verify:win-unpacked + app + engines leaf smokes)',
    'Support ZIP releaseSmoke: win/linux/macos layout (present/missing) + §21 e2e per-step lines'
  ]
}
