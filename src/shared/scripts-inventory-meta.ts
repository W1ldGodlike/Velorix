/**
 * scripts/ — корзины, ручные maint/audit без npm, схема tests/ (guards + Vitest).
 */

export const SCRIPTS_ROOT_CONFIG_FILE = 'scripts/audit-scope.config.mjs' as const

export const SCRIPTS_INVENTORY_BUCKETS = [
  'gate',
  'audit',
  'release',
  'maint',
  'e2e',
  'lib',
  'data',
  'cursor-automation'
] as const

/**
 * scripts/*.mjs без собственного npm script — импорт из других scripts или редкий maint.
 * (gate/audit/release/e2e иначе обязаны быть в package.json.)
 */
export const SCRIPTS_WIRING_EXEMPT_REL_PATHS = [
  'scripts/e2e/run-planned-gui-e2e-gui.mjs',
  'scripts/maint/journal-lib.mjs',
  'scripts/maint/terminal-contract-hint-paths.mjs',
  'scripts/maint/apply-theme-font-size-rem-tokenize.mjs',
  'scripts/maint/apply-theme-line-height-tokenize.mjs',
  'scripts/maint/apply-theme-spacing-rem-tokenize.mjs',
  'scripts/maint/sync-help-workflow-user-footers.mjs',
  'scripts/maint/restructure-main-services.mjs',
  'scripts/release/engines-bundled-sha256.mjs',
  'scripts/release/engines-exe-version-line.mjs'
] as const

/** Vitest: только tests `*.test.ts`; Playwright — tests/e2e/gui `*.spec.ts` через test:e2e:gui. */
export const TESTS_VITEST_INCLUDE_GLOB = `tests/${'**'}/*.test.ts` as const

export const TESTS_E2E_PLAYWRIGHT_DIR = 'tests/e2e/gui' as const

export const TESTS_LAYOUT_BUCKETS = [
  { dir: 'tests/shared', role: 'contracts, parsers, argv tables (no Electron)' },
  { dir: 'tests/main', role: 'main process, IPC, services (mocks/integration)' },
  { dir: 'tests/renderer', role: 'renderer helpers, ui-text, stores' },
  { dir: 'tests/scripts', role: 'npm scripts, Help/smoke wiring guards' },
  { dir: 'tests/fixtures', role: 'shared terminal/ffmpeg/ytdlp fixture data' },
  { dir: TESTS_E2E_PLAYWRIGHT_DIR, role: 'Playwright GUI (not in Vitest)' }
] as const

/** Извлекает `scripts/.../*.mjs` из значений package.json scripts. */
export function listScriptPathsFromPackageScripts(scripts: Record<string, string>): string[] {
  const found = new Set<string>()
  const re = /scripts\/[a-z0-9][a-z0-9./_-]*\.mjs/gi
  for (const cmd of Object.values(scripts)) {
    for (const m of String(cmd).matchAll(re)) {
      found.add(m[0].replace(/\\/g, '/'))
    }
  }
  return [...found].sort()
}
