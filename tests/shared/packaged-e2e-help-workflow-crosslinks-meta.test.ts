import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS
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
  })
})
