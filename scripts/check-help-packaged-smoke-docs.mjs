/**
 * §15 Help — packaged smoke articles must cross-link owner bundle and parity guard.
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxPlannedGuiFooter,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyAutomationGroupsParenthetical,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix } from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import {
  formatLinuxReleaseCodeSigningRoadmapHelpClause,
  formatMacosReleaseCodeSigningRoadmapHelpClause,
  formatWindowsReleaseCodeSigningRoadmapHelpClause
} from '../src/shared/release-code-signing-roadmap.ts'
import { checkHelpSmokeDocFiles, checkHelpSmokeDocSnippet } from './lib/help-smoke-docs-check.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'

const LOG_PREFIX = 'check:help-packaged-smoke-docs'

const PACKAGED_HELP_FILES = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS]

const MAC_LINUX_HELP_FILES = PACKAGED_HELP_FILES.filter(
  (rel) => rel.includes('linux') || rel.includes('macos')
)

const MACOS_PACKAGED_HELP_FILES = PACKAGED_HELP_FILES.filter((rel) => rel.includes('macos'))
const LINUX_PACKAGED_HELP_FILES = PACKAGED_HELP_FILES.filter((rel) => rel.includes('linux'))
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
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyAutomationGroupsParenthetical(locale),
      'win-copy-automation-groups'
    ) || failed
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const uiHint = formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
  const tail = formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail(
    locale,
    formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause(locale),
    uiHint
  )
  failed =
    checkHelpSmokeDocSnippet(REPO_ROOT, LOG_PREFIX, rel, tail, 'packaged-planned-gui-tail') ||
    failed
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const uiHint = formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
  const tail = formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail(
    locale,
    formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause(locale),
    uiHint
  )
  failed =
    checkHelpSmokeDocSnippet(REPO_ROOT, LOG_PREFIX, rel, tail, 'packaged-planned-gui-tail') ||
    failed
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxPlannedGuiFooter(locale),
      'mac-linux-planned-gui-footer'
    ) || failed
}
for (const rel of MACOS_PACKAGED_HELP_FILES) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatMacosReleaseCodeSigningRoadmapHelpClause(locale),
      'macos-signing-roadmap'
    ) || failed
}
for (const rel of WINDOWS_PACKAGED_HELP_FILES) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatWindowsReleaseCodeSigningRoadmapHelpClause(locale),
      'windows-signing-roadmap'
    ) || failed
}
for (const rel of LINUX_PACKAGED_HELP_FILES) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  failed =
    checkHelpSmokeDocSnippet(
      REPO_ROOT,
      LOG_PREFIX,
      rel,
      formatLinuxReleaseCodeSigningRoadmapHelpClause(locale),
      'linux-signing-roadmap'
    ) || failed
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-packaged-smoke-docs] OK (${PACKAGED_HELP_FILES.length} files; win ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS.length} + mac/linux ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS.length}/${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_EXTRA_SNIPPETS.length} snippets; crosslinks count 44)`
)
