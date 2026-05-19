/**
 * §15 Help — packaged smoke articles must cross-link owner bundle and parity guard.
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause,
  formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { checkHelpSmokeDocFiles, checkHelpSmokeDocSnippet } from './lib/help-smoke-docs-check.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'

const LOG_PREFIX = 'check:help-packaged-smoke-docs'

const PACKAGED_HELP_FILES = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS]

const MAC_LINUX_HELP_FILES = PACKAGED_HELP_FILES.filter(
  (rel) => rel.includes('linux') || rel.includes('macos')
)

const WINDOWS_PACKAGED_HELP_FILES = PACKAGED_HELP_FILES.filter((rel) => rel.includes('windows'))

let failed = false
if (
  PACKAGED_HELP_FILES.length !==
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS.length +
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS.length
) {
  console.error(
    '[check:help-packaged-smoke-docs] ALL_PACKAGED_HELP_PATHS out of sync with win/mac-linux lists'
  )
  process.exit(1)
}
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    WINDOWS_PACKAGED_HELP_FILES,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS,
    'windows'
  ) || failed
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS,
    'mac/linux-base'
  ) || failed
failed =
  checkHelpSmokeDocFiles(
    REPO_ROOT,
    LOG_PREFIX,
    MAC_LINUX_HELP_FILES,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS,
    'mac/linux'
  ) || failed
for (const rel of [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS
]) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix(locale),
      'crosslinks-quiet-suffix'
    ) || failed
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause(locale),
      'planned-gui-e2e'
    ) || failed
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(locale),
      'playwright-deferred-suffix'
    ) || failed
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-packaged-smoke-docs] OK (${PACKAGED_HELP_FILES.length} files; win ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS.length} + mac/linux ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS.length}/${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS.length} snippets; crosslinks count 44)`
)
