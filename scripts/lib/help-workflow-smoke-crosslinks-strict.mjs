/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Workflow Help — user crosslink footer only (no per-topic dev formatters).
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter
} from './help-workflow-crosslinks-meta.mjs'
import { checkHelpSmokeDocSnippet } from './help-smoke-docs-check.mjs'

/** @returns {boolean} failed */
export function runHelpWorkflowSmokeCrosslinksStrictPackagedChecks(repoRoot, logPrefix, failed) {
  let out = failed
  for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS) {
    const locale = rel.includes('/en/') ? 'en' : 'ru'
    out =
      checkHelpSmokeDocSnippet(
        repoRoot,
        logPrefix,
        rel,
        formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter(locale),
        'user-footer'
      ) || out
  }
  return out
}
