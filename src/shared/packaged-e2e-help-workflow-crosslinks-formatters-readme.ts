/**
 * §21 — README/AGENTS/bin + locales settings formatters.
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT
} from './packaged-e2e-help-workflow-crosslinks-registry.ts'
import type { PackagedE2eHelpWorkflowCrosslinksLocale } from './packaged-e2e-help-workflow-crosslinks-registry.ts'
import { formatPackagedGuiE2ePlaywrightSettingsHintSuffix } from './packaged-gui-e2e-playwright-meta.ts'
import { formatPackagedGuiE2ePlaywrightRootReadmeLine } from './packaged-gui-e2e-playwright-meta.ts'

export function formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? '[owner-manual-smoke.md](owner-manual-smoke.md) (ручная проверка на железе) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (ручная проверка после `pack:dir`).'
    : '[owner-manual-smoke.md](owner-manual-smoke.md) (manual verification on hardware) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (post-`pack:dir` verification).'
}

/** EN vs RU crosslinks count snippet for a Help path (`Help/en/…` → EN). */
export function pickPackagedE2eHelpWorkflowCrosslinksCountSnippet(helpRelPath: string): string {
  return helpRelPath.includes('/en/')
    ? PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
    : PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
}

/** EN vs RU count snippet for `locales/{en,ru}/settings.json` guards. */
export function pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
    : PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
}

/** Locales settings — §21 automation groups (`2 CI, 8 planned GUI, 2 manual-owner`). */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsAutomationGroupsSummary(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const groups = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT} CI, ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT} planned GUI, ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT} manual-owner`
  return locale === 'ru' ? groups : groups
}

/** Locales `appSettingsPackagedE2eRegistryGuardHint` — automation prefix. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardAutomationPrefix(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const groups = formatPackagedE2eHelpWorkflowCrosslinksSettingsAutomationGroupsSummary(locale)
  return locale === 'ru' ? `§21 e2e (11 шагов: ${groups}):` : `§21 e2e (11 steps: ${groups}):`
}

/** Locales `appSettingsPackagedSmokeCopyAppendixHint` — §21 groups parenthetical. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixGroupsParenthetical(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const groups = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT} CI headless, ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT} planned GUI, ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT} manual-owner`
  const body = `§21 packaged e2e (${groups})`
  return locale === 'ru' ? body : body
}

/** Locales `appSettingsOwnerSmokeIntro` — appendix automation snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroAutomationSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const groups = formatPackagedE2eHelpWorkflowCrosslinksSettingsAutomationGroupsSummary(locale)
  return `formatPackagedManualSmokeE2eAppendixLines (${groups} + per-step e2e <id>:)`
}

/** Full `appSettingsOwnerSmokeIntro` in locales settings.json (UI copy, not dev guard tails). */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'Скопируйте полный чеклист для отчёта о ручной проверке (тема, HiDPI, GPU, packaged для вашей ОС). Разделы ниже — только превью.'
    : 'Copy the full manual QA checklist for your report (theme, HiDPI, GPU, packaged build for this OS). Sections below are preview only.'
}

/** Tail of `appSettingsPackagedE2eRegistryGuardHint` in locales settings.json. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return `Help: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT} (${countSnippet}; ${partition}).`
}

/** Playwright tail for `appSettingsPackagedSmokeCopyAppendixHint` (§2.2/§21). */
function formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixPlaywrightTail(): string {
  return ` Playwright: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD} (reserved ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
}

/** Full `appSettingsPackagedSmokeCopyAppendixHint` in locales settings.json. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const intro = locale === 'ru' ? '«Скопировать» дописывает ' : 'Copy checklist also appends '
  const sameBlock =
    locale === 'ru'
      ? ' — тот же блок, что в ownerManualSmoke: и releaseSmoke:.'
      : ' — same block as ownerManualSmoke: and releaseSmoke:.'
  return (
    intro +
    formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixGroupsParenthetical(locale) +
    sameBlock +
    formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixPlaywrightTail()
  )
}

/** Playwright clause in `appSettingsPackagedE2eRegistryGuardHint` (§2.2/§21). */
function formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryPlaywrightClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return formatPackagedGuiE2ePlaywrightSettingsHintSuffix(locale)
}

/** Full `appSettingsPackagedE2eRegistryGuardHint` in locales settings.json. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const middle =
    locale === 'ru'
      ? '; Copy дописывает formatPackagedManualSmokeE2eAppendixLines; Support ZIP — planned GUI e2e scope + per-step e2e <id>:; '
      : '; Copy appends formatPackagedManualSmokeE2eAppendixLines; Support ZIP — planned GUI e2e scope + per-step e2e <id>:; '
  return (
    formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardAutomationPrefix(locale) +
    ' check:packaged-e2e-scenarios-registry' +
    formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryPlaywrightClause(locale) +
    middle +
    formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause(locale)
  )
}

/** Platform-packaging / §21 e2e diagnostics (`Help articles` vs `articles` label). */
export function formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine(
  articlesWord: 'Help articles' | 'articles' = 'Help articles'
): string {
  return `npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT} (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} ${articlesWord} ↔ owner/packaged §21)`
}

export function formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiScaffoldExportsInline(): string {
  return PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS.split(', ')
    .map((name) => `\`${name}\``)
    .join(', ')
}

/** Packaged smoke Help — workflow crosslinks partition note (§19/§21 diagnostics). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'partition: tail 42 + ffmpeg + knowledge, FAQ вне 44'
    : 'partition: tail 42 + ffmpeg + knowledge, FAQ outside 44'
}

/** README/AGENTS — workflow user-footer registry vs article count. */
export function formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause(): string {
  return `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT}/${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow user crosslink footers`
}

/** bin/README — workflow crosslinks partition bullet. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowPartitionLine(): string {
  return `- Workflow crosslinks (44): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}; ${formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()}.`
}

/** bin/README — Help §21 workflow crosslinks guard + strict registry. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowCrosslinksLine(): string {
  return `- Help §21 crosslinks: \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` — канон \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE}\` (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET}; ${formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()}; packaged/owner anchors).`
}

/** Markdown bullet for `bin/README.md` (alias — guard + Vitest). */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine(): string {
  return formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowCrosslinksLine()
}

/** Root README — §21 workflow crosslinks (partition + registry guard). */
export function formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine(): string {
  return `- Help §21: \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (44 workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}; ${formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()}); registry \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\` ↔ \`package.json\`.`
}

/** AGENTS.md — §21 workflow crosslinks guard + partition registry. */
export function formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine(): string {
  return `**Help §21:** \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (44 workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}; ${formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()}).`
}

/** AGENTS.md — full Help §21 line (workflow crosslinks + Playwright section from playwright-meta). */
export function formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine(
  playwrightHelpSection: string
): string {
  return `${formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine()} ${playwrightHelpSection}`
}

/** bin/README — §21 Playwright GUI e2e (`test:e2e:gui` wired). */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine(): string {
  return formatPackagedGuiE2ePlaywrightRootReadmeLine()
}

/** bin/README — packaged Help crosslinks quiet suffix (6 articles, 44 workflow). */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmePackagedQuietLine(): string {
  return `- Packaged Help (win/linux/macos): \`npm run check:help-packaged-smoke-docs\` — \`formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix\` (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET}, 6 articles).`
}

/** bin/README — Help smoke guards block in `check:quiet`. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeGuardsLine(): string {
  const docGuards = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS.map(
    (s) => `\`npm run ${s}\``
  ).join(', ')
  return `- Help smoke guards (\`check:quiet\`): registry \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\`, then ${docGuards}; §21 Playwright deferred — \`npm run check:packaged-gui-e2e-playwright-deferred\` (optional, не в quiet).`
}

/** bin/README — registry guard requires partition in all workflow Help. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine(): string {
  return `- Help workflow crosslinks (\`formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine\`): \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` — user footer (\`owner-manual-smoke\` + \`packaged-windows-smoke\`) in all ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow Help; sync \`node scripts/maint/sync-help-workflow-user-footers.mjs\`.`
}

/** Help §15 anchor articles with explicit crosslinks count (RU). */

/** Help §15 anchor articles with explicit crosslinks count (EN). */

/** Packaged smoke Help (windows) — dev line cites workflow crosslinks guard + count. */

/** Packaged smoke Help (linux/macos) — dev line cites workflow crosslinks guard. */

/** All packaged smoke Help articles (win + linux + macos, RU+EN). */

/** Help §15 articles with explicit crosslinks count (RU+EN anchors). */

/** Owner manual smoke Help (RU+EN) — same paths as count anchors [0]. */

/** Knowledge hub Help (RU+EN) — §13 workflow crosslinks dev line. */

/** All Help files checked by `check:help-owner-smoke-docs` (same 8 as count anchors). */

/** Guard substring in Help owner/about/packaged (`check:help-*-smoke-docs`). */

/** Required substrings — `check:help-owner-smoke-docs` / `check:help-packaged-smoke-docs`. */

/** Planner Help — user crosslinks only (dev §21 guards live in owner/about/logging). */

/** Parenthetical packaged Help crosslinks count (`(44 articles)` / `(44 статьи)`). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCountParenthetical(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return `(${pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)})`
}

/** Workflow hub Help — crosslinks guard count tail (42 RU+EN tail articles incl. FAQ). */
