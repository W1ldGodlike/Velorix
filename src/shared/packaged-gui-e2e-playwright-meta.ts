/**
 * §21 — Playwright GUI e2e meta (UI ZERO: `PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT` = 0; restore with renderer refs).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs).
 */

/** Historical npm script name (removed from package.json during UI ZERO). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT = 'test:e2e:gui' as const

/** Число planned-gui-e2e шагов (= длина `PACKAGED_E2E_PLANNED_GUI_STEP_IDS` в registry). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT = 0 as const

/** UI ZERO canon (restore Playwright paths when GUI returns). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE =
  'docs/VELORIX_NEON_THEME.md' as const

export const PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE = 'docs/VELORIX_NEON_THEME.md' as const

export const PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE = 'docs/VELORIX_NEON_THEME.md' as const

export const PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE = 'docs/VELORIX_NEON_THEME.md' as const

export const PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE = 'docs/VELORIX_NEON_THEME.md' as const

export const PACKAGED_GUI_E2E_PLAYWRIGHT_CONFIG_MODULE = 'docs/VELORIX_NEON_THEME.md' as const

/** Env var for packaged app path (`packaged-gui-e2e-playwright-app-path.ts`). */
export const PACKAGED_GUI_E2E_APP_ENV_VAR = 'VELORIX_E2E_APP' as const

export const PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_TEST_MODULE =
  'docs/VELORIX_NEON_THEME.md' as const

/** Scaffold module exports (Vitest + deferred guard lock). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS =
  'PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID' as const

/** Removed during UI ZERO (historical guard name for locale strings). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT =
  'docs/VELORIX_NEON_THEME.md' as const

/** Settings/registry UI — wired `test:e2e:gui` phrase (ru/en). */
export function formatPackagedGuiE2ePlaywrightNpmScriptWiredPhrase(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? 'Playwright GUI e2e: приостановлен (UI ZERO rebuild).'
    : 'Playwright GUI e2e: suspended (UI ZERO rebuild).'
}

/** Раньше — подсказки в Настройках; чеклисты железа — Support ZIP ownerHardwareChecklist: (+ about-support-logs Help). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS = [] as const

export type PackagedGuiE2ePlaywrightSettingsUiHintKey =
  (typeof PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS)[number]

/** `locales/{ru,en}/about.json` — Playwright suffix (`check:support-bundle-terminal-hints`). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY =
  'aboutSupportZipDiagnosticsSectionsHint' as const

/** `check:quiet` order anchor: Help packaged → e2e registry → terminal guards. */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS = [
  'help-packaged-smoke-docs',
  'packaged-e2e-scenarios-registry',
  'terminal-hints-guards-package-json'
] as const

/** Historical sprint §21 Playwright bullet. */
export function formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line(): string {
  return `- [ ] §21: GUI Playwright — suspended (UI ZERO; restore with \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`).`
}

/** `docs/SOURCES_OF_TRUTH.md` — sprint §21 Playwright checklist index. */
export function formatPackagedGuiE2ePlaywrightSourcesSprintChecklistFragment(): string {
  return `sprint §21 Playwright bullet — formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line; archive checklist`
}

/** continue.txt / initial.txt — sprint §21 Playwright checklist fragment. */
export function formatPackagedGuiE2ePlaywrightSdkContinuePromptSprintChecklistFragment(): string {
  return `Sprint §21 Playwright checklist: formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps; ${PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE}).`
}

/** `scripts/cursor-automation/README.md` — sprint §21 Playwright checklist bullet. */
export function formatPackagedGuiE2ePlaywrightSdkAutomationReadmeChecklistSprintLine(): string {
  return `- Sprint §21 Playwright (archive): \`formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} steps).`
}

/** Platform-packaging / §21 diagnostics line. */
export function formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine(): string {
  return '§21 planned GUI e2e: suspended (UI ZERO rebuild — Playwright returns with renderer refs)'
}

/** Platform-packaging — Playwright scaffold + runner. */
export function formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine(): string {
  return '§21 playwright scaffold: removed (UI ZERO)'
}

/** Copy/releaseSmoke appendix — planned step registry notes export. */
export function formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine(): string {
  return '§21 playwright planned notes: none (UI ZERO)'
}

/** `docs/RELEASE.md` — Playwright scaffold bullet (paired with deferred guard). */
export function formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet(): string {
  return `- §21 Playwright GUI e2e: suspended (UI ZERO — \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`).`
}

export function formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet(): string {
  return `- §21 Playwright planned notes: none (UI ZERO).`
}

export function formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet(): string {
  return `- §21 Playwright: restore after renderer refs (\`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`; owner manual — Support ZIP \`ownerHardwareChecklist:\`).`
}

/** About / Settings Dependencies — tail for `aboutSupportZipDiagnosticsSectionsHint` (§18/§21). */
export function formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ' releaseSmoke — §21 Playwright: приостановлен (UI ZERO rebuild).'
    : ' releaseSmoke — §21 Playwright suspended (UI ZERO rebuild).'
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
  return ` ${formatPackagedGuiE2ePlaywrightNpmScriptWiredPhrase(locale)}`
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
  return ` ${formatPackagedGuiE2ePlaywrightNpmScriptWiredPhrase(locale)}`
}

/** Settings UI — tail for `appSettingsPackagedSmokeCopyAppendixHint` (§2.2/§21 Copy appendix). */
export function formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix(locale: 'en' | 'ru'): string {
  return ` ${formatPackagedGuiE2ePlaywrightNpmScriptWiredPhrase(locale)}`
}

/** Settings UI — clause for `appSettingsPackagedE2eRegistryGuardHint` (§2.2/§21). */
export function formatPackagedGuiE2ePlaywrightSettingsHintSuffix(locale: 'en' | 'ru'): string {
  return `; ${formatPackagedGuiE2ePlaywrightNpmScriptWiredPhrase(locale)}`
}

/** Root README — §21 Playwright deferred guard (paired with Help crosslinks line). */
export function formatPackagedGuiE2ePlaywrightRootReadmeLine(): string {
  return '- §21 Playwright GUI e2e: suspended (UI ZERO rebuild — restore with renderer refs).'
}

/** Root README — Help UiHintSuffix coverage tail (§15/§19). */
export function formatPackagedGuiE2ePlaywrightRootReadmeHelpUiHintsTail(): string {
  return ` Help UiHintSuffix: AGENTS + 4 §15 anchors + 6 packaged (\`formatPackagedGuiE2ePlaywright*HelpUiHintSuffix\`; \`check:help-owner-hardware-checklist-docs\`, \`check:help-packaged-smoke-docs\`).`
}

/** Root README — Playwright wiring handoff pointer (§21; full steps in RELEASE). */
export function formatPackagedGuiE2ePlaywrightRootReadmeWiringHandoffLine(): string {
  return `- §21 Playwright run: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\`.`
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
  return `Help UiHintSuffix (4 §15 anchors, 6 packaged) — \`formatPackagedGuiE2ePlaywright*HelpUiHintSuffix\`; AGENTS — slim domains pointer only`
}

/** `docs/SOURCES_OF_TRUTH.md` — deferred Playwright scaffold module. */
export function formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote(): string {
  return `Playwright GUI e2e suspended (UI ZERO) — \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\``
}

export function formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote(): string {
  return `Playwright planned notes: none (UI ZERO)`
}

export function formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote(): string {
  return `Playwright restore: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\``
}

/** `docs/ARCHITECTURE.md` — Playwright deferred UI hints (settings + about). */
export function formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause(): string {
  return `Playwright UI hints: ${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.join(', ')} + ${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY} via formatPackagedGuiE2ePlaywrightUiHintSuffix (check:owner-hardware-checklist-locale, check:support-bundle-terminal-hints)`
}

/** `docs/ARCHITECTURE.md` — deferred Playwright scaffold module (§21). */
export function formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause(): string {
  return `Playwright GUI e2e: suspended (UI ZERO; ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned steps).`
}

export function formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause(): string {
  return `Playwright planned notes: none (UI ZERO).`
}

export function formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause(): string {
  return `Playwright restore: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\`.`
}

/** `docs/RELEASE.md` — automation groups in `check:packaged-e2e-scenarios-registry` bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryAutomationSummary(): string {
  return `(2 ci-headless, ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e, 9 manual-owner)`
}

/** `docs/RELEASE.md` — `check:packaged-e2e-scenarios-registry` guard bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine(): string {
  return `- \`npm run check:packaged-e2e-scenarios-registry\` — §21 реестр: 11 шагов ↔ manual smoke ${formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryAutomationSummary()}; канон stepId — \`PACKAGED_E2E_*_STEP_IDS\` в \`packaged-e2e-smoke-scenarios.ts\`; \`ci-headless\` обязан иметь npm \`ciSmokeScript\`; \`manual-owner\` — без скрипта; несуществующие скрипты — fail; \`PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS\` (parent→leaf) сверяется с \`package.json\`. Уникальные leaf-скрипты — в \`.github/workflows/ci.yml\` (Vitest \`ci-packaged-smoke-steps\`). Support ZIP / owner bundle: per-step \`e2e <id>: <automation> script=…\`.`
}

/** `docs/RELEASE.md` — owner-hardware-checklist locale guard bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine(): string {
  return `- \`npm run check:owner-hardware-checklist-locale\` — theme/HiDPI + §21 Playwright UI hints (${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} settings keys, \`formatPackagedGuiE2ePlaywrightUiHintSuffix\`) в \`locales/{ru,en}/settings.json\`;`
}

/** `docs/RELEASE.md` — deferred Playwright guard bullet. */
export function formatPackagedGuiE2ePlaywrightReleaseDeferredBullet(): string {
  return `- §21 Playwright GUI e2e: suspended (UI ZERO; ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e); канон — \`packaged-gui-e2e-playwright-meta.ts\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`.`
}

/** `bin/README.md` — Playwright UI hints (locales settings + about). */
export function formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine(): string {
  return `- §21 Playwright UI hints (locales): \`check:owner-hardware-checklist-locale\` (${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} settings keys, \`formatPackagedGuiE2ePlaywrightUiHintSuffix\`); about — \`check:support-bundle-terminal-hints\`.`
}

/** `bin/README.md` — deferred Playwright scaffold module (before `test:e2e:gui` in package.json). */
export function formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine(): string {
  return `- §21 Playwright GUI e2e: suspended (UI ZERO — \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}\`).`
}

export function formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine(): string {
  return `- §21 Playwright planned notes: none (UI ZERO).`
}

export function formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine(): string {
  return `- §21 Playwright restore: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\`.`
}

/** Tail for `docs/RELEASE.md` copy-appendix paragraph (§21 UI). */
export function formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail(): string {
  return ` Playwright UI — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`).`
}

/** `AGENTS.md` — Help §21 Playwright deferred clause (before UiHintsTail). */
export function formatPackagedGuiE2ePlaywrightAgentsMdPlaywrightDeferredClause(): string {
  return `**Playwright GUI e2e:** suspended (UI ZERO; ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned steps).`
}

export function formatPackagedGuiE2ePlaywrightAgentsMdScaffoldClause(): string {
  return ''
}

export function formatPackagedGuiE2ePlaywrightAgentsMdStepByIdClause(): string {
  return ''
}

export function formatPackagedGuiE2ePlaywrightAgentsMdWiringClause(): string {
  return ` **Playwright restore:** \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\`.`
}

/** `AGENTS.md` — Playwright deferred UI hints tail (§21). */
export function formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail(): string {
  return ` UI hints: \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:owner-hardware-checklist-locale\`, \`check:support-bundle-terminal-hints\`).`
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

/** About/logging Help — Settings UI hints clause (RU/EN). */
export function formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause(locale: 'en' | 'ru'): string {
  return locale === 'ru'
    ? ` Ручные чеклисты — Support ZIP \`ownerHardwareChecklist:\` (не в UI); about — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:support-bundle-terminal-hints\`).`
    : ` Manual checklists — Support ZIP \`ownerHardwareChecklist:\` (not in app UI); about — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:support-bundle-terminal-hints\`).`
}

/** `Help/ru/about-support-logs.md` — About UI hint on `releaseSmoke:` dev line (§18/§21). */
export function formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\` — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:support-bundle-terminal-hints\`; settings — \`check:owner-hardware-checklist-locale\`).`
    : ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\` — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (\`check:support-bundle-terminal-hints\`; settings — \`check:owner-hardware-checklist-locale\`).`
}

/** §8 settings key cited from logging Help (leaf — id matches `terminal-contract-hints-meta`). */
export const PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY =
  'appSettingsTerminalHintsGuardHint' as const

/** `Help/ru/logging-and-diagnostics.md` — planned GUI e2e scope in Support ZIP (§21). */
export function formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? `в Support ZIP — **owner manual (9 шагов)** до восстановления GUI (Playwright ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}; UI ZERO).`
    : `Support ZIP includes **owner manual (9 steps)** until GUI restore (Playwright ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}; UI ZERO).`
}

/** `Help/ru/logging-and-diagnostics.md` — §8 + §21 UI hints on Dev line. */
export function formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return locale === 'ru'
    ? ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY}\` (\`check:terminal-hints-locale\`); Playwright — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-hardware-checklist-locale\`, \`check:support-bundle-terminal-hints\`).`
    : ` UiHintSuffix: \`${PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY}\` (\`check:terminal-hints-locale\`); Playwright — \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-hardware-checklist-locale\`, \`check:support-bundle-terminal-hints\`).`
}

/** Help crosslinks — settings + about Playwright UI hints (§21). */
export function formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  const settingsCount = PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length
  return locale === 'ru'
    ? ` UiHintSuffix: \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (${settingsCount} settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-hardware-checklist-locale\`, \`check:support-bundle-terminal-hints\`).`
    : ` UiHintSuffix: \`formatPackagedGuiE2ePlaywrightUiHintSuffix\` (${settingsCount} settings + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY}\`; \`check:owner-hardware-checklist-locale\`, \`check:support-bundle-terminal-hints\`).`
}

/** `Help/ru/workflows-planner-scenarios.md` — §10/§21 UI hints on owner-smoke crosslinks line. */
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

/** `Help/ru/ffmpeg-terminal-hints.md` — §8 + §21 UI hints on workflow crosslinks line. */
export function formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
}

/** `Help/ru/knowledge-base-howto.md` — §13/§21 UI hints on packaged e2e dev line. */
export function formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(
  locale: 'en' | 'ru'
): string {
  return formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale)
}

/** Playwright hint suffix for about Support ZIP (`check:support-bundle-terminal-hints`). */
export function formatPackagedGuiE2ePlaywrightUiHintSuffix(
  key: typeof PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
  locale: 'en' | 'ru'
): string {
  if (key !== PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY) {
    return ''
  }
  return formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(locale)
}
