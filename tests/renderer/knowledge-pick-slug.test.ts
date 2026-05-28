import { describe, expect, it } from 'vitest'

import { pickInitialKnowledgeSlug } from '../../src/renderer/src/lib/knowledge-pick-initial-slug'

describe('pickInitialKnowledgeSlug', () => {
  const articles = [
    { slug: 'alpha', title: 'Alpha', fileName: 'alpha.md' },
    { slug: 'beta', title: 'Beta', fileName: 'beta.md' }
  ]

  it('returns null for empty list', () => {
    expect(pickInitialKnowledgeSlug([], null)).toBeNull()
  })

  it('prefers pending slug when visible', () => {
    expect(pickInitialKnowledgeSlug(articles, 'beta')).toBe('beta')
  })

  it('falls back to first article', () => {
    expect(pickInitialKnowledgeSlug(articles, 'missing')).toBe('alpha')
  })
})
