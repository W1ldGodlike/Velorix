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
import { formatPackagedE2eHelpWorkflowCrosslinksLoggingClause } from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
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

failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS],
    TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
    'owner-manual-smoke'
  ) || failed

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
