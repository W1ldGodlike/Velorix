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
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
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

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-workflow-smoke-crosslinks] OK (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS.length} packaged; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length} anchors; bin/README)`
)
