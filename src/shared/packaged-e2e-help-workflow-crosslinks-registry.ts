/**
 * §21 — Help workflow crosslinks registry (paths, guards, required snippets).
 * Leaf data module — no imports. Formatters: `packaged-e2e-help-workflow-crosslinks-formatters.ts`.
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

/** Required user crosslinks in each workflow Help article (`check:help-workflow-smoke-crosslinks`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET =
  'owner-manual-smoke.md' as const

/** Required user crosslinks in each workflow Help article (`check:help-workflow-smoke-crosslinks`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md'
] as const

/** RU+EN workflow/export/downloads/terminal/theme/HW/shell/getting-started. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS = [
  'Help/ru/downloads-workflow.md',
  'Help/ru/ffmpeg-rail-presets.md',
  'Help/ru/probe-and-inspector-basics.md',
  'Help/ru/workflows-planner-scenarios.md',
  'Help/en/downloads-workflow.md',
  'Help/en/ffmpeg-rail-presets.md',
  'Help/en/probe-and-inspector-basics.md',
  'Help/en/workflows-planner-scenarios.md',
  'Help/ru/knowledge-base-howto.md',
  'Help/en/knowledge-base-howto.md',
  'Help/ru/extract-frames.md',
  'Help/ru/processing-social-presets.md',
  'Help/en/extract-frames.md',
  'Help/en/processing-social-presets.md',
  'Help/ru/processing-history.md',
  'Help/ru/downloads-settings-rail.md',
  'Help/en/processing-history.md',
  'Help/en/downloads-settings-rail.md',
  'Help/ru/downloads-dragdrop.md',
  'Help/ru/processing-url-combo.md',
  'Help/ru/ffmpeg-terminal-hints.md',
  'Help/en/downloads-dragdrop.md',
  'Help/en/processing-url-combo.md',
  'Help/en/ffmpeg-terminal-hints.md',
  'Help/ru/processing-advanced-fields.md',
  'Help/en/processing-advanced-fields.md',
  'Help/ru/appearance-language-theme.md',
  'Help/en/appearance-language-theme.md',
  'Help/ru/hardware-encoding.md',
  'Help/en/hardware-encoding.md',
  'Help/ru/windows-shell-integration.md',
  'Help/en/windows-shell-integration.md',
  'Help/ru/getting-started.md',
  'Help/en/getting-started.md',
  'Help/ru/editor-workflow.md',
  'Help/en/editor-workflow.md',
  'Help/ru/session-and-queues.md',
  'Help/en/session-and-queues.md',
  'Help/ru/workspace-tabs.md',
  'Help/en/workspace-tabs.md',
  'Help/ru/keyboard-shortcuts.md',
  'Help/en/keyboard-shortcuts.md',
  'Help/ru/engines-update-paths.md',
  'Help/en/engines-update-paths.md'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT =
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length

/** Workflow Help without `HelpCrosslinksCountTail` (§8 ffmpeg-terminal-hints, 24 articles guard). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS = [
  'Help/ru/ffmpeg-terminal-hints.md',
  'Help/en/ffmpeg-terminal-hints.md'
] as const

/** FAQ in workflow tail (`HelpCrosslinksCountTail`) but outside 44 workflow crosslinks articles. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS = [
  'Help/ru/faq-troubleshooting.md',
  'Help/en/faq-troubleshooting.md'
] as const

/** Sync с Help/locales (`44 articles` / `44 статьи`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} articles`

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} статьи`

export type PackagedE2eHelpWorkflowCrosslinksLocale = 'en' | 'ru'

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET =
  'user footer (owner-manual-smoke + packaged-windows-smoke)' as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_NPM_SCRIPT =
  'test:e2e:gui' as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PLAYWRIGHT_DEFERRED_GUARD =
  'check:packaged-gui-e2e-playwright-deferred' as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT = 8 as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE =
  'tests/e2e/gui/planned-gui-e2e-steps.ts' as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS =
  'PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID' as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT = 2 as const
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
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS = [
  'Help/ru/owner-manual-smoke.md',
  'Help/ru/about-support-logs.md',
  'Help/ru/logging-and-diagnostics.md',
  'Help/ru/workflows-planner-scenarios.md'
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS = [
  'Help/en/owner-manual-smoke.md',
  'Help/en/about-support-logs.md',
  'Help/en/logging-and-diagnostics.md',
  'Help/en/workflows-planner-scenarios.md'
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS = [
  'Help/ru/packaged-windows-smoke.md',
  'Help/en/packaged-windows-smoke.md'
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS = [
  'Help/ru/packaged-linux-smoke.md',
  'Help/ru/packaged-macos-smoke.md',
  'Help/en/packaged-linux-smoke.md',
  'Help/en/packaged-macos-smoke.md'
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS
] as const
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
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS = [
  'Help/ru/knowledge-base-howto.md',
  'Help/en/knowledge-base-howto.md'
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS
] as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_SNIPPET =
  'fix:esm-shim' as const
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LINUX_BUILD_ESM_SHIM_META_PATH =
  'electron-vite-build-meta.ts' as const
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
  'Velorix.app',
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
  'pack:dir'
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

/** All 44 workflow Help paths — user footer locks (`help-workflow-smoke-crosslinks-strict.mjs`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS =
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT =
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS.length
