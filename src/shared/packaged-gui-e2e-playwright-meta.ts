/**
 * §21 — отложенный Playwright GUI e2e (8 planned-gui-e2e; не в CI / package.json пока).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs).
 */

/** Зарезервированное имя npm-скрипта для будущего Playwright suite. */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT = 'test:e2e:gui' as const

/** Число planned-gui-e2e шагов (= длина `PACKAGED_E2E_PLANNED_GUI_STEP_IDS` в registry). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT = 8 as const

/** npm guard в `check:quiet` (deferred Playwright; `check:help-smoke-guards-package-json` registry). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT =
  'check:packaged-gui-e2e-playwright-deferred' as const

/** `run-quiet-check.mjs` step label (without `check:` prefix). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_STEP_LABEL =
  'packaged-gui-e2e-playwright-deferred' as const

/** §21 quiet order: Help packaged → e2e registry → Playwright deferred → terminal guards. */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS = [
  'help-packaged-smoke-docs',
  'packaged-e2e-scenarios-registry',
  PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_STEP_LABEL,
  'terminal-hints-guards-package-json'
] as const

/** Platform-packaging / §21 diagnostics line. */
export function formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine(): string {
  return `§21 planned GUI e2e: Playwright ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; registry planned-gui-e2e; not in check:quiet CI yet)`
}

/** Root README — §21 Playwright deferred guard (paired with Help crosslinks line). */
export function formatPackagedGuiE2ePlaywrightRootReadmeLine(): string {
  return `- §21 Playwright GUI e2e (deferred): \`npm run ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\` — reserved \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e; not in package.json until wired).`
}
