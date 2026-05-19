/**
 * §21 — канон списка Help workflow crosslinks (`check:help-workflow-smoke-crosslinks`).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs).
 */

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
  'Help/en/getting-started.md'
] as const

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT =
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length

/** Sync с Help/locales (`34 articles` / `34 статьи`). */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} articles`

export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET = `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} статьи`

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

/** Packaged smoke Help (windows) — dev line cites workflow crosslinks guard. */
export const PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS = [
  'Help/packaged-windows-smoke.md',
  'Help/en/packaged-windows-smoke.md'
] as const
