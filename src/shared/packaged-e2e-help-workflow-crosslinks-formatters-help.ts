/**
 * §21 — Help article dev-line formatters (owner/packaged/logging).
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH
} from './packaged-e2e-help-workflow-crosslinks-registry.ts'
import type { PackagedE2eHelpWorkflowCrosslinksLocale } from './packaged-e2e-help-workflow-crosslinks-registry.ts'
import { formatTerminalContractHintsLoggingHelpDevGuardsLine } from './terminal-contract-hints-meta.ts'

import {
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote,
  formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiScaffoldExportsInline,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale
} from './packaged-e2e-help-workflow-crosslinks-formatters-readme.ts'
import {
  PACKAGED_GUI_E2E_APP_ENV_VAR,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE
} from './packaged-gui-e2e-playwright-meta.ts'

function formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiNpmRunClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const guard = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD
  const script = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT
  return locale === 'ru'
    ? `\`npm run ${script}\` → \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE}\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE}\` (skip без \`${PACKAGED_GUI_E2E_APP_ENV_VAR}\`; \`${guard}\`).`
    : `\`npm run ${script}\` → \`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE}\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE}\` (skipped without \`${PACKAGED_GUI_E2E_APP_ENV_VAR}\`; \`${guard}\`).`
}

export function formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return locale === 'ru'
    ? `; Help: \`check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}).`
    : `; Help: \`check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}).`
}

export const formatPackagedE2eHelpWorkflowCrosslinksFaqSupportZipTail =
  formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail

/** Owner manual smoke — workflow articles crosslinks clause (§16/§21). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return locale === 'ru'
    ? `workflow-статьи (\`check:help-workflow-smoke-crosslinks\`, ${countSnippet}; ${partition}).`
    : `workflow articles (\`check:help-workflow-smoke-crosslinks\`, ${countSnippet}; ${partition}).`
}

/** Owner manual smoke Help — manual-owner steps without GUI automation (§7.5). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeManualOwnerClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' **manual-owner** без GUI-автоматизации: `video-sprite` (§7.5) — при Support ZIP смотрите `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 статьи).'
    : ' **manual-owner** without GUI automation: `video-sprite` (§7.5) — attach Support ZIP `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 articles).'
}

/** Owner manual smoke Help — packaged-windows + workflow articles step Help tail. */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepHelpClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const workflow =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause(locale)
  return locale === 'ru'
    ? ` Help по шагам — [packaged-windows-smoke.md](packaged-windows-smoke.md) и ${workflow}`
    : ` Step Help — [packaged-windows-smoke.md](packaged-windows-smoke.md) and ${workflow}`
}

/** Owner manual smoke Help — full planned GUI e2e paragraph (inject Playwright UI hints from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  void locale
  return ` Playwright: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE}\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE}\` (${formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiScaffoldExportsInline()}).`
}

/** Owner manual smoke Help — planned step notes map (Copy/releaseSmoke diagnostic). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ` Copy/releaseSmoke: \`PLANNED_GUI_E2E_STEP_BY_ID\` (registry \`note\` на шаг; \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`).`
    : ` Copy/releaseSmoke includes \`PLANNED_GUI_E2E_STEP_BY_ID\` (registry \`note\` per step; \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`).`
}

/** Owner/about/logging hub Help — Playwright specs handoff (§21). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ` Specs: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\``
    : ` Specs: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\``
}

export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  ownerPlaywrightUiHintsClause: string
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    '.' +
    ownerPlaywrightUiHintsClause +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeManualOwnerClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepHelpClause(locale)
  )
}

/** §21 Playwright GUI e2e suffix (about/logging/packaged Help dev lines). */
export function formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ` §21 Playwright: ${formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiNpmRunClause('ru')}`
    : ` §21 Playwright: ${formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiNpmRunClause('en')}`
}

/** Packaged windows Help — §21 automation groups in Copy paragraph (`2/8/1`). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyAutomationGroupsParenthetical(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const groups = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT}/${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT}/${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT}`
  return locale === 'ru'
    ? `(группы ${groups} и per-step \`e2e <id>:\`)`
    : `(${groups} groups and per-step \`e2e <id>:\`)`
}

/** Packaged linux/macos Help — planned GUI e2e footer (see also …). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxPlannedGuiFooter(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const count = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT
  const module = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE
  const exportsInline = formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiScaffoldExportsInline()
  const stepById = formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  const wiring = formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale)
  return locale === 'ru'
    ? `§21 planned GUI e2e (${count} шагов) — [owner-manual-smoke.md](owner-manual-smoke.md); канон stepId: \`PACKAGED_E2E_PLANNED_GUI_STEP_IDS\`; \`${module}\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE}\` (${exportsInline}).${stepById}${wiring}.`
    : `§21 planned GUI e2e (${count} steps) — [owner-manual-smoke.md](owner-manual-smoke.md); canonical ids: \`PACKAGED_E2E_PLANNED_GUI_STEP_IDS\`; \`${module}\` + \`${PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE}\` (${exportsInline}).${stepById}${wiring}.`
}

const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE =
  '`open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`' as const

export function formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiReservedClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiNpmRunClause(locale)
}

/** Packaged smoke Help — planned GUI e2e clause (Playwright deferred). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const count = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT
  const reserved = formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiReservedClause(locale)
  const scaffold = formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale)
  const stepById = formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  const wiring = formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale)
  return locale === 'ru'
    ? `**Planned GUI e2e** (${count} шагов, Playwright wired) — ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}${scaffold}${stepById}${wiring}.`
    : `**Planned GUI e2e** (${count} steps, Playwright wired): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}${scaffold}${stepById}${wiring}.`
}

/** Packaged windows Help — Dev guards on Copy line (`npm run` prefix). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const quiet = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix(locale)
  return locale === 'ru'
    ? ` Dev: \`npm run check:packaged-manual-smoke-parity\`, \`npm run check:packaged-e2e-scenarios-registry\` (per-step \`e2e launch:\` в \`releaseSmoke:\`), ${quiet}.`
    : ` Dev: \`npm run check:packaged-manual-smoke-parity\`, \`npm run check:packaged-e2e-scenarios-registry\` (per-step \`e2e launch:\` in \`releaseSmoke:\`), ${quiet}.`
}

/** Packaged linux/macos Help — Dev guards on Copy line (no `npm run` prefix). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const quiet = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix(locale)
  return locale === 'ru'
    ? ` Dev: \`check:packaged-manual-smoke-parity\`, \`check:packaged-e2e-scenarios-registry\` (§21; per-step \`e2e <id>:\` в \`releaseSmoke:\`, напр. \`e2e launch:\`), ${quiet}.`
    : ` Dev: \`check:packaged-manual-smoke-parity\`, \`check:packaged-e2e-scenarios-registry\` (§21; per-step \`e2e <id>:\` in \`releaseSmoke:\`, e.g. \`e2e launch:\`), ${quiet}.`
}

/** Packaged smoke Help — planned GUI + Dev + Playwright tail (inject UI hints from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  copyDevClause: string,
  packagedPlaywrightUiHintSuffix: string
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause(locale) +
    copyDevClause +
    formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(locale) +
    packagedPlaywrightUiHintSuffix
  )
}

/** Owner manual smoke Help — planned GUI e2e clause (Playwright deferred). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const count = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT
  const reserved = formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiReservedClause(locale)
  return locale === 'ru'
    ? `**Planned GUI e2e** (${count} шагов; код — Playwright, приёмка — ручная): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}`
    : `**Planned GUI e2e** (${count} steps; code — Playwright, acceptance — manual): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}`
}

/** `docs/RELEASE.md` — `check:help-workflow-smoke-crosslinks` guard bullet. */
export function formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine(): string {
  const anchorCount = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length
  const packagedCount = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS.length
  return `- \`npm run check:help-workflow-smoke-crosslinks\` — \`packaged-e2e-help-workflow-crosslinks-meta\` (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow user footers + ${packagedCount} packaged + ${anchorCount} owner/about/logging/planner anchors); dev §21 — owner/about/logging/packaged Help; \`bin/README.md\` — \`BinReadmeWorkflowCrosslinksLine\`; \`README.md\`/\`AGENTS.md\` — \`RootReadmePartitionLine\` / \`AgentsMdHelpLine\`.`
}

/** About support — `releaseSmoke:` dev guards line (§18/§21 anchor). */
export function formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  const buildEsm =
    locale === 'ru'
      ? ` §19 build: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET}\` / \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH}\` (Linux/CI \`npm run build\`).`
      : ` §19 build: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET}\` / \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH}\` (Linux/CI \`npm run build\`).`
  return `dev: \`check:packaged-e2e-scenarios-registry\`, \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (${countSnippet}; ${partition}).${formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale)}${buildEsm}${formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(locale)}`
}

/** Owner manual smoke — Support ZIP archive bullet (§15 hub). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeArchiveSupportClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const signing = formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale)
  return locale === 'ru'
    ? `3. **Архив поддержки** — \`ownerManualSmoke:\` в \`diagnostics.txt\` (дублирует те же шаги); \`releaseSmoke:\` — CI packaged pipeline, \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET}\` (\`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH}\`) для \`electron-vite build\` на Linux/CI, и план §21 e2e;${signing} dev-блок \`terminalHints:\` (§8 guards) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md).`
    : `3. **Support ZIP** — \`ownerManualSmoke:\` in \`diagnostics.txt\`; \`releaseSmoke:\` — CI packaged pipeline, \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET}\` (\`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH}\`) for Linux/CI \`electron-vite build\`, and §21 e2e plan;${signing} dev block \`terminalHints:\` (§8 guards) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md).`
}

/** About support Help — `releaseSmoke:` dev tail + Playwright UI hint (inject from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  aboutPlaywrightUiHintSuffix: string
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    '.' +
    aboutPlaywrightUiHintSuffix
  )
}

/** Logging Help — §8 terminal guards on Dev line. */
export function formatPackagedE2eHelpWorkflowCrosslinksLoggingTerminalShardClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const line = formatTerminalContractHintsLoggingHelpDevGuardsLine(locale === 'ru' ? 'ru' : 'en')
  return ` ${line}`
}

/** Logging Help — UI Copy §21 appendix before planned GUI scope clause. */
export function formatPackagedE2eHelpWorkflowCrosslinksLoggingCopyE2eClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' Support ZIP `ownerManualSmoke:` / `releaseSmoke:` дописывает **§21 packaged e2e (CI vs owner)**; '
    : ' Support ZIP `ownerManualSmoke:` / `releaseSmoke:` appends **§21 packaged e2e (CI vs owner)**; '
}

/** Logging Help — full Dev line (inject planned GUI scope + UI hints from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  plannedGuiScopeClause: string,
  loggingDiagnosticsUiHintSuffix: string
): string {
  return (
    `Dev: ${formatPackagedE2eHelpWorkflowCrosslinksLoggingClause(locale)}` +
    formatPackagedE2eHelpWorkflowCrosslinksLoggingTerminalShardClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksLoggingCopyE2eClause(locale) +
    plannedGuiScopeClause +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    '.' +
    loggingDiagnosticsUiHintSuffix
  )
}

/** §19 signing roadmaps — reused by about/logging dev lines. */
export function formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const moduleRef =
    locale === 'en'
      ? '[`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts)'
      : '[`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts)'
  const releaseRef =
    locale === 'en'
      ? '[`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2'
      : '[`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2'
  return locale === 'en'
    ? ` §19 publish signing (win/linux/mac): ${moduleRef} + ${releaseRef} — \`check:help-packaged-smoke-docs\`;`
    : ` §19 publish signing (win/linux/mac): ${moduleRef} + ${releaseRef} — \`check:help-packaged-smoke-docs\`;`
}

/** Knowledge hub — dev guards (§13; article body uses user footer). */
export function formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubDevClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return `Dev: \`npm run check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}), \`npm run check:help-terminal-hints-docs\`.${formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale)}`
}

/** ffmpeg-terminal-hints — §21 workflow count (§8; user footer in Help). */
export function formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalWorkflowClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return locale === 'ru'
    ? `; §21 workflow: \`npm run check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}; §8 — \`npm run check:help-terminal-hints-docs\`).`
    : `; §21 workflow: \`npm run check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}; §8 — \`npm run check:help-terminal-hints-docs\`).`
}

/** Platform-packaging diagnostics — packaged Help crosslinks guard. */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine(): string {
  return `packaged Help docs: npm run check:help-packaged-smoke-docs (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow crosslinks, ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS.length} articles)`
}

/** Packaged smoke Help (win/linux/macos) — workflow crosslinks guard tail in `check:quiet`. */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return locale === 'ru'
    ? `\`check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}) — в \`check:quiet\``
    : `\`check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}) — in \`check:quiet\``
}

/** §18 logging-and-diagnostics Help — §21 packaged e2e + workflow crosslinks (synced count). */
export function formatPackagedE2eHelpWorkflowCrosslinksLoggingClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  const quietTail = locale === 'ru' ? 'в `check:quiet`' : 'in `check:quiet`'
  const buildEsm =
    locale === 'ru'
      ? ` §19 build: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET}\` / \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH}\` (Linux/CI \`npm run build\`);`
      : ` §19 build: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET}\` / \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH}\` (Linux/CI \`npm run build\`);`
  return `\`npm run check:packaged-e2e-scenarios-registry\`, \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (${countSnippet}; ${partition}, ${quietTail});${formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale)}${buildEsm}${formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(locale)}`
}
