/**
 * §15 Help — workflow articles cross-link owner + packaged smoke (§19/§21).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeGuardsLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePackagedQuietLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowPartitionLine,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ROOT_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_AGENTS_MD_PATH,
  formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine,
  formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubDevClause,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalWorkflowClause
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS } from '../src/shared/terminal-contract-hints-meta.ts'
import { checkHelpSmokeDocFiles, checkHelpSmokeDocSnippet } from './lib/help-smoke-docs-check.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'

const LOG_PREFIX = 'check:help-workflow-smoke-crosslinks'

let failed = false
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
    'workflow'
  ) || failed

if (
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length !==
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT
) {
  console.error(
    `[check:help-workflow-smoke-crosslinks] path count ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length} !== PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT})`
  )
  process.exit(1)
}

const binReadmePath = path.join(REPO_ROOT, PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH)
const binReadmeText = fs.readFileSync(binReadmePath, 'utf8')
if (!binReadmeText.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}`
  )
}
if (!binReadmeText.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing crosslinks count: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET}`
  )
}
const binReadmeDevLine = formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine()
if (!binReadmeText.includes(binReadmeDevLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing dev line: ${binReadmeDevLine}`
  )
}
const binReadmeGuardsLine = formatPackagedE2eHelpWorkflowCrosslinksBinReadmeGuardsLine()
if (!binReadmeText.includes(binReadmeGuardsLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing guards line: ${binReadmeGuardsLine}`
  )
}
const binReadmePartitionLine =
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowPartitionLine()
if (!binReadmeText.includes(binReadmePartitionLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing partition line: ${binReadmePartitionLine}`
  )
}
const binReadmePartitionGuardLine =
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine()
if (!binReadmeText.includes(binReadmePartitionGuardLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing partition guard line: ${binReadmePartitionGuardLine}`
  )
}
const binReadmePackagedQuietLine =
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePackagedQuietLine()
if (!binReadmeText.includes(binReadmePackagedQuietLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing packaged quiet line: ${binReadmePackagedQuietLine}`
  )
}
for (const snippet of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_REQUIRED_SNIPPETS) {
  if (!binReadmeText.includes(snippet)) {
    failed = true
    console.error(
      `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing: ${snippet}`
    )
  }
}

const rootReadmePath = path.join(REPO_ROOT, PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ROOT_README_PATH)
const rootReadmeText = fs.readFileSync(rootReadmePath, 'utf8')
const rootReadmePartitionLine = formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine()
if (!rootReadmeText.includes(rootReadmePartitionLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ROOT_README_PATH} missing partition line: ${rootReadmePartitionLine}`
  )
}
const agentsMdPath = path.join(REPO_ROOT, PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_AGENTS_MD_PATH)
const agentsMdText = fs.readFileSync(agentsMdPath, 'utf8')
const agentsMdHelpLine = formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine()
if (!agentsMdText.includes(agentsMdHelpLine)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_AGENTS_MD_PATH} missing Help §21 line: ${agentsMdHelpLine}`
  )
}

for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS) {
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
      'packaged-guard'
    ) || failed
}

for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS) {
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
      'anchor-guard'
    ) || failed
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      pickPackagedE2eHelpWorkflowCrosslinksCountSnippet(rel),
      'anchor-count'
    ) || failed
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause(locale),
      'anchor-owner-clause'
    ) || failed
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevClause(locale),
      'anchor-about-dev'
    ) || failed
}
for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale),
      'workflow-crosslinks-tail'
    ) || failed
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS) {
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
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalWorkflowClause(locale),
      'ffmpeg-terminal-workflow'
    ) || failed
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-workflow-smoke-crosslinks] OK (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS.length} packaged; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length} anchors; bin/README)`
)
