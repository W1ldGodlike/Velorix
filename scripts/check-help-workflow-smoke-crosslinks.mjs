/**
 * §15 Help — workflow articles cross-link owner + packaged smoke (§19/§21).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  '§21 e2e',
  'e2e <id>:',
  'releaseSmoke:'
]

let failed = false
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  const missing = SNIPPETS.filter((s) => !text.includes(s))
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

const binReadmePath = path.join(REPO_ROOT, 'bin/README.md')
const binReadmeText = fs.readFileSync(binReadmePath, 'utf8')
if (!binReadmeText.includes('check:help-workflow-smoke-crosslinks')) {
  failed = true
  console.error(
    '[check:help-workflow-smoke-crosslinks] bin/README.md missing: check:help-workflow-smoke-crosslinks'
  )
}
if (!binReadmeText.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET)) {
  failed = true
  console.error(
    `[check:help-workflow-smoke-crosslinks] bin/README.md missing crosslinks count: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET}`
  )
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-workflow-smoke-crosslinks] OK (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} files; ${SNIPPETS.length} snippets; bin/README)`
)
