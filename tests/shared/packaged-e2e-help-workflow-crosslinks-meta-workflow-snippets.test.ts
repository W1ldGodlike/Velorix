import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_APPEARANCE_THEME_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_WORKFLOW_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_SETTINGS_RAIL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_DRAGDROP_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_URL_COMBO_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EXTRACT_FRAMES_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_SOCIAL_PRESETS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_ADVANCED_FIELDS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ENGINES_UPDATE_PATHS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WINDOWS_SHELL_INTEGRATION_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HARDWARE_ENCODING_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_RAIL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_HISTORY_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROBE_INSPECTOR_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_SESSION_QUEUES_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKSPACE_TABS_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KEYBOARD_SHORTCUTS_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemePackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksDownloadsWorkflowPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksDownloadsSettingsRailPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksDownloadsDragdropPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingUrlComboPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksExtractFramesPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingSocialPresetsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingAdvancedFieldsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksEnginesUpdatePathsPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksWindowsShellIntegrationPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingQuickStartOwnerPackagedClause,
  formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingSeeAlsoTail,
  formatPackagedE2eHelpWorkflowCrosslinksFfmpegRailPresetsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksKeyboardShortcutsPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksProbeInspectorPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksProcessingHistoryPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksSessionQueuesPackagedSmokeSnippet,
  formatPackagedE2eHelpWorkflowCrosslinksWorkspaceTabsPackagedSmokeSnippet,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT,
  formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine,
  formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine,
  formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause
} from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'
import { formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix } from '../../src/shared/packaged-gui-e2e-playwright-meta'

describe('packaged-e2e-help-workflow-crosslinks-meta workflow snippet locks', () => {
  it('workflow Help packaged smoke snippets match formatters', () => {
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_APPEARANCE_THEME_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksAppearanceThemePackagedSmokeParagraph(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_SETTINGS_RAIL_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksDownloadsSettingsRailPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_SESSION_QUEUES_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksSessionQueuesPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_RAIL_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksFfmpegRailPresetsPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_HISTORY_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksProcessingHistoryPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKSPACE_TABS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksWorkspaceTabsPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KEYBOARD_SHORTCUTS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksKeyboardShortcutsPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROBE_INSPECTOR_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksProbeInspectorPackagedSmokeParagraph(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_WORKFLOW_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksDownloadsWorkflowPackagedSmokeParagraph(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_DOWNLOADS_DRAGDROP_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksDownloadsDragdropPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_URL_COMBO_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksProcessingUrlComboPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EXTRACT_FRAMES_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksExtractFramesPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_SOCIAL_PRESETS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksProcessingSocialPresetsPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PROCESSING_ADVANCED_FIELDS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksProcessingAdvancedFieldsPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ENGINES_UPDATE_PATHS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksEnginesUpdatePathsPackagedSmokeParagraph(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const plannerUiHint = formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(locale)
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph(locale, plannerUiHint)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WINDOWS_SHELL_INTEGRATION_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksWindowsShellIntegrationPackagedSmokeSnippet(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HARDWARE_ENCODING_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingQuickStartOwnerPackagedClause(locale)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksHardwareEncodingSeeAlsoTail(locale)
      )
    }
  })

  it('strict packaged-smoke paths cover all 44 workflow articles', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATH_COUNT).toBe(44)
    const strict = [
      ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_STRICT_PACKAGED_SMOKE_HELP_PATHS
    ].sort()
    const articles = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS].sort()
    expect(strict).toEqual(articles)
  })

  it('README and AGENTS include strict registry clause', () => {
    const clause = formatPackagedE2eHelpWorkflowCrosslinksStrictPackagedSmokeRegistryClause()
    expect(clause).toBe(
      '44/44 strict packaged-smoke formatters (`STRICT_PACKAGED_SMOKE_HELP_PATHS`)'
    )
    expect(readFileSync('README.md', 'utf8')).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine()
    )
    expect(readFileSync('AGENTS.md', 'utf8')).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine()
    )
  })
})
