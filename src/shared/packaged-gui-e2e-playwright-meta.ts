/**
 * §21 — отложенный Playwright GUI e2e (`PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT` planned-gui-e2e; не в CI / package.json пока).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs).
 */

/** Зарезервированное имя npm-скрипта для будущего Playwright suite. */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT = 'test:e2e:gui' as const

/** Число planned-gui-e2e шагов (= длина `PACKAGED_E2E_PLANNED_GUI_STEP_IDS` в registry). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT = 8 as const

/** Deferred Playwright scaffold module path (no runner / npm script yet). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE =
  'tests/e2e/gui/planned-gui-e2e-steps.ts' as const

/** Vitest lock for scaffold exports (§21 deferred). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_TEST_MODULE =
  'tests/e2e/gui/planned-gui-e2e-steps.test.ts' as const

/** Scaffold module exports (Vitest + deferred guard lock). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS =
  'PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID' as const

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

/** `IMPLEMENTATION_CHECKLIST.md` — sprint §21 Playwright deferred bullet. */
export function formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line(): string {
  return `- [~] §21: GUI Playwright e2e (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps) — scaffold/StepById/wiring handoff Help+docs [x]; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` wiring — после owner-smoke.`
}

/** `docs/SOURCES_OF_TRUTH.md` — sprint §21 Playwright checklist index. */
export function formatPackagedGuiE2ePlaywrightSourcesSprintChecklistFragment(): string {
  return `sprint §21 Playwright bullet — formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line; IMPLEMENTATION_CHECKLIST.md`
}

/** continue.txt / initial.txt — sprint §21 Playwright checklist fragment. */
export function formatPackagedGuiE2ePlaywrightSdkContinuePromptSprintChecklistFragment(): string {
  return `Sprint §21 Playwright checklist: formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} deferred).`
}

/** `scripts/cursor-automation/README.md` — sprint §21 Playwright checklist bullet. */
export function formatPackagedGuiE2ePlaywrightSdkAutomationReadmeChecklistSprintLine(): string {
  return `- Sprint §21 Playwright (\`IMPLEMENTATION_CHECKLIST\`): \`formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps).`
}

/** `docs/AGENT_OPERATIONAL_NOTES.md` — deferred Playwright row (operational; not rules). */
export function formatPackagedGuiE2ePlaywrightOperationalNotesRow(): string {
  return `| §21 Playwright GUI e2e (deferred) | Scaffold \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` exports \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps); Copy/releaseSmoke \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`. Reserved \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` — **not** in \`package.json\` until wired. Wiring: [\`docs/RELEASE.md\`](RELEASE.md) — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\`. Guards: \`npm run ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\` (in \`check:quiet\`). |`
}

/** Platform-packaging / §21 diagnostics line. */
export function formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine(): string {
  return `§21 planned GUI e2e: Playwright ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; registry planned-gui-e2e; not in check:quiet CI yet)`
}

/** Platform-packaging — deferred Playwright scaffold module (before npm script). */
export function formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine(): string {
  return `§21 playwright scaffold: ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE} (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e; ${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}; ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} deferred)`
}

/** Copy/releaseSmoke appendix — planned step registry notes export. */
export function formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine(): string {
  return `§21 playwright planned notes: PLANNED_GUI_E2E_STEP_BY_ID (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} keys; ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE})`
}

/** `docs/RELEASE.md` — Playwright scaffold bullet (paired with deferred guard). */
export function formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet(): string {
  return `- Playwright scaffold (deferred): \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` — \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}\`; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` not in \`package.json\` until wired.`
}

/** `docs/RELEASE.md` — planned step notes in Copy/releaseSmoke diagnostics (§21). */
export function formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet(): string {
  return `- Playwright planned notes (deferred): \`PLANNED_GUI_E2E_STEP_BY_ID\` in \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`; Copy/releaseSmoke — \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`.`
}

/** `docs/RELEASE.md` — owner handoff when wiring Playwright (flip deferred guard). */
export function formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet(): string {
  return `- §21 Playwright wiring (when ready): add \`@playwright/test\` + \`playwright.config.ts\`; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` in \`package.json\` from \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` (\`PLANNED_GUI_E2E_SCENARIOS\`); update \`check:packaged-gui-e2e-playwright-deferred.mjs\` (remove absence check for reserved script); optional CI job after owner-smoke on hardware.`
}

/** About / Settings Dependencies — tail for `aboutSupportZipDiagnosticsSectionsHint` (§18/§21). */
export function formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ` releaseSmoke — §21 Playwright (\`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\`).`
    : ` releaseSmoke includes §21 Playwright (\`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\`).`
}

/** Full `aboutSupportZipDiagnosticsSectionsHint` (terminal prefix + Playwright tail; `check:support-bundle-terminal-hints`). */
export function formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintBody(
  locale: 'en' | 'ru',
  terminalSectionsHint: string
): string {
  return (
    terminalSectionsHint + formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(locale)
  )
}

/** Settings UI — tail for `appSettingsOwnerSmokeIntro` (§3 owner bundle intro). */
export function formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? ` Playwright GUI: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
    : ` Playwright GUI: ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT} (reserved ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
}

/** Settings UI — body for `appSettingsOwnerSmokePackagedE2eHint` (§3 owner hub → packaged). */
export function formatPackagedGuiE2ePlaywrightSettingsOwnerHubHintBody(
  locale: 'en' | 'ru'
): string {
  const body =
    locale === 'ru'
      ? `«Скопировать» в packaged-панели дописывает §21 packaged e2e (CI vs owner) — тот же appendix, что в «Скопировать весь пакет» выше и в releaseSmoke:.`
      : `Packaged panel Copy checklist also appends §21 packaged e2e (CI vs owner) — same appendix as Copy full bundle above and releaseSmoke:.`
  return body + formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix(locale)
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

/** Root README — Help UiHintSuffix coverage tail (§15/§19). */
export function formatPackagedGuiE2ePlaywrightRootReadmeHelpUiHintsTail(): string {
  return ` Help UiHintSuffix: AGENTS + 4 §15 anchors + 6 packaged (\`formatPackagedGuiE2ePlaywright*HelpUiHintSuffix\`; \`check:help-owner-smoke-docs\`, \`check:help-packaged-smoke-docs\`).`
}

/** Root README — Playwright wiring handoff pointer (§21; full steps in RELEASE). */
export function formatPackagedGuiE2ePlaywrightRootReadmeWiringHandoffLine(): string {
  return `- §21 Playwright wiring (when ready): see \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (\`@playwright/test\`, \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\`; after owner-smoke on hardware).`
}

/** Root README — full §21 Playwright bullets (deferred + scaffold + Help UiHintSuffix). */
export function formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection(): string {
  return (
    formatPackagedGuiE2ePlaywrightRootReadmeLine() +
    formatPackagedGuiE2ePlaywrightRootReadmeHelpUiHintsTail() +
    `\n${formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine()}` +
    `\n${formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine()}` +
    `\n${formatPackagedGuiE2ePlaywrightRootReadmeWiringHandoffLine()}`
  )
}

/** `docs/SOURCES_OF_TRUTH.md` — Help UiHintSuffix note (§21 playwright-meta row). */
export function formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote(): string {
  return `Help UiHintSuffix (AGENTS, 4 §15 anchors, 6 packaged) — \`formatPackagedGuiE2ePlaywright*HelpUiHintSuffix\``
}

/** `docs/SOURCES_OF_TRUTH.md` — deferred Playwright scaffold module. */
export function formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote(): string {
  return `Playwright scaffold (deferred): \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` — \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}\`; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` not in package.json yet`
}

/** `docs/SOURCES_OF_TRUTH.md` — planned step notes map in Copy/releaseSmoke diagnostics. */
export function formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote(): string {
  return `PLANNED_GUI_E2E_STEP_BY_ID — \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\` in Copy/releaseSmoke (registry \`note\` per planned-gui-e2e step)`
}

/** `docs/SOURCES_OF_TRUTH.md` — Playwright wiring handoff (§21 deferred). */
export function formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote(): string {
  return `Playwright wiring (deferred): \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (\`@playwright/test\`, \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\`; after owner-smoke on hardware)`
}

/** `docs/ARCHITECTURE.md` — Playwright deferred UI hints (settings + about). */
export function formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause(): string {
  return `Playwright UI hints: ${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.join(', ')} + ${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY} via formatPackagedGuiE2ePlaywrightUiHintSuffix (check:owner-visual-smoke-locale, check:support-bundle-terminal-hints)`
}

/** `docs/ARCHITECTURE.md` — deferred Playwright scaffold module (§21). */
export function formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause(): string {
  return `Playwright scaffold (deferred): \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` exports \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` not in package.json yet).`
}

/** `docs/ARCHITECTURE.md` — planned step notes map in Copy/releaseSmoke diagnostics (§21). */
export function formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause(): string {
  return `Planned step notes (deferred Playwright): \`PLANNED_GUI_E2E_STEP_BY_ID\` in \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`; Copy/releaseSmoke — \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`.`
}

/** `docs/ARCHITECTURE.md` — Playwright wiring handoff when flipping deferred guard (§21). */
export function formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause(): string {
  return `Playwright wiring (deferred): \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (\`@playwright/test\`, \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\`; after owner-smoke on hardware).`
}

/** `docs/RELEASE.md` — automation groups in `check:packaged-e2e-scenarios-registry` bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryAutomationSummary(): string {
  return `(2 ci-headless, ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e, 2 manual-owner)`
}

/** `docs/RELEASE.md` — `check:packaged-e2e-scenarios-registry` guard bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine(): string {
  return `- \`npm run check:packaged-e2e-scenarios-registry\` — §21 реестр: 12 шагов ↔ manual smoke ${formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryAutomationSummary()}; канон stepId — \`PACKAGED_E2E_*_STEP_IDS\` в \`packaged-e2e-smoke-scenarios.ts\`; \`ci-headless\` обязан иметь npm \`ciSmokeScript\`; \`manual-owner\` — без скрипта; несуществующие скрипты — fail; \`PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS\` (parent→leaf) сверяется с \`package.json\`. Уникальные leaf-скрипты — в \`.github/workflows/ci.yml\` (Vitest \`ci-packaged-smoke-steps\`). Support ZIP / owner bundle: per-step \`e2e <id>: <automation> script=…\`.`
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

/** `bin/README.md` — deferred Playwright scaffold module (before `test:e2e:gui` in package.json). */
export function formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine(): string {
  return `- §21 Playwright scaffold (deferred): \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` exports \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` not in package.json yet).`
}

/** `bin/README.md` — planned step notes map in Copy/releaseSmoke diagnostics. */
export function formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine(): string {
  return `- §21 Playwright planned notes (deferred): \`PLANNED_GUI_E2E_STEP_BY_ID\` in \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`; Copy/releaseSmoke — \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`.`
}

/** `bin/README.md` — Playwright wiring handoff (§21 deferred). */
export function formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine(): string {
  return `- §21 Playwright wiring (when ready): \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (after owner-smoke on hardware).`
}

/** Tail for `docs/RELEASE.md` copy-appendix paragraph (§21 UI). */
export function formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail(): string {
  return ` Playwright UI — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`).`
}

/** `AGENTS.md` — Help §21 Playwright deferred clause (before UiHintsTail). */
export function formatPackagedGuiE2ePlaywrightAgentsMdPlaywrightDeferredClause(): string {
  return `**Playwright GUI e2e (deferred):** \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}\` — reserved \`${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e; not in package.json yet).`
}

/** `AGENTS.md` — Playwright scaffold clause (§21 deferred). */
export function formatPackagedGuiE2ePlaywrightAgentsMdScaffoldClause(): string {
  return ` **Playwright scaffold:** \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_TEST_MODULE}\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; \`${PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS}\`).`
}

/** `AGENTS.md` — planned step notes in Copy/releaseSmoke diagnostics (§21 deferred). */
export function formatPackagedGuiE2ePlaywrightAgentsMdStepByIdClause(): string {
  return ` **Playwright step notes:** \`PLANNED_GUI_E2E_STEP_BY_ID\` in \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`; Copy/releaseSmoke — \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`.`
}

/** `AGENTS.md` — Playwright wiring handoff (§21 deferred). */
export function formatPackagedGuiE2ePlaywrightAgentsMdWiringClause(): string {
  return ` **Playwright wiring:** \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (after owner-smoke on hardware).`
}

/** `AGENTS.md` — Playwright deferred UI hints tail (§21). */
export function formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail(): string {
  return ` UI hints: \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`).`
}

/** `AGENTS.md` Help §21 — contiguous Playwright deferred + scaffold + UI hints block. */
export function formatPackagedGuiE2ePlaywrightAgentsMdHelpPlaywrightSection(): string {
  return (
    formatPackagedGuiE2ePlaywrightAgentsMdPlaywrightDeferredClause() +
    formatPackagedGuiE2ePlaywrightAgentsMdScaffoldClause() +
    formatPackagedGuiE2ePlaywrightAgentsMdStepByIdClause() +
    formatPackagedGuiE2ePlaywrightAgentsMdWiringClause() +
    formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail()
  )
}

/** `Help/owner-manual-smoke.md` — Settings UI hints clause (RU/EN). */
export function formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? ` UI в Настройках (${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} ключа + about): \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` — \`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`.`
    : ` Settings UI (${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} keys + about): \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` — \`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`.`
}

/** `Help/about-support-logs.md` — About UI hint on `releaseSmoke:` dev line (§18/§21). */
export function formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\` — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:support-bundle-terminal-hints\`; settings — \`check:owner-visual-smoke-locale\`).`
    : ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\` — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:support-bundle-terminal-hints\`; settings — \`check:owner-visual-smoke-locale\`).`
}

/** §8 settings key cited from logging Help (leaf — id matches `terminal-contract-hints-meta`). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY =
  'appSettingsTerminalHintsGuardHint' as const

/** `Help/logging-and-diagnostics.md` — planned GUI e2e scope in Support ZIP (§21). */
export function formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? `в Support ZIP — **planned GUI e2e scope** (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} шагов Playwright позже; 2 manual-owner: sprite, mini-player).`
    : `Support ZIP includes **planned GUI e2e scope** (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps for future Playwright; 2 manual-owner: sprite, mini-player).`
}

/** `Help/logging-and-diagnostics.md` — §8 + §21 UI hints on Dev line. */
export function formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY}\` (\`check:terminal-hints-locale\`); Playwright — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`).`
    : ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY}\` (\`check:terminal-hints-locale\`); Playwright — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`).`
}

/** Help crosslinks — settings + about Playwright UI hints (§21). */
export function formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  const settingsCount = PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length
  return locale === 'ru'
    ? ` UiHintSuffix: \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (${settingsCount} settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`).`
    : ` UiHintSuffix: \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (${settingsCount} settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-visual-smoke-locale\`, \`check:support-bundle-terminal-hints\`).`
}

/** `Help/workflows-planner-scenarios.md` — §10/§21 UI hints on owner-smoke crosslinks line. */
export function formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale)
}

/** Packaged smoke Help (win/linux/macos RU+EN) — §19/§21 UI hints on Copy/Dev line. */
export function formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale)
}

/** `Help/ffmpeg-terminal-hints.md` — §8 + §21 UI hints on workflow crosslinks line. */
export function formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
}

/** `Help/knowledge-base-howto.md` — §13/§21 UI hints on packaged e2e dev line. */
export function formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale)
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
