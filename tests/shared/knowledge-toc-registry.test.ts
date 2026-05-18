import { describe, expect, it } from 'vitest'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import {
  groupKnowledgeArticlesByToc,
  KNOWLEDGE_TOC_REGISTRY_SLUGS,
  KNOWLEDGE_TOC_SECTIONS
} from '../../src/shared/knowledge-toc-registry'

const HELP_DIR = join(process.cwd(), 'Help')

describe('knowledge-toc-registry', () => {
  it('covers every Help/*.md slug (7 sections E5)', () => {
    const helpSlugs = readdirSync(HELP_DIR)
      .filter((name) => /^[a-z0-9][a-z0-9-]*\.md$/i.test(name))
      .map((name) => name.replace(/\.md$/i, ''))
      .sort()
    const registry = [...KNOWLEDGE_TOC_REGISTRY_SLUGS].sort()
    expect(registry).toEqual(helpSlugs)
    expect(KNOWLEDGE_TOC_SECTIONS).toHaveLength(7)
  })

  it('groupKnowledgeArticlesByToc preserves section order', () => {
    const articles = [
      { slug: 'faq-troubleshooting', title: 'FAQ', fileName: 'faq-troubleshooting.md' },
      { slug: 'getting-started', title: 'Start', fileName: 'getting-started.md' }
    ]
    const groups = groupKnowledgeArticlesByToc(articles)
    expect(groups.map((g) => g.spec.id)).toEqual(['start', 'faq'])
    expect(groups[0]?.articles[0]?.slug).toBe('getting-started')
  })
})
