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

/** `locales/{ru,en}/settings.json` keys — Playwright suffix (`check:owner-visual-smoke-locale`). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS = [
  'appSettingsPackagedE2eRegistryGuardHint',
  'appSettingsPackagedSmokeCopyAppendixHint',
  'appSettingsOwnerSmokeIntro',
  'appSettingsOwnerSmokePackagedE2eHint'
] as const

export type PackagedGuiE2ePlaywrightSettingsUiHintKey =
  (typeof PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS)[number]

/** `locales/{ru,en}/about.json` — Playwright suffix (`check:support-bundle-terminal-hints`). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY =
  'aboutSupportZipDiagnosticsSectionsHint' as const

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

/** About / Settings Dependencies — tail for `aboutSupportZipDiagnosticsSectionsHint` (§18/§21). */
export function formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ` releaseSmoke — §21 Playwright (\`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\`).`
    : ` releaseSmoke includes §21 Playwright (\`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\`).`
}

/** Settings UI — tail for `appSettingsOwnerSmokeIntro` (§3 owner bundle intro). */
export function formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? ` Playwright GUI: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
    : ` Playwright GUI: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
}

/** Settings UI — tail for `appSettingsOwnerSmokePackagedE2eHint` (§3 owner hub → packaged). */
export function formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? ` Playwright: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}; ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e).`
    : ` Playwright: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}; ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e).`
}

/** Settings UI — tail for `appSettingsPackagedSmokeCopyAppendixHint` (§2.2/§21 Copy appendix). */
export function formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? ` Playwright: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
    : ` Playwright: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
}

/** Settings UI — clause for `appSettingsPackagedE2eRegistryGuardHint` (§2.2/§21). */
export function formatPackagedGuiE2ePlaywrightSettingsHintSuffix(locale: 'en' | 'ru'): string {
  const body =
    locale === 'ru'
      ? `Playwright: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}; не в package.json)`
      : `Playwright: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}; not in package.json yet)`
  return `; ${body}`
}

/** Root README — §21 Playwright deferred guard (paired with Help crosslinks line). */
export function formatPackagedGuiE2ePlaywrightRootReadmeLine(): string {
  return `- §21 Playwright GUI e2e (deferred): \`npm run ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\` — reserved \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e; not in package.json until wired).`
}

/** `docs/ARCHITECTURE.md` — Playwright deferred UI hints (settings + about). */
export function formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause(): string {
  return `Playwright UI hints: ${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.join(', ')} + ${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY} via formatPackagedGuiE2ePlaywrightUiHintSuffix (check:owner-visual-smoke-locale, check:support-bundle-terminal-hints)`
}

/** `docs/RELEASE.md` — owner-visual-smoke locale guard bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine(): string {
  return `- \`npm run check:owner-visual-smoke-locale\` — theme/HiDPI + §21 Playwright UI hints (${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} settings keys, \`formatPackagedGuiE2ePlaywrightUiHintSuffix\`) в \`locales/{ru,en}/settings.json\`;`
}

/** `docs/RELEASE.md` — deferred Playwright guard bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseDeferredBullet(): string {
  return `- \`npm run ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\` — §21 Playwright GUI e2e отложен: ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} \`planned-gui-e2e\`, зарезервирован \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (пока **нет** в \`package.json\`); канон — \`packaged-gui-e2e-playwright-meta.ts\`; UI — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`).`
}

/** `bin/README.md` — Playwright UI hints (locales settings + about). */
export function formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine(): string {
  return `- §21 Playwright UI hints (locales): \`check:owner-visual-smoke-locale\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} settings keys, \`formatPackagedGuiE2ePlaywrightUiHintSuffix\`); about — \`check:support-bundle-terminal-hints\`.`
}

/** Tail for `docs/RELEASE.md` copy-appendix paragraph (§21 UI). */
export function formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail(): string {
  return ` Playwright UI — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`).`
}

/** Dispatch Playwright UI hint suffix by locale key (settings + about). */
export function formatPackagedGuiE2ePlaywrightUiHintSuffix(
  key:
    | PackagedGuiE2ePlaywrightSettingsUiHintKey
    | typeof PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
  locale: 'en' | 'ru'
): string {
  switch (key) {
    case 'appSettingsPackagedE2eRegistryGuardHint':
      return formatPackagedGuiE2ePlaywrightSettingsHintSuffix(locale)
    case 'appSettingsPackagedSmokeCopyAppendixHint':
      return formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix(locale)
    case 'appSettingsOwnerSmokeIntro':
      return formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix(locale)
    case 'appSettingsOwnerSmokePackagedE2eHint':
      return formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix(locale)
    case PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY:
      return formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(locale)
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}
