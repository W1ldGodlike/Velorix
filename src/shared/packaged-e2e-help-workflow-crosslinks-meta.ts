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

/** Required substrings in each workflow Help article (`check:help-workflow-smoke-crosslinks`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  '§21 e2e',
  'e2e <id>:',
  'releaseSmoke:',
  'terminalHints:',
  'logging-and-diagnostics.md'
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

/** Tail of `appSettingsPackagedE2eRegistryGuardHint` in locales settings.json. */
export function formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return `Help: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT} (${pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)}).`
}

/** Platform-packaging / §21 e2e diagnostics (`Help articles` vs `articles` label). */
export function formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine(
  articlesWord: 'Help articles' | 'articles' = 'Help articles'
): string {
  return `npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT} (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} ${articlesWord} ↔ owner/packaged §21)`
}

/** Required substrings in `bin/README.md` (§21 crosslinks dev line). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_REQUIRED_SNIPPETS = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE,
  'workflow + packaged/owner anchors'
] as const

/** Markdown bullet for `bin/README.md` (sync with guard snippets). */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine(): string {
  return `- Help §21 crosslinks: \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` — канон \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE}\` (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET}: workflow + packaged/owner anchors).`
}

/** bin/README — Help smoke guards block in `check:quiet`. */
export function formatPackagedE2eHelpWorkflowCrosslinksBinReadmeGuardsLine(): string {
  const docGuards = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS.map(
    (s) => `\`npm run ${s}\``
  ).join(', ')
  return `- Help smoke guards (\`check:quiet\`): registry \`npm run ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT}\`, then ${docGuards}.`
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

/** All Help files checked by `check:help-owner-smoke-docs` (same 8 as count anchors). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS
] as const

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
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
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
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_REQUIRED_SNIPPETS = [
  'check:packaged-e2e-scenarios-registry',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  'terminalHints:',
  'check:support-bundle-terminal-hints',
  'check:help-terminal-hints-docs',
  '§21 packaged e2e (CI vs owner)',
  'planned GUI e2e scope'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  'formatPackagedManualSmokeE2eAppendixLines',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
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
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS = [
  'engines:doctor',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH
] as const

/** Parenthetical win packaged Help crosslinks count (`(44 articles)` / `(44 статьи)`). */
export function formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCountParenthetical(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  return `(${pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)})`
}

/** §18 logging-and-diagnostics Help — §21 packaged e2e + workflow crosslinks (synced count). */
export function formatPackagedE2eHelpWorkflowCrosslinksLoggingClause(
  locale: PackagedE2eHelpWorkflowCrosslinksLocale
): string {
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale(locale)
  const quietTail = locale === 'ru' ? 'в `check:quiet`' : 'in `check:quiet`'
  return `\`npm run check:packaged-e2e-scenarios-registry\`, \`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}\` (${countSnippet}, ${quietTail})`
}
