/**
 * §19 — имена npm-скриптов упаковки (leaf: Node ESM из `check:platform-packaging-scripts.mjs`).
 */

export const BUILD_MAC_NPM_SCRIPT = 'build:mac'
export const BUILD_LINUX_NPM_SCRIPT = 'build:linux'
export const BUILD_WIN_NPM_SCRIPT = 'build:win'
export const ENGINES_PREPARE_WIN_NPM_SCRIPT = 'engines:prepare:win'
export const ENGINES_PREPARE_MAC_NPM_SCRIPT = 'engines:prepare:mac'
export const ENGINES_PREPARE_LINUX_NPM_SCRIPT = 'engines:prepare:linux'

/** CI: Windows runner + prepare win (см. `.github/workflows/ci.yml` job `check`). */
export const ENGINES_CI_PREPARE_PLATFORM = 'win32' as const

/** CI: Linux packaging smoke без macOS runner (job `linux-packaging`). */
export const ENGINES_CI_LINUX_RUNNER = 'ubuntu-latest' as const

/** §2.1 — `pack:mac:dir` + `verify:mac-unpacked` только на macOS-хосте (CI job нет). */
export const MAC_PACK_LOCAL_ONLY_POLICY = 'local-macos-only' as const

/** §2.1 — `build:linux` + `verify:linux-release` только на Linux-хосте (CI — `pack:linux:dir` only). */
export const LINUX_RELEASE_LOCAL_ONLY_POLICY = 'local-linux-release-only' as const
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
  ENGINES_PREPARE_MAC_NPM_SCRIPT,
  ENGINES_PREPARE_LINUX_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  PACK_LINUX_DIR_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT
] as const
