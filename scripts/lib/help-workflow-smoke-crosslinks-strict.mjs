/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §21 strict packaged-smoke snippet checks for `check:help-workflow-smoke-crosslinks`.
 * Path union — `PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS` (44 workflow).
 */
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_APPEARANCE_THEME_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_DRAGDROP_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_SETTINGS_RAIL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_WORKFLOW_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EDITOR_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ENGINES_UPDATE_PATHS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EXTRACT_FRAMES_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_RAIL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HARDWARE_ENCODING_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KEYBOARD_SHORTCUTS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_ADVANCED_FIELDS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_HISTORY_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_SOCIAL_PRESETS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_URL_COMBO_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROBE_INSPECTOR_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_SESSION_QUEUES_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WINDOWS_SHELL_INTEGRATION_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKSPACE_TABS_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemePackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksDownloadsDragdropPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksDownloadsSettingsRailPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksDownloadsWorkflowPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksEditorWorkflowPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksEnginesUpdatePathsPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksExtractFramesPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksFfmpegRailPresetsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause,
  formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingQuickStartOwnerPackagedClause,
  formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingSeeAlsoTail,
  formatPackagedE2eHelpWorkflowCrosslinksKeyboardShortcutsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingAdvancedFieldsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingHistoryPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingSocialPresetsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingUrlComboPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksProbeInspectorPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksSessionQueuesPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksWindowsShellIntegrationPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksWorkspaceTabsPackagedSmokeSnippet
} from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import {
  formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix
} from '../../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { checkHelpSmokeDocSnippet } from './help-smoke-docs-check.mjs'

/**
 * @param {(locale: 'en' | 'ru') => string} formatForLocale
 * @returns {boolean}
 */
function checkWorkflowHelpSnippet(repoRoot, logPrefix, failed, paths, formatForLocale, label) {
  let out = failed
  for (const rel of paths) {
    const locale = rel.includes('/en/') ? 'en' : 'ru'
    out = checkHelpSmokeDocSnippet(repoRoot, logPrefix, rel, formatForLocale(locale), label) || out
  }
  return out
}

/**
 * Strict formatter locks for workflow Help packaged-smoke tails (§21).
 * @returns {boolean}
 */
export function runHelpWorkflowSmokeCrosslinksStrictPackagedChecks(repoRoot, logPrefix, failed) {
  let out = failed
  for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS) {
    const locale = rel.includes('/en/') ? 'en' : 'ru'
    const knowledgeUiHint = formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(locale)
    out =
      checkHelpSmokeDocSnippet(
        repoRoot,
        logPrefix,
        rel,
        formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph(
          locale,
          knowledgeUiHint
        ),
        'knowledge-packaged-smoke-paragraph'
      ) || out
  }
  for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS) {
    const locale = rel.includes('/en/') ? 'en' : 'ru'
    const ffmpegUiHint = formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(locale)
    out =
      checkHelpSmokeDocSnippet(
        repoRoot,
        logPrefix,
        rel,
        formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph(
          locale,
          ffmpegUiHint
        ),
        'ffmpeg-packaged-smoke-paragraph'
      ) || out
  }
  for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS) {
    const locale = rel.includes('/en/') ? 'en' : 'ru'
    const plannerUiHint = formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(locale)
    out =
      checkHelpSmokeDocSnippet(
        repoRoot,
        logPrefix,
        rel,
        formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph(locale, plannerUiHint),
        'planner-diagnostics-paragraph'
      ) || out
  }
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph,
    'getting-started-packaged-smoke-paragraph'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause,
    'getting-started-signing-roadmap-clause'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause,
    'knowledge-signing-roadmap-clause'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause,
    'planner-signing-roadmap-clause'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedSigningRoadmapClause,
    'ffmpeg-signing-roadmap-clause'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EDITOR_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksEditorWorkflowPackagedSmokeParagraph,
    'editor-workflow-packaged-smoke-paragraph'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_SETTINGS_RAIL_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksDownloadsSettingsRailPackagedSmokeSnippet,
    'downloads-settings-rail-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_DRAGDROP_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksDownloadsDragdropPackagedSmokeSnippet,
    'downloads-dragdrop-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_URL_COMBO_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksProcessingUrlComboPackagedSmokeSnippet,
    'processing-url-combo-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EXTRACT_FRAMES_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksExtractFramesPackagedSmokeSnippet,
    'extract-frames-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_SOCIAL_PRESETS_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksProcessingSocialPresetsPackagedSmokeSnippet,
    'processing-social-presets-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_ADVANCED_FIELDS_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksProcessingAdvancedFieldsPackagedSmokeSnippet,
    'processing-advanced-fields-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ENGINES_UPDATE_PATHS_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksEnginesUpdatePathsPackagedSmokeParagraph,
    'engines-update-paths-packaged-smoke-paragraph'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_SESSION_QUEUES_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksSessionQueuesPackagedSmokeSnippet,
    'session-queues-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_RAIL_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksFfmpegRailPresetsPackagedSmokeSnippet,
    'ffmpeg-rail-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_HISTORY_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksProcessingHistoryPackagedSmokeSnippet,
    'processing-history-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_APPEARANCE_THEME_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemePackagedSmokeParagraph,
    'appearance-theme-packaged-smoke-paragraph'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKSPACE_TABS_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksWorkspaceTabsPackagedSmokeSnippet,
    'workspace-tabs-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KEYBOARD_SHORTCUTS_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksKeyboardShortcutsPackagedSmokeSnippet,
    'keyboard-shortcuts-packaged-smoke-snippet'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROBE_INSPECTOR_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksProbeInspectorPackagedSmokeParagraph,
    'probe-inspector-packaged-smoke-paragraph'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_WORKFLOW_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksDownloadsWorkflowPackagedSmokeParagraph,
    'downloads-workflow-packaged-smoke-paragraph'
  )
  out = checkWorkflowHelpSnippet(
    repoRoot,
    logPrefix,
    out,
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WINDOWS_SHELL_INTEGRATION_HELP_PATHS,
    formatPackagedE2eHelpWorkflowCrosslinksWindowsShellIntegrationPackagedSmokeSnippet,
    'windows-shell-integration-packaged-smoke-snippet'
  )
  for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HARDWARE_ENCODING_HELP_PATHS) {
    const locale = rel.includes('/en/') ? 'en' : 'ru'
    out =
      checkHelpSmokeDocSnippet(
        repoRoot,
        logPrefix,
        rel,
        formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingQuickStartOwnerPackagedClause(
          locale
        ),
        'hardware-encoding-quick-start'
      ) || out
    out =
      checkHelpSmokeDocSnippet(
        repoRoot,
        logPrefix,
        rel,
        formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingSeeAlsoTail(locale),
        'hardware-encoding-see-also'
      ) || out
  }
  return out
}
