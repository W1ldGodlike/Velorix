/**
 * §15 Help — about/logging/planner cross-link §21 e2e registry (без Help owner-hardware-checklist).
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_REQUIRED_SNIPPETS,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter
} from '../lib/help-workflow-crosslinks-meta.mjs'
import { checkHelpSmokeDocFiles, checkHelpSmokeDocSnippet } from '../lib/help-smoke-docs-check.mjs'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG_PREFIX = 'check:help-owner-hardware-checklist-docs'

let failed = false
if (
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length !==
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS.length +
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS.length
) {
  console.error(
    '[check:help-owner-hardware-checklist-docs] COUNT_ANCHOR_PATHS out of sync with RU/EN anchor lists'
  )
  process.exit(1)
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS) {
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      pickPackagedE2eHelpWorkflowCrosslinksCountSnippet(rel),
      'anchor-count'
    ) || failed
}
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_REQUIRED_SNIPPETS,
    'about'
  ) || failed
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_REQUIRED_SNIPPETS,
    'logging'
  ) || failed
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_REQUIRED_SNIPPETS,
    'planner'
  ) || failed
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter(locale),
      'planner-see-also-footer'
    ) || failed
}

if (failed) {
  process.exit(1)
}
const fileCount = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS.length
console.log(
  `[check:help-owner-hardware-checklist-docs] OK (${fileCount} files; about/logging/planner + crosslinks count anchors)`
)
