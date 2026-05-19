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
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

let failed = false
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  const missing = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS.filter(
    (s) => !text.includes(s)
  )
  if (missing.length > 0) {
    failed = true
    console.error(`[check:help-workflow-smoke-crosslinks] ${rel} missing: ${missing.join(', ')}`)
  }
}

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
for (const snippet of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_REQUIRED_SNIPPETS) {
  if (!binReadmeText.includes(snippet)) {
    failed = true
    console.error(
      `[check:help-workflow-smoke-crosslinks] ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH} missing: ${snippet}`
    )
  }
}

for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS) {
  const text = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  if (!text.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT)) {
    failed = true
    console.error(
      `[check:help-workflow-smoke-crosslinks] packaged ${rel} missing: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}`
    )
  }
}

for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS) {
  const text = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const countSnippet = pickPackagedE2eHelpWorkflowCrosslinksCountSnippet(rel)
  if (!text.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT)) {
    failed = true
    console.error(
      `[check:help-workflow-smoke-crosslinks] anchor ${rel} missing: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}`
    )
  }
  if (!text.includes(countSnippet)) {
    failed = true
    console.error(
      `[check:help-workflow-smoke-crosslinks] anchor ${rel} missing crosslinks count: ${countSnippet}`
    )
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-workflow-smoke-crosslinks] OK (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS.length} packaged; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length} anchors; bin/README)`
)
