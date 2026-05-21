/**
 * §15 Help — workflow articles: user crosslinks (owner + packaged smoke).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS
} from '../lib/help-workflow-crosslinks-meta.mjs'
import { checkHelpSmokeDocFiles } from '../lib/help-smoke-docs-check.mjs'
import { runHelpWorkflowSmokeCrosslinksStrictPackagedChecks } from '../lib/help-workflow-smoke-crosslinks-strict.mjs'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG_PREFIX = 'check:help-workflow-smoke-crosslinks'

if (
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length !==
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT
) {
  console.error(
    `[${LOG_PREFIX}] path count ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length} !== ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT}`
  )
  process.exit(1)
}

let failed = checkHelpSmokeDocFiles(
  REPO_ROOT,
  LOG_PREFIX,
  [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS],
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
  'workflow'
)

failed = runHelpWorkflowSmokeCrosslinksStrictPackagedChecks(REPO_ROOT, LOG_PREFIX, failed) || failed

const binReadme = fs.readFileSync(path.join(REPO_ROOT, 'bin/README.md'), 'utf8')
if (!binReadme.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT)) {
  failed = true
  console.error(
    `[${LOG_PREFIX}] bin/README.md missing ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}`
  )
}

if (failed) {
  process.exit(1)
}
console.log(
  `[${LOG_PREFIX}] OK (${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow user crosslinks)`
)
