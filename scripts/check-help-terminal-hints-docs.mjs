/**
 * §8/§15 Help — ffmpeg-terminal-hints + tools-terminal-inspector (meta snippets).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_ABOUT_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_KNOWLEDGE_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_BIN_README_PATH,
  TERMINAL_CONTRACT_HINTS_BIN_README_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_TOOLS_HELP_REQUIRED_SNIPPETS,
  formatTerminalContractHintsBinReadmeGuardsLine,
  formatTerminalContractHintsAboutSupportZipTerminalHintsBullet,
  formatTerminalContractHintsFfmpegHelpSupportZipLine,
  formatTerminalContractHintsToolsHelpPackagedSmokeLine,
  formatTerminalContractHintsLoggingHelpDevGuardsLine,
  formatTerminalContractHintsShardCountEnSnippet,
  formatTerminalContractHintsShardCountRuSnippet
} from '../src/shared/terminal-contract-hints-meta.ts'
import {
  formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause,
  formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksLoggingClause
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import {
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix
} from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { checkHelpSmokeDocFiles, checkHelpSmokeDocSnippet } from './lib/help-smoke-docs-check.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'

const LOG_PREFIX = 'check:help-terminal-hints-docs'

let failed = false
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_HELP_REQUIRED_SNIPPETS,
    'ffmpeg-terminal-hints'
  ) || failed

for (const rel of TERMINAL_CONTRACT_HINTS_HELP_PATHS) {
  const countSnippet = rel.includes('/en/')
    ? formatTerminalContractHintsShardCountEnSnippet()
    : formatTerminalContractHintsShardCountRuSnippet()
  failed =
    checkHelpSmokeDocSnippet(REPO_ROOT, LOG_PREFIX, rel, countSnippet, 'shard-count') || failed
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatTerminalContractHintsFfmpegHelpSupportZipLine(locale),
      'ffmpeg-support-zip'
    ) || failed
}

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_TOOLS_HELP_REQUIRED_SNIPPETS,
    'tools-terminal-inspector'
  ) || failed

for (const rel of TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatTerminalContractHintsToolsHelpPackagedSmokeLine(locale),
      'tools-packaged-smoke'
    ) || failed
}

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_REQUIRED_SNIPPETS,
    'about-support-logs'
  ) || failed

for (const rel of TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatTerminalContractHintsAboutSupportZipTerminalHintsBullet(locale),
      'about-terminal-hints-bullet'
    ) || failed
}

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_REQUIRED_SNIPPETS,
    'logging-and-diagnostics'
  ) || failed

for (const rel of TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksLoggingClause(locale),
      'logging-packaged-workflow'
    ) || failed
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatTerminalContractHintsLoggingHelpDevGuardsLine(locale),
      'logging-dev-guards'
    ) || failed
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale),
      'logging-playwright-ui-hint'
    ) || failed
}

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
    'workflow-hub'
  ) || failed

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
    'downloads-workflow'
  ) || failed

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
    'packaged-smoke'
  ) || failed

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
    'faq-troubleshooting'
  ) || failed

for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale),
      'help-crosslinks-count'
    ) || failed
}

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
    'owner-manual-smoke'
  ) || failed

for (const rel of TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause(locale),
      'owner-workflow-crosslinks'
    ) || failed
}

for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_ABOUT_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevClause(locale),
      'about-release-smoke-dev'
    ) || failed
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(locale),
      'about-playwright-ui-hint'
    ) || failed
}

for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_KNOWLEDGE_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubDevClause(locale),
      'knowledge-hub-dev'
    ) || failed
}

const binReadmePath = path.join(REPO_ROOT, TERMINAL_CONTRACT_HINTS_BIN_README_PATH)
const binReadmeText = fs.readFileSync(binReadmePath, 'utf8')
const binReadmeGuardsLine = formatTerminalContractHintsBinReadmeGuardsLine()
if (!binReadmeText.includes(binReadmeGuardsLine)) {
  failed = true
  console.error(
    `[${LOG_PREFIX}] ${TERMINAL_CONTRACT_HINTS_BIN_README_PATH} missing guards line: ${binReadmeGuardsLine}`
  )
}
for (const snippet of TERMINAL_CONTRACT_HINTS_BIN_README_REQUIRED_SNIPPETS) {
  if (!binReadmeText.includes(snippet)) {
    failed = true
    console.error(`[${LOG_PREFIX}] ${TERMINAL_CONTRACT_HINTS_BIN_README_PATH} missing: ${snippet}`)
  }
}

if (failed) {
  process.exit(1)
}

const fileCount =
  TERMINAL_CONTRACT_HINTS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS.length +
  TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS.length

console.log(
  `[check:help-terminal-hints-docs] OK (${fileCount} Help files + ${TERMINAL_CONTRACT_HINTS_BIN_README_PATH}; meta shard counts)`
)
