import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_MAC_LINUX_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine,
  formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippetByLocale
} from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'

describe('packaged-e2e-help-workflow-crosslinks-meta §15/§21', () => {
  it('article count matches canonical path list', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT).toBe(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS.length
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT).toBe(34)
  })

  it('paths are unique Help markdown files', () => {
    const paths = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS]
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths.every((p) => p.startsWith('Help/') && p.endsWith('.md'))).toBe(true)
  })

  it('exports Help/locale count snippets', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET).toBe('34 articles')
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET).toBe('34 статьи')
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
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS).toHaveLength(5)
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS).toContain(
      'releaseSmoke:'
    )
  })

  it('formats settings Help clause and owner Help paths from anchors', () => {
    expect(formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause('en')).toBe(
      'Help: check:help-workflow-smoke-crosslinks (34 articles).'
    )
    expect(formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause('ru')).toBe(
      'Help: check:help-workflow-smoke-crosslinks (34 статьи).'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS).toEqual([
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS[0],
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS[0]
    ])
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS).toHaveLength(2)
  })

  it('formats bin/README dev line with meta module id', () => {
    const line = formatPackagedE2eHelpWorkflowCrosslinksBinReadmeDevLine()
    expect(line).toContain(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_META_MODULE)
    expect(line).toContain('34 articles')
    expect(line).toContain('workflow + packaged/owner anchors')
  })

  it('formats diagnostic line and owner guard paths match anchors', () => {
    expect(formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine()).toContain(
      'check:help-workflow-smoke-crosslinks'
    )
    expect(formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine('articles')).toContain(
      '34 articles'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS).toHaveLength(8)
    expect([...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS].sort()).toEqual(
      [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS].sort()
    )
  })
})
