/**
 * §8 — канон shard-файлов `terminal-contract-hints-*` (leaf: Node ESM из scripts/*.mjs).
 */

/** Registry guard: `package.json` scripts ↔ §8 terminal guards (`check:quiet` order). */
export const TERMINAL_CONTRACT_HINTS_GUARD_REGISTRY_NPM_SCRIPT =
  'check:terminal-hints-guards-package-json' as const

/** npm guard в `check:quiet` (shard paths + hint counts). */
export const TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT =
  'check:terminal-contract-hints-shards' as const

/** Locales guard: `locales/{ru,en}/settings.json` (§8 terminal hints dev line). */
export const TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_GUARD_NPM_SCRIPT =
  'check:terminal-hints-locale' as const

/** §18 Support ZIP — `diagnostics.txt` block ↔ meta formatters. */
export const TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT =
  'check:support-bundle-terminal-hints' as const

/** Heading line in Support ZIP `diagnostics.txt`. */
export const TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_SECTION_HEADING = 'terminalHints:' as const

/** Sources wired by `check:support-bundle-terminal-hints`. */
export const TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_SOURCE_PATHS = [
  'src/main/support-bundle.ts',
  'src/main/main-diagnostics-service.ts'
] as const

/** Renderer UI — Support ZIP aria hints (`aboutSupportZipDiagnosticsSectionsHint`). */
export const TERMINAL_CONTRACT_HINTS_SUPPORT_ZIP_UI_SOURCE_PATHS = [
  'src/renderer/src/components/AboutDialog.tsx',
  'src/renderer/src/components/shell/app-settings-dialog-panes.tsx'
] as const

/** §8 terminal guards in `check:quiet` (registry → shards → locale → Support ZIP). */
export const TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS = [
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT
] as const

/** `run-quiet-check.mjs` step labels (registry → shards → locale → Support ZIP). */
export const TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS = [
  'terminal-hints-guards-package-json',
  'terminal-contract-hints-shards',
  'terminal-hints-locale',
  'support-bundle-terminal-hints'
] as const

/** Help §8 terminal hints doc guard. */
export const TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT =
  'check:help-terminal-hints-docs' as const

/** locales/{ru,en}/settings.json key for Settings → Dependencies. */
export const TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY =
  'appSettingsTerminalHintsGuardHint' as const

/** locales/{ru,en}/about.json — Support ZIP diagnostics.txt sections (About aria). */
export const TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_ZIP_LOCALE_KEY =
  'aboutSupportZipDiagnosticsSectionsHint' as const

export type TerminalContractHintsLocale = 'en' | 'ru'

/** Leaf module id (Help, diagnostics). */
export const TERMINAL_CONTRACT_HINTS_META_MODULE = 'terminal-contract-hints-meta' as const

/** Dev engines README — terminal guards block in check:quiet. */
export const TERMINAL_CONTRACT_HINTS_BIN_README_PATH = 'bin/README.md' as const

/** Required substrings in bin/README.md (terminal §8 guards line). */
export const TERMINAL_CONTRACT_HINTS_BIN_README_REQUIRED_SNIPPETS = [
  TERMINAL_CONTRACT_HINTS_GUARD_REGISTRY_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_GUARD_NPM_SCRIPT
] as const

/** Help §18 about/support — releaseSmoke dev line cites §8 terminal guards. */
export const TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS = [
  'Help/about-support-logs.md',
  'Help/en/about-support-logs.md'
] as const

/** Required substrings in about-support-logs (diagnostics ZIP / dev guards). */
export const TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_REQUIRED_SNIPPETS = [
  'terminalHints:',
  TERMINAL_CONTRACT_HINTS_META_MODULE,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT,
  'logging-and-diagnostics.md'
] as const

/** Help §18 logging hub — diagnostics.txt blocks (owner/release/terminal). */
export const TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS = [
  'Help/logging-and-diagnostics.md',
  'Help/en/logging-and-diagnostics.md'
] as const

/** Help §15 workflow hubs — Support ZIP crosslinks (getting-started, probe). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS = [
  'Help/getting-started.md',
  'Help/en/getting-started.md',
  'Help/probe-and-inspector-basics.md',
  'Help/en/probe-and-inspector-basics.md'
] as const

/** Help §6/§15 downloads workflow — Support ZIP crosslinks. */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS = [
  'Help/downloads-workflow.md',
  'Help/en/downloads-workflow.md'
] as const

/** Help §5 theme/HiDPI — Support ZIP crosslinks (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_APPEARANCE_HELP_PATHS = [
  'Help/appearance-language-theme.md',
  'Help/en/appearance-language-theme.md'
] as const

/** Help §18 about/support — Support ZIP crosslinks anchor (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_ABOUT_HELP_PATHS = [
  'Help/about-support-logs.md',
  'Help/en/about-support-logs.md'
] as const

/** Help §10 planner — Support ZIP crosslinks anchor (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_PLANNER_HELP_PATHS = [
  'Help/workflows-planner-scenarios.md',
  'Help/en/workflows-planner-scenarios.md'
] as const

/** Help §13 knowledge hub — Support ZIP crosslinks (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_KNOWLEDGE_HELP_PATHS = [
  'Help/knowledge-base-howto.md',
  'Help/en/knowledge-base-howto.md'
] as const

/** Help §10 editor workflow — Support ZIP crosslinks (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_EDITOR_HELP_PATHS = [
  'Help/editor-workflow.md',
  'Help/en/editor-workflow.md'
] as const

/** Help §16 HW encoding — Support ZIP crosslinks (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_HW_ENCODING_HELP_PATHS = [
  'Help/hardware-encoding.md',
  'Help/en/hardware-encoding.md'
] as const

/** Help §6–§14 workflow — `HelpCrosslinksCountTail` (session…windows-shell). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_MISC_TAIL_HELP_PATHS = [
  'Help/session-and-queues.md',
  'Help/en/session-and-queues.md',
  'Help/workspace-tabs.md',
  'Help/en/workspace-tabs.md',
  'Help/keyboard-shortcuts.md',
  'Help/en/keyboard-shortcuts.md',
  'Help/ffmpeg-rail-presets.md',
  'Help/en/ffmpeg-rail-presets.md',
  'Help/extract-frames.md',
  'Help/en/extract-frames.md',
  'Help/processing-social-presets.md',
  'Help/en/processing-social-presets.md',
  'Help/processing-history.md',
  'Help/en/processing-history.md',
  'Help/processing-advanced-fields.md',
  'Help/en/processing-advanced-fields.md',
  'Help/processing-url-combo.md',
  'Help/en/processing-url-combo.md',
  'Help/downloads-settings-rail.md',
  'Help/en/downloads-settings-rail.md',
  'Help/downloads-dragdrop.md',
  'Help/en/downloads-dragdrop.md',
  'Help/windows-shell-integration.md',
  'Help/en/windows-shell-integration.md',
  'Help/engines-update-paths.md',
  'Help/en/engines-update-paths.md'
] as const

/** Help §16/§19 owner manual smoke — Support ZIP crosslinks (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS = [
  'Help/owner-manual-smoke.md',
  'Help/en/owner-manual-smoke.md'
] as const

/** Help FAQ — Support ZIP / terminal crosslinks (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS = [
  'Help/faq-troubleshooting.md',
  'Help/en/faq-troubleshooting.md'
] as const

/** Help workflow — `formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail` (42 RU+EN; без ffmpeg-terminal-hints). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS = [
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_APPEARANCE_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_EDITOR_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_HW_ENCODING_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_MISC_TAIL_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS,
  ...TERMINAL_CONTRACT_HINTS_WORKFLOW_PLANNER_HELP_PATHS
] as const

/** Help §19 packaged smoke — Support ZIP crosslinks (win/linux/macos). */
export const TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS = [
  'Help/packaged-windows-smoke.md',
  'Help/en/packaged-windows-smoke.md',
  'Help/packaged-linux-smoke.md',
  'Help/en/packaged-linux-smoke.md',
  'Help/packaged-macos-smoke.md',
  'Help/en/packaged-macos-smoke.md'
] as const

/** Required substrings in logging-and-diagnostics (Support ZIP sections). */
export const TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_REQUIRED_SNIPPETS = [
  'terminalHints:',
  TERMINAL_CONTRACT_HINTS_META_MODULE,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  'ownerManualSmoke:',
  'releaseSmoke:'
] as const

/** Required substrings in getting-started / probe / downloads / FAQ (user «См. также» footer). */
export const TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md'
] as const

/** Части terminal-contract-hints-downloads-NN.ts. */
export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT = 20

/** Части terminal-contract-hints-preview-media-NN.ts. */
export const TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT = 15

/** Snapshot; bump при добавлении/удалении подсказок (Vitest + shards guard). */
export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT = 1056

/** Snapshot; bump при добавлении/удалении подсказок (Vitest + shards guard). */
export const TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT = 833

/** Минимум для регрессии «базового объёма» (≤ snapshot). */
export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT_FLOOR = 805

export const TERMINAL_CONTRACT_HINTS_SHARD_PART_COUNTS = {
  downloads: TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT,
  previewMedia: TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT
} as const

export const TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT =
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT + TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT

/** Help §8 terminal hints (RU+EN). */
export const TERMINAL_CONTRACT_HINTS_HELP_PATHS = [
  'Help/ffmpeg-terminal-hints.md',
  'Help/en/ffmpeg-terminal-hints.md'
] as const

/** Help §8 hub (RU+EN) — ссылка на ffmpeg-terminal-hints + guard. */
export const TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS = [
  'Help/tools-terminal-inspector.md',
  'Help/en/tools-terminal-inspector.md'
] as const

/** Required substrings in ffmpeg-terminal-hints (§8 dev section + diagnostics link). */
export const TERMINAL_CONTRACT_HINTS_HELP_REQUIRED_SNIPPETS = [
  TERMINAL_CONTRACT_HINTS_META_MODULE,
  'terminal-contract-hints-',
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  'locales:terminal-summaries-ru',
  'terminal-contract-scenarios.test.ts',
  'logging-and-diagnostics.md'
] as const

/** Required substrings in tools-terminal-inspector Help hub. */
export const TERMINAL_CONTRACT_HINTS_TOOLS_HELP_REQUIRED_SNIPPETS = [
  TERMINAL_CONTRACT_HINTS_META_MODULE,
  'terminal-contract-hints-',
  'ffmpeg-terminal-hints.md',
  'locales:terminal-summaries-ru',
  'logging-and-diagnostics.md',
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md'
] as const

/** §8 ffmpeg-terminal-hints Help — Support ZIP terminalHints line. */
export function formatTerminalContractHintsFfmpegHelpSupportZipLine(
  locale: TerminalContractHintsLocale
): string {
  const helpCountLabel =
    locale === 'ru'
      ? `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} статей`
      : `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} articles`
  const runtimeNote = locale === 'ru' ? 'не runtime' : 'not runtime'
  const inDiagnostics = locale === 'ru' ? 'в' : 'in'
  const seeAlso =
    locale === 'ru'
      ? 'см. [logging-and-diagnostics.md](logging-and-diagnostics.md), [about-support-logs.md](about-support-logs.md)'
      : 'see [logging-and-diagnostics.md](logging-and-diagnostics.md), [about-support-logs.md](about-support-logs.md)'
  return `Support ZIP **\`terminalHints:\`** ${inDiagnostics} \`diagnostics.txt\` (dev guards, ${runtimeNote}) — \`npm run check:support-bundle-terminal-hints\`, \`check:help-terminal-hints-docs\` (${helpCountLabel}); ${seeAlso}.`
}

/** §8 tools-terminal-inspector Help — packaged smoke / Support ZIP tail. */
export function formatTerminalContractHintsToolsHelpPackagedSmokeLine(
  locale: TerminalContractHintsLocale
): string {
  const helpCountLabel =
    locale === 'ru'
      ? `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} статей`
      : `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} articles`
  const crosslinks =
    '[owner-manual-smoke.md](owner-manual-smoke.md), [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md)'
  if (locale === 'ru') {
    return `Полный owner bundle, per-step \`e2e <id>:\` в Support ZIP \`releaseSmoke:\` и dev-блок \`terminalHints:\` (§8 guards) — ${crosslinks}; \`npm run check:support-bundle-terminal-hints\`, \`check:help-terminal-hints-docs\` (${helpCountLabel}).`
  }
  return `Full owner bundle, per-step \`e2e <id>:\` in Support ZIP \`releaseSmoke:\`, and dev block \`terminalHints:\` (§8 guards) — ${crosslinks}; \`npm run check:support-bundle-terminal-hints\`, \`check:help-terminal-hints-docs\` (${helpCountLabel}).`
}

/** Help files covered by `check:help-terminal-hints-docs` (excluding bin/README). */
export const TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT =
  TERMINAL_CONTRACT_HINTS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS.length

export function formatTerminalContractHintsDownloadsShardBasename(partIndex: number): string {
  return `terminal-contract-hints-downloads-${String(partIndex).padStart(2, '0')}.ts`
}

export function formatTerminalContractHintsPreviewMediaShardBasename(partIndex: number): string {
  return `terminal-contract-hints-preview-media-${String(partIndex).padStart(2, '0')}.ts`
}

/** EN count snippet for Help / diagnostics. */
export function formatTerminalContractHintsShardCountEnSnippet(): string {
  return `${TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT} downloads + ${TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT} preview shards (${TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT} files)`
}

/** RU count snippet for Help / diagnostics. */
export function formatTerminalContractHintsShardCountRuSnippet(): string {
  return `${TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT} загрузки + ${TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT} превью (${TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT} файлов)`
}

/** Platform-packaging / §8 diagnostics line. */
export function formatTerminalContractHintsDiagnosticLine(): string {
  return `npm run ${TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT} (${formatTerminalContractHintsShardCountEnSnippet()}; ${TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT}+${TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT} hints)`
}

/** `aboutSupportZipDiagnosticsSectionsHint` in locales about.json. */
export function formatTerminalContractHintsAboutSupportZipSectionsHint(
  locale: TerminalContractHintsLocale
): string {
  const helpCountLabel =
    locale === 'ru'
      ? `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} статей Help`
      : `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} Help articles`
  return locale === 'ru'
    ? `В diagnostics.txt: ownerManualSmoke, releaseSmoke, terminalHints (§8, ${helpCountLabel}).`
    : `diagnostics.txt: ownerManualSmoke, releaseSmoke, terminalHints (§8, ${helpCountLabel}).`
}

/** §18 about-support-logs Help — `terminalHints:` bullet (synced Help count). */
export function formatTerminalContractHintsAboutSupportZipTerminalHintsBullet(
  locale: TerminalContractHintsLocale
): string {
  const helpCountLabel =
    locale === 'ru'
      ? `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} статей`
      : `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} articles`
  const guardsTail =
    locale === 'ru' ? 'и прочие guards в `check:quiet`' : 'and other `check:quiet` guards'
  const seeAlso =
    locale === 'ru'
      ? 'см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md)'
      : 'see [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) and [logging-and-diagnostics.md](logging-and-diagnostics.md)'
  return `- **\`terminalHints:\`** — dev §8 (\`${TERMINAL_CONTRACT_HINTS_META_MODULE}\`, 35 shards / 1056+833 hints, \`check:terminal-contract-hints-shards\`, \`check:help-terminal-hints-docs\` (${helpCountLabel}), \`check:support-bundle-terminal-hints\` ${guardsTail}); ${seeAlso}.`
}

/** §18 logging-and-diagnostics Help — §8 terminal guards line (synced count). */
export function formatTerminalContractHintsLoggingHelpDevGuardsLine(
  locale: TerminalContractHintsLocale
): string {
  const helpCountLabel =
    locale === 'ru'
      ? `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} статей`
      : `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} articles`
  const settingsTail = locale === 'ru' ? 'Настройки → Зависимости' : 'Settings → Dependencies'
  return `§8 terminal — \`check:terminal-contract-hints-shards\` (35 shards, 1056+833 hints), \`check:help-terminal-hints-docs\` (${helpCountLabel}), \`check:support-bundle-terminal-hints\`, \`check:terminal-hints-locale\` (${settingsTail}).`
}

/** Tail of `appSettingsTerminalHintsGuardHint` in locales settings.json. */
export function formatTerminalContractHintsSettingsHelpClause(
  locale: TerminalContractHintsLocale
): string {
  const shardSnippet =
    locale === 'ru'
      ? formatTerminalContractHintsShardCountRuSnippet()
      : formatTerminalContractHintsShardCountEnSnippet()
  const helpCountLabel =
    locale === 'ru'
      ? `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} статей`
      : `${TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT} articles`
  return `Help: ${TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT} (${helpCountLabel}; ${shardSnippet}); Support ZIP: ${TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT}.`
}

/** §18 Support ZIP diagnostics.txt — terminalHints block (dev guards, not runtime). */
export function formatTerminalContractHintsSupportZipLines(): string[] {
  return [
    `meta: ${TERMINAL_CONTRACT_HINTS_META_MODULE}`,
    formatTerminalContractHintsDiagnosticLine(),
    `npm run ${TERMINAL_CONTRACT_HINTS_GUARD_REGISTRY_NPM_SCRIPT}`,
    `npm run ${TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT}`,
    `npm run ${TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT}`,
    `npm run ${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_GUARD_NPM_SCRIPT}`,
    `settings: ${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY}`
  ]
}

/** Markdown bullet for bin/README.md (§8 terminal guards in check:quiet). */
export function formatTerminalContractHintsBinReadmeGuardsLine(): string {
  const docGuards = [
    TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
    ...TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS
  ].map((s) => `\`npm run ${s}\``)
  return `- Terminal §8 guards (\`check:quiet\`, канон \`${TERMINAL_CONTRACT_HINTS_META_MODULE}\`): registry \`npm run ${TERMINAL_CONTRACT_HINTS_GUARD_REGISTRY_NPM_SCRIPT}\`, Help ${docGuards.slice(0, 1)}, then ${docGuards.slice(1).join(', ')}.`
}
