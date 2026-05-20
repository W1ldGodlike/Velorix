/**
 * §21 — канон списка Help workflow crosslinks (`check:help-workflow-smoke-crosslinks`).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs).
 */

/** npm guard в `check:quiet` (§15 workflow Help ↔ owner/packaged §21). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT =
  'check:help-workflow-smoke-crosslinks' as const

/** Help §15/§21 guards in `check:quiet` (workflow + owner + packaged). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  'check:help-owner-smoke-docs',
  'check:help-packaged-smoke-docs'
] as const

/** Registry guard: `package.json` scripts ↔ doc guards (runs first in `check:quiet`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT =
  'check:help-smoke-guards-package-json' as const

/** `run-quiet-check.mjs` step labels (registry → workflow → owner → packaged). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS = [
  'help-smoke-guards-package-json',
  'help-workflow-smoke-crosslinks',
  'help-owner-smoke-docs',
  'help-packaged-smoke-docs'
] as const

/** Leaf module id (bin/README, diagnostics). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE =
  'packaged-e2e-help-workflow-crosslinks-meta' as const

/** Dev engines README — workflow crosslinks guard + EN count snippet. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH = 'bin/README.md' as const

/** Root README — workflow crosslinks partition (§21). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ROOT_README_PATH = 'README.md' as const

/** Agent handoff — workflow crosslinks guard (§21). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_AGENTS_MD_PATH = 'AGENTS.md' as const

/** Required in each of 44 workflow Help articles (`WORKFLOW_REQUIRED_SNIPPETS` + Vitest). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET =
  'partition:' as const

/** Required substrings in each workflow Help article (`check:help-workflow-smoke-crosslinks`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  '§21 e2e',
  'e2e <id>:',
  'releaseSmoke:',
  'terminalHints:',
  'logging-and-diagnostics.md',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET
] as const

/** RU+EN workflow/export/downloads/terminal/theme/HW/shell/getting-started. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS = [
  'Help/downloads-workflow.md',
  'Help/ffmpeg-rail-presets.md',
  'Help/probe-and-inspector-basics.md',
  'Help/workflows-planner-scenarios.md',
  'Help/en/downloads-workflow.md',
  'Help/en/ffmpeg-rail-presets.md',
  'Help/en/probe-and-inspector-basics.md',
  'Help/en/workflows-planner-scenarios.md',
  'Help/knowledge-base-howto.md',
  'Help/en/knowledge-base-howto.md',
  'Help/extract-frames.md',
  'Help/processing-social-presets.md',
  'Help/en/extract-frames.md',
  'Help/en/processing-social-presets.md',
  'Help/processing-history.md',
  'Help/downloads-settings-rail.md',
  'Help/en/processing-history.md',
  'Help/en/downloads-settings-rail.md',
  'Help/downloads-dragdrop.md',
  'Help/processing-url-combo.md',
  'Help/ffmpeg-terminal-hints.md',
  'Help/en/downloads-dragdrop.md',
  'Help/en/processing-url-combo.md',
  'Help/en/ffmpeg-terminal-hints.md',
  'Help/processing-advanced-fields.md',
  'Help/en/processing-advanced-fields.md',
  'Help/appearance-language-theme.md',
  'Help/en/appearance-language-theme.md',
  'Help/hardware-encoding.md',
  'Help/en/hardware-encoding.md',
  'Help/windows-shell-integration.md',
  'Help/en/windows-shell-integration.md',
  'Help/getting-started.md',
  'Help/en/getting-started.md',
  'Help/editor-workflow.md',
  'Help/en/editor-workflow.md',
  'Help/session-and-queues.md',
  'Help/en/session-and-queues.md',
  'Help/workspace-tabs.md',
  'Help/en/workspace-tabs.md',
  'Help/keyboard-shortcuts.md',
  'Help/en/keyboard-shortcuts.md',
  'Help/engines-update-paths.md',
  'Help/en/engines-update-paths.md'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT =
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length

/** Workflow Help without `HelpCrosslinksCountTail` (§8 ffmpeg-terminal-hints, 24 articles guard). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS = [
  'Help/ffmpeg-terminal-hints.md',
  'Help/en/ffmpeg-terminal-hints.md'
] as const

/** FAQ in workflow tail (`HelpCrosslinksCountTail`) but outside 44 workflow crosslinks articles. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS = [
  'Help/faq-troubleshooting.md',
  'Help/en/faq-troubleshooting.md'
] as const

/** Sync с Help/locales (`44 articles` / `44 статьи`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} articles`

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} статьи`

export type PackagedE2eHelpWorkflowCrosslinksLocale = 'en' | 'ru'

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
  return locale === 'ru' ? `§21 e2e (12 шагов: ${groups}):` : `§21 e2e (12 steps: ${groups}):`
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

/** Playwright tail for `appSettingsOwnerSmokeIntro` (§3/§21). */
function formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroPlaywrightTail(): string {
  return ` Playwright GUI: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD} (reserved ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}).`
}

/** Full `appSettingsOwnerSmokeIntro` in locales settings.json. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const intro =
    locale === 'ru'
      ? 'Копирует единый чеклист с заголовком версии/сборки: тема, HiDPI, HW, сценарии, packaged smoke вашей ОС, планировщик и (на Windows) Проводник; в конце — '
      : 'Copies one checklist with a version/build header: theme, HiDPI, HW, scenarios, packaged smoke for your OS, scheduler, and (on Windows) Explorer shell; ends with '
  const zipTail =
    locale === 'ru'
      ? '. Тело — в Support ZIP (ownerManualSmoke:) и releaseSmoke:.'
      : '. Body is in Support ZIP (ownerManualSmoke:) and releaseSmoke:.'
  return (
    intro +
    formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroAutomationSnippet(locale) +
    zipTail +
    formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroPlaywrightTail()
  )
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
  return locale === 'ru'
    ? `; Playwright: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD} (reserved ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}; не в package.json)`
    : `; Playwright: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD} (reserved ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}; not in package.json yet)`
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

/** bin/README — workflow crosslinks partition (44 = tail−FAQ + ffmpeg + knowledge). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET =
  'tail 42 HelpCrosslinksCountTail + ffmpeg FfmpegTerminalWorkflowClause + knowledge KnowledgeHubDevClause (FAQ 2 in tail, outside 44)' as const

/** Required substrings in `bin/README.md` (§21 Playwright deferred). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT =
  'test:e2e:gui' as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD =
  'check:packaged-gui-e2e-playwright-deferred' as const

/** Sync with `PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT` (`packaged-gui-e2e-playwright-meta.ts`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT = 8 as const

/** Sync with `PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE` (`packaged-gui-e2e-playwright-meta.ts`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE =
  'tests/e2e/gui/planned-gui-e2e-steps.ts' as const

/** Sync with `PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS` (`packaged-gui-e2e-playwright-meta.ts`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS =
  'PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID' as const

function formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiScaffoldExportsInline(): string {
  return PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS.split(', ')
    .map((name) => `\`${name}\``)
    .join(', ')
}

/** Sync with `PACKAGED_E2E_CI_HEADLESS_STEP_IDS` length (`packaged-e2e-smoke-scenarios.ts`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT = 2 as const

/** Sync with `PACKAGED_E2E_MANUAL_OWNER_STEP_IDS` length (`packaged-e2e-smoke-scenarios.ts`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT = 2 as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_REQUIRED_SNIPPETS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET,
  'formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine',
  'formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix',
  'check:help-packaged-smoke-docs',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  'packaged-gui-e2e-playwright-meta'
] as const

/** bin/README — workflow crosslinks partition bullet. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowPartitionLine(): string {
  return `- Workflow crosslinks partition (44): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}.`
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
  return `- Help §21: \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (44 workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}; ${formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()}); registry \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\` requires \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET}\` in all ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow Help.`
}

/** AGENTS.md — §21 workflow crosslinks guard + partition registry. */
export function formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine(): string {
  return `**Help §21:** \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (44 workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET}; ${formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()}); registry \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\` requires \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET}\` in all ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow Help.`
}

/** AGENTS.md — full Help §21 line (workflow crosslinks + Playwright section from playwright-meta). */
export function formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine(
  playwrightHelpSection: string
): string {
  return `${formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine()} ${playwrightHelpSection}`
}

/** bin/README — §21 Playwright GUI e2e deferred (`test:e2e:gui` not in package.json yet). */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine(): string {
  return `- §21 planned GUI Playwright (deferred): \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD}\` — reserved \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT} planned-gui-e2e; \`packaged-gui-e2e-playwright-meta\`; not in package.json until wired).`
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
  return `- Help smoke guards (\`check:quiet\`): registry \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\` (4 Help doc guards + requires \`check:packaged-gui-e2e-playwright-deferred\` in package.json), then ${docGuards}; §21 Playwright deferred after \`check:packaged-e2e-scenarios-registry\`.`
}

/** bin/README — registry guard requires partition in all workflow Help. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine(): string {
  return `- Help workflow partition guard (\`formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine\`): \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\` requires \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET}\` in all ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow Help.`
}

/** Help §15 anchor articles with explicit crosslinks count (RU). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS = [
  'Help/owner-manual-smoke.md',
  'Help/about-support-logs.md',
  'Help/logging-and-diagnostics.md',
  'Help/workflows-planner-scenarios.md'
] as const

/** Help §15 anchor articles with explicit crosslinks count (EN). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS = [
  'Help/en/owner-manual-smoke.md',
  'Help/en/about-support-logs.md',
  'Help/en/logging-and-diagnostics.md',
  'Help/en/workflows-planner-scenarios.md'
] as const

/** Packaged smoke Help (windows) — dev line cites workflow crosslinks guard + count. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS = [
  'Help/packaged-windows-smoke.md',
  'Help/en/packaged-windows-smoke.md'
] as const

/** Packaged smoke Help (linux/macos) — dev line cites workflow crosslinks guard. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS = [
  'Help/packaged-linux-smoke.md',
  'Help/packaged-macos-smoke.md',
  'Help/en/packaged-linux-smoke.md',
  'Help/en/packaged-macos-smoke.md'
] as const

/** All packaged smoke Help articles (win + linux + macos, RU+EN). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS
] as const

/** Help §15 articles with explicit crosslinks count (RU+EN anchors). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS
] as const

/** Owner manual smoke Help (RU+EN) — same paths as count anchors [0]. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS[0],
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS[0]
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS[1],
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS[1]
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS[2],
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS[2]
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS[3],
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS[3]
] as const

/** Knowledge hub Help (RU+EN) — §13 workflow crosslinks dev line. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS = [
  'Help/knowledge-base-howto.md',
  'Help/en/knowledge-base-howto.md'
] as const

/** All Help files checked by `check:help-owner-smoke-docs` (same 8 as count anchors). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS
] as const

/** Guard substring in Help owner/about/packaged (`check:help-*-smoke-docs`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET =
  'fix:esm-shim' as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH =
  'electron-vite-build-meta.ts' as const

/** Required substrings — `check:help-owner-smoke-docs` / `check:help-packaged-smoke-docs`. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_REQUIRED_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  'terminalHints:',
  'check:help-terminal-hints-docs',
  'logging-and-diagnostics.md',
  '§21 e2e',
  'e2e launch:',
  '§21 packaged e2e (CI vs owner)',
  'formatPackagedManualSmokeE2eAppendixLines',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  'release-code-signing-roadmap.ts',
  'check:help-packaged-smoke-docs'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_REQUIRED_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  'terminalHints:',
  'check:support-bundle-terminal-hints',
  '§21 e2e',
  'e2e <id>:',
  'win-unpacked',
  'linux-unpacked',
  'FluxAlloy.app',
  'present/missing',
  '§21 packaged e2e (CI vs owner)',
  'appendPackagedManualSmokeE2ePlanLines',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  'release-code-signing-roadmap.ts',
  'check:help-packaged-smoke-docs'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_REQUIRED_SNIPPETS = [
  'check:packaged-e2e-scenarios-registry',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  'terminalHints:',
  'check:support-bundle-terminal-hints',
  'check:help-terminal-hints-docs',
  '§21 packaged e2e (CI vs owner)',
  'planned GUI e2e scope',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  'release-code-signing-roadmap.ts',
  'check:help-packaged-smoke-docs'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  'formatPackagedManualSmokeE2eAppendixLines',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  'release-code-signing-roadmap.ts',
  'check:help-packaged-smoke-docs'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-manual-smoke-parity',
  'packaged-e2e-scenarios-registry',
  'e2e launch:',
  'present/missing',
  '§4.3',
  'owner:',
  '§21 packaged e2e (CI vs owner)',
  'Planned GUI e2e',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS = [
  'engines:doctor',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH,
  'linux-packaging'
] as const

/** Parenthetical packaged Help crosslinks count (`(44 articles)` / `(44 статьи)`). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCountParenthetical(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return `(${pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)})`
}

/** Workflow hub Help — crosslinks guard count tail (42 RU+EN tail articles incl. FAQ). */
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

/** Planner Help diagnostics — owner-smoke bundle lead (§10/§16). */
export function formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsOwnerSmokeLead(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'Единый пакет owner-smoke (включая scheduler): **Настройки → Зависимости → Ручной smoke** или deep-link в планировщике — [owner-manual-smoke.md](owner-manual-smoke.md).'
    : 'Full owner-smoke bundle (scheduler): **Settings → Dependencies → Owner manual smoke**, or the planner deep-link — [owner-manual-smoke.md](owner-manual-smoke.md).'
}

/** Planner Help diagnostics — packaged §21 e2e appendix clause. */
export function formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsPackagedE2eClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' Packaged ffmpeg/ytdlp после `pack:dir` — [packaged-windows-smoke.md](packaged-windows-smoke.md); §21 e2e **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`, per-step `e2e <id>:`) в Copy и `releaseSmoke:`;'
    : ' Packaged ffmpeg/ytdlp after `pack:dir` — [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`, per-step `e2e <id>:`) in Copy and `releaseSmoke:`;'
}

/** Planner Help diagnostics — `terminalHints:` logging hub link (§8). */
export function formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsTerminalHintsClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' dev-блок `terminalHints:` (§8, 24 статьи Help) — [logging-and-diagnostics.md](logging-and-diagnostics.md)'
    : ' dev block `terminalHints:` (§8, 24 Help articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md)'
}

/** Planner Help diagnostics — full owner/packaged/§21 tail (inject Playwright UI hint from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  plannerPlaywrightUiHintSuffix: string
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsOwnerSmokeLead(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsPackagedE2eClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsTerminalHintsClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale) +
    plannerPlaywrightUiHintSuffix
  )
}

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

/** Owner manual smoke Help — manual-owner steps without GUI automation (§7.5 / §4.3). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeManualOwnerClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' **manual-owner** без GUI-автоматизации: `video-sprite`, `mini-player` (§7.5 / §4.3) — при Support ZIP смотрите `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 статьи).'
    : ' **manual-owner** without GUI automation: `video-sprite`, `mini-player` (§7.5 / §4.3) — attach Support ZIP `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 articles).'
}

/** Owner manual smoke Help — packaged-windows + workflow articles step Help tail. */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepHelpClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const workflow =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause(locale)
  return locale === 'ru'
    ? ` Help по шагам — [packaged-windows-smoke.md](packaged-windows-smoke.md) и ${workflow}`
    : ` Step Help — [packaged-windows-smoke.md](../packaged-windows-smoke.md) and ${workflow}`
}

/** Owner manual smoke Help — full planned GUI e2e paragraph (inject Playwright UI hints from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  void locale
  return ` Playwright scaffold: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE}\` (${formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiScaffoldExportsInline()}).`
}

/** Owner manual smoke Help — planned step notes map (Copy/releaseSmoke diagnostic). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ` Copy/releaseSmoke: \`PLANNED_GUI_E2E_STEP_BY_ID\` (registry \`note\` на шаг; \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`).`
    : ` Copy/releaseSmoke includes \`PLANNED_GUI_E2E_STEP_BY_ID\` (registry \`note\` per step; \`formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine\`).`
}

/** Owner/about/logging hub Help — Playwright wiring handoff (§21 deferred). */
export function formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ` Wiring: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (после owner-smoke)`
    : ` Wiring: \`docs/RELEASE.md\` — \`formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet\` (after owner-smoke on hardware)`
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

/** §21 Playwright deferred suffix (about/logging/packaged Help dev lines). */
export function formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ` §21 Playwright: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD}\` (reserved \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\`).`
    : ` §21 Playwright: \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD}\` (reserved \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\`).`
}

/** Packaged windows Help — §21 automation groups in Copy paragraph (`2/8/2`). */
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
    ? `§21 planned GUI e2e (${count} шагов) — [owner-manual-smoke.md](owner-manual-smoke.md); канон stepId: \`PACKAGED_E2E_PLANNED_GUI_STEP_IDS\`; scaffold: \`${module}\` (${exportsInline}).${stepById}${wiring}.`
    : `§21 planned GUI e2e (${count} steps) — [owner-manual-smoke.md](owner-manual-smoke.md); canonical ids: \`PACKAGED_E2E_PLANNED_GUI_STEP_IDS\`; scaffold: \`${module}\` (${exportsInline}).${stepById}${wiring}.`
}

const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE =
  '`open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`' as const

function formatPackagedE2eHelpWorkflowCrosslinksPlannedGuiReservedClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? `Зарезервировано \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (\`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD}\`; пока нет в \`package.json\`).`
    : `Reserved \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}\` (\`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD}\`; not in \`package.json\` yet).`
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
    ? `**Planned GUI e2e** (${count} шагов, Playwright позже) — ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}${scaffold}${stepById}${wiring}.`
    : `**Planned GUI e2e** (${count} steps, Playwright later): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}${scaffold}${stepById}${wiring}.`
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
    ? `**Planned GUI e2e** (${count} шагов, Playwright позже, сейчас — ручной smoke): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}`
    : `**Planned GUI e2e** (${count} steps, Playwright later; manual smoke today): ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_STEP_IDS_INLINE}. ${reserved}`
}

/** `docs/RELEASE.md` — `check:help-workflow-smoke-crosslinks` guard bullet. */
export function formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine(): string {
  const anchorCount = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length
  const packagedCount = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS.length
  return `- \`npm run check:help-workflow-smoke-crosslinks\` — \`packaged-e2e-help-workflow-crosslinks-meta\` (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow + ${packagedCount} packaged + ${anchorCount} anchors; tail 42 \`HelpCrosslinksCountTail\`, ffmpeg-terminal \`FfmpegTerminalWorkflowClause\`, knowledge \`KnowledgeHubDevClause\`; FAQ в tail, вне 44); \`bin/README.md\` — \`BinReadmeWorkflowPartitionLine\`, \`BinReadmePartitionGuardLine\`; \`README.md\`/\`AGENTS.md\` — \`RootReadmePartitionLine\` / \`AgentsMdHelpLine\` (partition registry); owner/packaged §21 + \`terminalHints:\` → logging hub; дублирует guard/count с \`check:help-owner-smoke-docs\`, \`check:help-packaged-smoke-docs\`, \`check:owner-visual-smoke-locale\` (\`formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause\`).`
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
  return locale === 'ru'
    ? ' §8 terminal — `check:terminal-contract-hints-shards` (35 shards, 1056+833 hints), `check:help-terminal-hints-docs` (24 статей), `check:support-bundle-terminal-hints`, `check:terminal-hints-locale` (Настройки → Зависимости).'
    : ' §8 terminal — `check:terminal-contract-hints-shards` (35 shards, 1056+833 hints), `check:help-terminal-hints-docs` (24 articles), `check:support-bundle-terminal-hints`, `check:terminal-hints-locale` (Settings → Dependencies).'
}

/** Logging Help — UI Copy §21 appendix before planned GUI scope clause. */
export function formatPackagedE2eHelpWorkflowCrosslinksLoggingCopyE2eClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' UI **Скопировать** (packaged + owner bundle) дописывает **§21 packaged e2e (CI vs owner)**; '
    : ' UI **Copy** (packaged + owner bundle) appends **§21 packaged e2e (CI vs owner)**; '
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

/** Workflow article — packaged-windows + Linux/macOS siblings (editor-style lead). */
export function formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticlePackagedWinSiblingsClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? '[packaged-windows-smoke.md](packaged-windows-smoke.md) и соседние статьи для Linux/macOS'
    : '[packaged-windows-smoke.md](../packaged-windows-smoke.md) and Linux/macOS articles'
}

function pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale).replace(/^;/, '')
}

/** Workflow article — owner bundle + §21 e2e + `terminalHints:` + crosslinks guard tail. */
export function formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticleOwnerReleaseTerminalTail(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  return locale === 'ru'
    ? `; owner bundle и §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\` — [owner-manual-smoke.md](owner-manual-smoke.md); dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `; owner bundle and §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\` — [owner-manual-smoke.md](owner-manual-smoke.md); dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** Workflow article — owner bundle + §21 e2e without "per-step" label (downloads-settings-rail). */
export function formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticleOwnerReleaseTerminalTailCompact(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  return locale === 'ru'
    ? `; owner bundle и §21 e2e \`e2e <id>:\` в \`releaseSmoke:\` — [owner-manual-smoke.md](owner-manual-smoke.md); dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `; owner bundle and §21 e2e \`e2e <id>:\` in \`releaseSmoke:\` — [owner-manual-smoke.md](owner-manual-smoke.md); dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN editor-workflow — packaged smoke tail line (§10). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EDITOR_HELP_PATHS = [
  'Help/editor-workflow.md',
  'Help/en/editor-workflow.md'
] as const

/** Editor workflow Help — full packaged smoke line (`check:help-workflow-smoke-crosslinks`). */
export function formatPackagedE2eHelpWorkflowCrosslinksEditorWorkflowPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const featureScope = '(open-file, snapshot, export)'
  const packagedWin =
    formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticlePackagedWinSiblingsClause(locale)
  return `Packaged smoke ${featureScope} — ${packagedWin}${formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticleOwnerReleaseTerminalTail(locale)}`
}

/** RU+EN downloads-settings-rail — packaged ytdlp snippet (§6). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_SETTINGS_RAIL_HELP_PATHS = [
  'Help/downloads-settings-rail.md',
  'Help/en/downloads-settings-rail.md'
] as const

/** Downloads settings rail Help — packaged **ytdlp** after `pack:dir` snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksDownloadsSettingsRailPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const packagedWin =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Packaged **ytdlp** после \`pack:dir\` — ${packagedWin}`
      : `Packaged **ytdlp** after \`pack:dir\` — ${packagedWin}`
  return `${lead}${formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticleOwnerReleaseTerminalTailCompact(locale)}`
}

/** RU+EN downloads-dragdrop — clipboard/DnD ytdlp packaged snippet (§6). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_DRAGDROP_HELP_PATHS = [
  'Help/downloads-dragdrop.md',
  'Help/en/downloads-dragdrop.md'
] as const

/** downloads-dragdrop Help — packaged **ytdlp** after `pack:dir` (per-step §21 tail). */
export function formatPackagedE2eHelpWorkflowCrosslinksDownloadsDragdropPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const packagedWin =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Packaged **ytdlp** после \`pack:dir\` — ${packagedWin}; §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\` — [owner-manual-smoke.md](owner-manual-smoke.md); dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
      : `Packaged **ytdlp** after \`pack:dir\` — ${packagedWin}; §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\` — [owner-manual-smoke.md](owner-manual-smoke.md); dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
  return `${lead}${helpTail}`
}

/** RU+EN processing-url-combo — editor URL strip queue/ytdlp packaged snippet (§6/§10). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_URL_COMBO_HELP_PATHS = [
  'Help/processing-url-combo.md',
  'Help/en/processing-url-combo.md'
] as const

/** processing-url-combo Help — packaged smoke queue/ytdlp see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksProcessingUrlComboPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Packaged smoke очереди/ytdlp — ${ownerPackaged}; §21 e2e \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
      : `Packaged smoke queue/ytdlp — ${ownerPackaged}; §21 e2e \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
  return `${lead}${helpTail}`
}

/** RU+EN extract-frames — snapshot / §7.5 sprite packaged snippet (§7). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EXTRACT_FRAMES_HELP_PATHS = [
  'Help/extract-frames.md',
  'Help/en/extract-frames.md'
] as const

/** extract-frames Help — packaged snapshot / sprite smoke see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksExtractFramesPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Packaged smoke шагов **snapshot** / спрайт §7.5 — ${ownerPackaged}; §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
      : `Packaged smoke **snapshot** / §7.5 sprite steps — ${ownerPackaged}; §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
  return `${lead}${helpTail}`
}

/** RU+EN processing-social-presets — export/ffmpeg packaged snippet (§7). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_SOCIAL_PRESETS_HELP_PATHS = [
  'Help/processing-social-presets.md',
  'Help/en/processing-social-presets.md'
] as const

/** processing-social-presets Help — packaged export/ffmpeg see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksProcessingSocialPresetsPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Packaged smoke **export** / ffmpeg — ${ownerPackaged}; §21 e2e \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
      : `Packaged smoke **export** / ffmpeg — ${ownerPackaged}; §21 e2e \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
  return `${lead}${helpTail}`
}

/** RU+EN processing-advanced-fields — export/ffmpeg packaged snippet (§7). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_ADVANCED_FIELDS_HELP_PATHS = [
  'Help/processing-advanced-fields.md',
  'Help/en/processing-advanced-fields.md'
] as const

/** processing-advanced-fields Help — packaged export/ffmpeg see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksProcessingAdvancedFieldsPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Packaged smoke **export**/ffmpeg — ${ownerPackaged}; §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
      : `Packaged smoke **export**/ffmpeg — ${ownerPackaged}; §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
  return `${lead}${helpTail}`
}

/** RU+EN engines-update-paths — §19 engines packaged smoke paragraph (§17). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ENGINES_UPDATE_PATHS_HELP_PATHS = [
  'Help/engines-update-paths.md',
  'Help/en/engines-update-paths.md'
] as const

/** engines-update-paths Help — §19/§21 packaged engines smoke paragraph. */
export function formatPackagedE2eHelpWorkflowCrosslinksEnginesUpdatePathsPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  const lead =
    locale === 'ru'
      ? `После \`npm run pack:dir\` (Windows) или \`pack:linux:dir\` / \`pack:mac:dir\` проверьте бинарники в \`dist/*-unpacked\` (\`smoke:packaged-*\` в CI). Ручной чеклист владельца и §21 e2e (per-step \`e2e <id>:\` в Support ZIP \`releaseSmoke:\`) — ${ownerPackaged}; dev-блок \`terminalHints:\` (§8, 24 статьи Help) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
      : `After \`npm run pack:dir\` (Windows) or \`pack:linux:dir\` / \`pack:mac:dir\`, verify engines under \`dist/*-unpacked\` (\`smoke:packaged-*\` in CI). Owner manual smoke and §21 e2e (per-step \`e2e <id>:\` in Support ZIP \`releaseSmoke:\`) — ${ownerPackaged}; dev block \`terminalHints:\` (§8, 24 Help articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md);`
  const devSuffix =
    locale === 'ru'
      ? ' Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-terminal-hints-docs`, см. `bin/README.md`.'
      : ' Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-terminal-hints-docs`; see `bin/README.md`.'
  return `${lead}${helpTail}${devSuffix}`
}

/** RU+EN windows-shell-integration — Explorer context menu owner/packaged (§14). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WINDOWS_SHELL_INTEGRATION_HELP_PATHS = [
  'Help/windows-shell-integration.md',
  'Help/en/windows-shell-integration.md'
] as const

/** windows-shell-integration Help — owner/packaged §21 see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksWindowsShellIntegrationPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerManual = '[owner-manual-smoke.md](owner-manual-smoke.md)'
  const packagedWin =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  const lead =
    locale === 'ru'
      ? `Ручной smoke блока **Windows shell** в Support ZIP — ${ownerManual} (\`ownerManualSmoke:\`; §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\`); dev-блок \`terminalHints:\` (§8, 24 статьи) — [logging-and-diagnostics.md](logging-and-diagnostics.md); packaged open-file — ${packagedWin};`
      : `Owner manual **Windows shell** checklist in Support ZIP — ${ownerManual} (\`ownerManualSmoke:\`; §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\`); dev block \`terminalHints:\` (§8, 24 articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md); packaged open-file — ${packagedWin};`
  return `${lead}${helpTail}`
}

/** RU+EN session-and-queues — packaged ytdlp + owner bundle (§6). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_SESSION_QUEUES_HELP_PATHS = [
  'Help/session-and-queues.md',
  'Help/en/session-and-queues.md'
] as const

/** Session and queues Help — packaged smoke ytdlp step snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksSessionQueuesPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  return locale === 'ru'
    ? `Packaged smoke шага **ytdlp** и owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](packaged-windows-smoke.md); §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `Packaged smoke **ytdlp** step and owner bundle — [owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN ffmpeg-rail-presets — export/ffprobe packaged smoke list item (§7). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_RAIL_HELP_PATHS = [
  'Help/ffmpeg-rail-presets.md',
  'Help/en/ffmpeg-rail-presets.md'
] as const

/** ffmpeg-rail-presets Help — packaged smoke related-topics list item. */
export function formatPackagedE2eHelpWorkflowCrosslinksFfmpegRailPresetsPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  return locale === 'ru'
    ? `- Packaged smoke (export / ffmpeg / ffprobe / snapshot) — ${ownerPackaged}; §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8, 24 статьи) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `- Packaged smoke (export / ffmpeg / ffprobe / snapshot) — ${ownerPackaged}; §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8, 24 articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN processing-history — export/snapshot packaged smoke (§13). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_HISTORY_HELP_PATHS = [
  'Help/processing-history.md',
  'Help/en/processing-history.md'
] as const

/** processing-history Help — packaged smoke see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksProcessingHistoryPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const links =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md), [owner-manual-smoke.md](owner-manual-smoke.md)'
  return locale === 'ru'
    ? `Packaged smoke export/snapshot — ${links}; §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `Packaged smoke export/snapshot — ${links}; §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN appearance-language-theme — Theme/HiDPI owner smoke + packaged (§5). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_APPEARANCE_THEME_HELP_PATHS = [
  'Help/appearance-language-theme.md',
  'Help/en/appearance-language-theme.md'
] as const

/** appearance-language-theme Help — owner manual smoke bundle lead (Theme/HiDPI). */
export function formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemeOwnerSmokeLead(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'Полный пакет для Support ZIP: **Настройки → Зависимости → Ручной smoke** → «Скопировать весь пакет» (блоки Theme/HiDPI + §21 e2e per-step `e2e <id>:`; см. [owner-manual-smoke.md](owner-manual-smoke.md)).'
    : 'Full Support ZIP bundle: **Settings → Dependencies → Owner manual smoke** → **Copy full bundle** (Theme/HiDPI blocks + §21 e2e per-step `e2e <id>:`; see [owner-manual-smoke.md](owner-manual-smoke.md)).'
}

/** appearance-language-theme Help — packaged smoke after `pack:dir` paragraph. */
export function formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemePackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const packagedWin =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  const packagedClause =
    locale === 'ru'
      ? ` Packaged smoke после \`pack:dir\` — ${packagedWin}; в \`releaseSmoke:\` — тот же §21 appendix; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
      : ` Packaged smoke after \`pack:dir\` — ${packagedWin}; \`releaseSmoke:\` carries the same §21 appendix; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
  return (
    formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemeOwnerSmokeLead(locale) + packagedClause
  )
}

/** RU+EN workspace-tabs — hub links + owner/packaged smoke (§15). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKSPACE_TABS_HELP_PATHS = [
  'Help/workspace-tabs.md',
  'Help/en/workspace-tabs.md'
] as const

/** workspace-tabs Help — next-section hub + packaged smoke snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksWorkspaceTabsPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const hubLinks =
    '[getting-started.md](getting-started.md) · [downloads-workflow.md](downloads-workflow.md) · [editor-workflow.md](editor-workflow.md).'
  const ownerPackaged =
    locale === 'ru'
      ? '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  return locale === 'ru'
    ? `${hubLinks} Owner smoke и §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\` — ${ownerPackaged}; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `${hubLinks} Owner smoke and §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\` — ${ownerPackaged}; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN keyboard-shortcuts — packaged/owner smoke (§15). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KEYBOARD_SHORTCUTS_HELP_PATHS = [
  'Help/keyboard-shortcuts.md',
  'Help/en/keyboard-shortcuts.md'
] as const

/** keyboard-shortcuts Help — packaged/owner smoke see-also snippet. */
export function formatPackagedE2eHelpWorkflowCrosslinksKeyboardShortcutsPackagedSmokeSnippet(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const ownerPackaged =
    locale === 'ru'
      ? '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[owner-manual-smoke.md](owner-manual-smoke.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  return locale === 'ru'
    ? `См. также [workspace-tabs.md](workspace-tabs.md). Packaged/owner smoke и §21 e2e per-step \`e2e <id>:\` в \`releaseSmoke:\` — ${ownerPackaged}; dev-блок \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `See also [workspace-tabs.md](workspace-tabs.md). Packaged/owner smoke and §21 e2e per-step \`e2e <id>:\` in \`releaseSmoke:\` — ${ownerPackaged}; dev block \`terminalHints:\` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN probe-and-inspector-basics — ffprobe packaged smoke § (§9). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROBE_INSPECTOR_HELP_PATHS = [
  'Help/probe-and-inspector-basics.md',
  'Help/en/probe-and-inspector-basics.md'
] as const

/** probe-and-inspector-basics Help — §19/§21 packaged smoke section paragraph. */
export function formatPackagedE2eHelpWorkflowCrosslinksProbeInspectorPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const packagedWin =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md)'
  return locale === 'ru'
    ? `Ручной чеклист **ffprobe** — [owner-manual-smoke.md](owner-manual-smoke.md). После \`npm run pack:dir\` — шаг **ffprobe** в ${packagedWin}; §21 e2e per-step \`e2e <id>:\` в Support ZIP \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `Owner manual **ffprobe** checklist — [owner-manual-smoke.md](owner-manual-smoke.md). After \`npm run pack:dir\` — **ffprobe** step in ${packagedWin}; §21 e2e per-step \`e2e <id>:\` in Support ZIP \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN downloads-workflow — queue/ytdlp packaged smoke § (§6). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_WORKFLOW_HELP_PATHS = [
  'Help/downloads-workflow.md',
  'Help/en/downloads-workflow.md'
] as const

/** downloads-workflow Help — §19/§21 packaged smoke section paragraph. */
export function formatPackagedE2eHelpWorkflowCrosslinksDownloadsWorkflowPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  const packagedWin =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md) (Linux/macOS — соседние статьи)'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md) (Linux/macOS — sibling articles)'
  return locale === 'ru'
    ? `Ручной чеклист владельца для очереди и **yt-dlp** — [owner-manual-smoke.md](owner-manual-smoke.md). После \`npm run pack:dir\` — шаг **ytdlp** в ${packagedWin}; §21 e2e per-step \`e2e <id>:\` в Support ZIP \`releaseSmoke:\`; dev-блок \`terminalHints:\` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `Owner manual checklist for the queue and **yt-dlp** — [owner-manual-smoke.md](owner-manual-smoke.md). After \`npm run pack:dir\` — **ytdlp** step in ${packagedWin}; §21 e2e per-step \`e2e <id>:\` in Support ZIP \`releaseSmoke:\`; dev block \`terminalHints:\` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN hardware-encoding — HW owner/packaged + see-also tail (§16). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HARDWARE_ENCODING_HELP_PATHS = [
  'Help/hardware-encoding.md',
  'Help/en/hardware-encoding.md'
] as const

/** hardware-encoding Help — quick-start owner bundle + packaged siblings clause. */
export function formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingQuickStartOwnerPackagedClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const packagedSiblings =
    locale === 'ru'
      ? '[packaged-windows-smoke.md](packaged-windows-smoke.md) и соседние статьи для Linux/macOS'
      : '[packaged-windows-smoke.md](../packaged-windows-smoke.md) and Linux/macOS articles'
  return locale === 'ru'
    ? `Полный пакет (тема, HiDPI, HW, спрайт §7.5, мини-плеер, packaged) — [owner-manual-smoke.md](owner-manual-smoke.md) (в конце §21 e2e: per-step \`e2e <id>:\` в \`ownerManualSmoke:\` / \`releaseSmoke:\`); после \`pack:dir\` — ${packagedSiblings}.`
    : `Full owner bundle (theme, HiDPI, HW, §7.5 sprite, mini player, packaged) — [owner-manual-smoke.md](owner-manual-smoke.md) (ends with §21 e2e per-step \`e2e <id>:\` in \`ownerManualSmoke:\` / \`releaseSmoke:\`); after \`pack:dir\` see ${packagedSiblings}.`
}

/** hardware-encoding Help — see-also + `terminalHints:` diagnostics tail. */
export function formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingSeeAlsoTail(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const helpTail = pickPackagedE2eHelpWorkflowCrosslinksWorkflowArticleHelpTail(locale)
  return locale === 'ru'
    ? `См. также [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md), [owner-manual-smoke.md](owner-manual-smoke.md) и [faq-troubleshooting.md](faq-troubleshooting.md). При диагностике HW-export в Support ZIP — dev-блок \`terminalHints:\` (§8, 24 статей Help) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
    : `See also [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md), [owner-manual-smoke.md](owner-manual-smoke.md) and [faq-troubleshooting.md](faq-troubleshooting.md). For HW export diagnostics, Support ZIP includes dev block \`terminalHints:\` (§8, 24 Help articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md);${helpTail}`
}

/** RU+EN getting-started — packaged smoke list bullet (§15 onboarding). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS = [
  'Help/getting-started.md',
  'Help/en/getting-started.md'
] as const

/** Getting-started Help — packaged smoke bullet lead. */
export function formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeLead(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'Packaged smoke после сборки — [packaged-windows-smoke.md](packaged-windows-smoke.md) (Linux/macOS — соседние статьи);'
    : 'Packaged smoke after build — [packaged-windows-smoke.md](../packaged-windows-smoke.md) (Linux/macOS — sibling articles);'
}

/** Getting-started Help — §21 e2e appendix (`appendPackagedManualSmokeE2e*` differs RU vs EN). */
export function formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedE2eClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' §21 e2e **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2ePlanLines`, per-step `e2e <id>:`) в `releaseSmoke:`;'
    : ' §21 e2e **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2eAppendixLines`, per-step `e2e <id>:`) in `releaseSmoke:`;'
}

/** Getting-started Help — Support ZIP `terminalHints:` + logging/about hubs (§8). */
export function formatPackagedE2eHelpWorkflowCrosslinksGettingStartedTerminalHintsClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' Support ZIP также включает `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md);'
    : ' Support ZIP also includes `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md);'
}

/** Getting-started Help — §19 signing roadmaps (sync with `release-code-signing-roadmap.ts`). */
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

/** Getting-started Help — full packaged smoke list bullet (`check:help-workflow-smoke-crosslinks`). */
export function formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeLead(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedE2eClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedTerminalHintsClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale)
  )
}

/** Knowledge hub — workflow + terminal hints dev guards (§13/§15). */
export function formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubDevClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const partition = formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
  return `Dev: \`npm run check:help-workflow-smoke-crosslinks\` (${countSnippet}; ${partition}), \`npm run check:help-terminal-hints-docs\`.${formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale)}`
}

/** Knowledge hub Help — §21 packaged smoke section lead. */
export function formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeLead(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'Статьи workflow (редактор, загрузки, ffprobe, планировщик) ссылаются на [packaged-windows-smoke.md](packaged-windows-smoke.md) и соседние для Linux/macOS.'
    : 'Workflow articles (editor, downloads, ffprobe, planner) link to [packaged-windows-smoke.md](../packaged-windows-smoke.md) and Linux/macOS siblings.'
}

/** Knowledge hub Help — `releaseSmoke:` + `terminalHints:` hub links. */
export function formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubTerminalHintsClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? ' В Support ZIP `releaseSmoke:` — layout win/linux/macos и per-step `e2e <id>:`; dev-блок `terminalHints:` (§8, 24 статьи Help) — [logging-and-diagnostics.md](logging-and-diagnostics.md), [about-support-logs.md](about-support-logs.md).'
    : ' Support ZIP `releaseSmoke:` includes win/linux/macos layout and per-step `e2e <id>:`; dev block `terminalHints:` (§8, 24 Help articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md), [about-support-logs.md](about-support-logs.md).'
}

/** Knowledge hub Help — full §21 packaged smoke paragraph (inject Playwright UI hint from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  knowledgePlaywrightUiHintSuffix: string
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeLead(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubTerminalHintsClause(locale) +
    ' ' +
    formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubDevClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    '.' +
    knowledgePlaywrightUiHintSuffix
  )
}

/** ffmpeg-terminal-hints Help — packaged smoke crosslinks lead. */
export function formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeLead(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'Packaged smoke bundled ffprobe/ffmpeg/ytdlp — [tools-terminal-inspector.md](tools-terminal-inspector.md), [packaged-windows-smoke.md](packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` в `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md)'
    : 'Packaged smoke bundled ffprobe/ffmpeg/ytdlp — [tools-terminal-inspector.md](tools-terminal-inspector.md), [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` in `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md)'
}

/** ffmpeg-terminal-hints Help — full §21 workflow + UI hints paragraph (inject from `packaged-gui-e2e-playwright-meta`). */
export function formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale,
  ffmpegPlaywrightUiHintSuffix: string
): string {
  return (
    formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeLead(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalWorkflowClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale) +
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale) +
    '.' +
    ffmpegPlaywrightUiHintSuffix
  )
}

/** ffmpeg-terminal-hints — §21 workflow count + partition + §8 terminal guard (not `HelpCrosslinksCountTail`). */
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

/** Packaged smoke Help — workflow crosslinks partition note (§19/§21). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return locale === 'ru'
    ? 'partition: tail 42 + ffmpeg + knowledge, FAQ вне 44'
    : 'partition: tail 42 + ffmpeg + knowledge, FAQ outside 44'
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

/** All 44 workflow Help paths — strict packaged-smoke formatter locks (`help-workflow-smoke-crosslinks-strict.mjs`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EDITOR_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_SETTINGS_RAIL_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_DRAGDROP_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_URL_COMBO_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EXTRACT_FRAMES_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_SOCIAL_PRESETS_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_ADVANCED_FIELDS_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ENGINES_UPDATE_PATHS_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_SESSION_QUEUES_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_RAIL_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_HISTORY_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_APPEARANCE_THEME_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKSPACE_TABS_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KEYBOARD_SHORTCUTS_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROBE_INSPECTOR_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_WORKFLOW_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WINDOWS_SHELL_INTEGRATION_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HARDWARE_ENCODING_HELP_PATHS
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT =
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS.length

/** README/AGENTS — strict packaged-smoke formatter registry vs workflow article count. */
export function formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause(): string {
  return `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT}/${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} strict packaged-smoke formatters (\`STRICT_PACKAGED_SMOKE_HELP_PATHS\`)`
}
