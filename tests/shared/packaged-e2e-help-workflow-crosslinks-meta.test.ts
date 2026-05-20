import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause,
  formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import {
  PACKAGED_E2E_CI_HEADLESS_STEP_IDS,
  PACKAGED_E2E_MANUAL_OWNER_STEP_IDS,
  PACKAGED_E2E_PLANNED_GUI_STEP_IDS
} from '../../src/shared/packaged-e2e-smoke-scenarios'
import {
  TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_MISC_TAIL_HELP_PATHS
} from '../../src/shared/terminal-contract-hints-meta'
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeGuardsLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePackagedQuietLine,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EDITOR_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCountParenthetical,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowPartitionLine,
  formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine,
  formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET,
  formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiClause,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeManualOwnerClause,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepHelpClause,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxPlannedGuiFooter,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyAutomationGroupsParenthetical,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT,
  formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote,
  formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail,
  formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsOwnerSmokeLead,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause,
  formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksLoggingCopyE2eClause,
  formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksLoggingTerminalShardClause,
  formatPackagedE2eHelpWorkflowCrosslinksEditorWorkflowPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticleOwnerReleaseTerminalTail,
  formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale
} from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'

describe('packaged-e2e-help-workflow-crosslinks-meta §15/§21', () => {
  it('article count matches canonical path list', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT).toBe(44)
  })

  it('workflow articles covered by tail, ffmpeg-terminal, or knowledge hub paths', () => {
    const tail = new Set<string>(TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS)
    const ffmpeg = new Set<string>(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS)
    const knowledge = new Set<string>(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS)
    const faq = new Set<string>(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS)
    expect(tail.size).toBe(42)
    expect(ffmpeg.size).toBe(2)
    expect(knowledge.size).toBe(2)
    expect(faq.size).toBe(2)
    expect([...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS]).toEqual([
      ...TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS
    ])
    for (const rel of faq) {
      expect(tail.has(rel), rel).toBe(true)
    }
    for (const rel of tail) {
      const inArticles = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.includes(
        rel as (typeof PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS)[number]
      )
      expect(inArticles || faq.has(rel), rel).toBe(true)
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS) {
      expect(tail.has(rel) || ffmpeg.has(rel) || knowledge.has(rel), rel).toBe(true)
    }
    expect(tail.size - faq.size + ffmpeg.size + knowledge.size).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT
    )
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS) {
      expect(readFileSync(rel, 'utf8'), rel).toContain('partition:')
    }
  })

  it('exports Help/locale count snippets', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET).toBe('44 articles')
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET).toBe('44 статьи')
  })

  it('anchor path lists cover Help count anchors and packaged windows', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS).toHaveLength(4)
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS).toHaveLength(4)
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS).toHaveLength(2)
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS).toHaveLength(4)
  })

  it('exports guard npm script name', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT).toBe(
      'check:help-workflow-smoke-crosslinks'
    )
  })

  it('aggregates packaged Help and count anchor path lists', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS).toHaveLength(6)
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS).toHaveLength(8)
    expect(new Set(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS).size).toBe(6)
  })

  it('picks EN/RU count snippet and bin README path', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH).toBe('bin/README.md')
    expect(pickPackagedE2eHelpWorkflowCrosslinksCountSnippet('Help/en/foo.md')).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
    )
    expect(pickPackagedE2eHelpWorkflowCrosslinksCountSnippet('Help/foo.md')).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
    )
    expect(pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale('en')).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
    )
    expect(pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale('ru')).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
    )
  })

  it('exports workflow required snippets for crosslinks guard', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS).toHaveLength(8)
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS).toContain(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS).toContain(
      'terminalHints:'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS).toContain(
      'releaseSmoke:'
    )
  })

  it('formats settings Help clause and owner Help paths from anchors', () => {
    expect(formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause('en')).toBe(
      `Help: check:help-workflow-smoke-crosslinks (44 articles; ${formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote('en')}).`
    )
    expect(formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause('ru')).toBe(
      `Help: check:help-workflow-smoke-crosslinks (44 статьи; ${formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote('ru')}).`
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS).toEqual([
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS[0],
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS[0]
    ])
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS).toHaveLength(2)
  })

  it('defines Help guard quiet step order (registry first)', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS[0]).toBe(
      'help-smoke-guards-package-json'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS).toHaveLength(4)
    expect(formatPackagedE2eHelpWorkflowCrosslinksBinReadmeGuardsLine()).toContain(
      'check:help-smoke-guards-package-json'
    )
  })

  it('lists Help guard npm scripts and snippet registries cite workflow guard', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS).toHaveLength(3)
    for (const snippets of [
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_REQUIRED_SNIPPETS,
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_REQUIRED_SNIPPETS,
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS,
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_REQUIRED_SNIPPETS,
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_REQUIRED_SNIPPETS
    ]) {
      expect(snippets).toContain(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT)
    }
  })

  it('exports owner/packaged Help required snippet registries', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_REQUIRED_SNIPPETS).toContain(
      'formatPackagedManualSmokeE2eAppendixLines'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_BASE_REQUIRED_SNIPPETS).toContain(
      'packaged-manual-smoke-parity'
    )
    expect(formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCountParenthetical('en')).toBe(
      '(44 articles)'
    )
    for (const locale of ['en', 'ru'] as const) {
      const rel = locale === 'en' ? 'Help/en/owner-manual-smoke.md' : 'Help/owner-manual-smoke.md'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeManualOwnerClause(locale)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepHelpClause(locale)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiClause(locale)
      )
    }
  })

  it('formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail matches hub Help', () => {
    for (const locale of ['ru', 'en'] as const) {
      expect(formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale)).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
      )
    }
    expect(TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS).toHaveLength(42)
    expect(TERMINAL_CONTRACT_HINTS_WORKFLOW_MISC_TAIL_HELP_PATHS).toHaveLength(26)
    for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(formatPackagedE2eHelpWorkflowCrosslinksHelpCrosslinksCountTail(locale))
    }
    for (const rel of ['Help/owner-manual-smoke.md', 'Help/en/owner-manual-smoke.md']) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWorkflowArticlesClause(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const aboutUiHint = formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(locale)
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph(
          locale,
          aboutUiHint
        )
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const plannerUiHint = formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(locale)
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsOwnerSmokeLead(locale)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph(locale, plannerUiHint)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_EDITOR_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const editorParagraph =
        formatPackagedE2eHelpWorkflowCrosslinksEditorWorkflowPackagedSmokeParagraph(locale)
      expect(editorParagraph).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksWorkflowArticleOwnerReleaseTerminalTail(locale)
      )
      expect(readFileSync(rel, 'utf8')).toContain(editorParagraph)
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const uiHint = formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(locale)
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph(locale, uiHint)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const uiHint = formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(locale)
      const paragraph = formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph(
        locale,
        uiHint
      )
      expect(paragraph).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote(locale)
      )
      expect(readFileSync(rel, 'utf8')).toContain(paragraph)
    }
  })

  it('formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine mentions 44 and 6', () => {
    expect(formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine()).toContain(
      '44 workflow crosslinks, 6 articles'
    )
  })

  it('formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix matches packaged Help', () => {
    expect(formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksPartitionNote('en')).toContain(
      'FAQ outside 44'
    )
    for (const rel of [
      'Help/packaged-windows-smoke.md',
      'Help/packaged-linux-smoke.md',
      'Help/packaged-macos-smoke.md',
      'Help/en/packaged-windows-smoke.md',
      'Help/en/packaged-linux-smoke.md',
      'Help/en/packaged-macos-smoke.md'
    ]) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix(locale)
      )
    }
  })

  it('formatPackagedE2eHelpWorkflowCrosslinksLoggingClause matches logging Help', () => {
    for (const rel of ['Help/logging-and-diagnostics.md', 'Help/en/logging-and-diagnostics.md']) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      const plannedScope = formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(locale)
      const uiHint = formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksLoggingTerminalShardClause(locale)
      )
      expect(text).toContain(formatPackagedE2eHelpWorkflowCrosslinksLoggingCopyE2eClause(locale))
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph(locale, plannedScope, uiHint)
      )
    }
  })

  it('packaged Help includes planned GUI e2e and Playwright deferred formatters', () => {
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiClause(locale)
      )
    }
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_CI_HEADLESS_STEP_COUNT).toBe(
      PACKAGED_E2E_CI_HEADLESS_STEP_IDS.length
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT).toBe(
      PACKAGED_E2E_PLANNED_GUI_STEP_IDS.length
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_MANUAL_OWNER_STEP_COUNT).toBe(
      PACKAGED_E2E_MANUAL_OWNER_STEP_IDS.length
    )
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyAutomationGroupsParenthetical(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxPlannedGuiFooter(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause(locale)
      )
    }
    for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause(locale)
      )
    }
    for (const rel of [
      ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
      ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS
    ]) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause(locale)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPlaywrightDeferredSuffix(locale)
      )
    }
  })

  it('formats bin/README packaged quiet, dev, and partition lines', () => {
    const quietLine = formatPackagedE2eHelpWorkflowCrosslinksBinReadmePackagedQuietLine()
    expect(quietLine).toContain('check:help-packaged-smoke-docs')
    expect(quietLine).toContain(
      'formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix'
    )
    const devLine = formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine()
    expect(devLine).toContain(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE)
    expect(devLine).toContain('44 articles')
    expect(devLine).toContain('packaged/owner anchors')
    const partitionLine = formatPackagedE2eHelpWorkflowCrosslinksBinReadmeWorkflowPartitionLine()
    expect(partitionLine).toContain(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET
    )
    const partitionGuardLine = formatPackagedE2eHelpWorkflowCrosslinksBinReadmePartitionGuardLine()
    expect(partitionGuardLine).toContain(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET
    )
    const playwrightDeferredLine =
      formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine()
    expect(playwrightDeferredLine).toContain('test:e2e:gui')
    expect(playwrightDeferredLine).toContain('check:packaged-gui-e2e-playwright-deferred')
    expect(playwrightDeferredLine).toContain(
      `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT} planned-gui-e2e`
    )
    for (const locale of ['en', 'ru'] as const) {
      const plannedClause =
        formatPackagedE2eHelpWorkflowCrosslinksPackagedPlannedGuiE2eClause(locale)
      expect(plannedClause).toContain(
        `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT}`
      )
      const settings = JSON.parse(
        readFileSync(`locales/${locale}/settings.json`, 'utf8')
      ) as Record<string, string>
      expect(settings['appSettingsPackagedSmokeCopyAppendixHint']).toBe(
        formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody(locale)
      )
      expect(settings['appSettingsPackagedE2eRegistryGuardHint']).toBe(
        formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody(locale)
      )
      expect(settings['appSettingsOwnerSmokeIntro']).toBe(
        formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody(locale)
      )
    }
    const readme = readFileSync('bin/README.md', 'utf8')
    expect(readme).toContain(quietLine)
    expect(readme).toContain(devLine)
    expect(readme).toContain(partitionLine)
    expect(readme).toContain(partitionGuardLine)
    expect(readme).toContain(playwrightDeferredLine)
    const rootLine = formatPackagedE2eHelpWorkflowCrosslinksRootReadmePartitionLine()
    expect(readFileSync('README.md', 'utf8')).toContain(rootLine)
    const agentsLine = formatPackagedE2eHelpWorkflowCrosslinksAgentsMdHelpLine()
    expect(readFileSync('AGENTS.md', 'utf8')).toContain(agentsLine)
  })

  it('formats diagnostic line and owner guard paths match anchors', () => {
    expect(formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine()).toContain(
      'check:help-workflow-smoke-crosslinks'
    )
    expect(formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine('articles')).toContain(
      '44 articles'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS).toHaveLength(8)
    expect([...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS].sort()).toEqual(
      [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS].sort()
    )
  })
})
