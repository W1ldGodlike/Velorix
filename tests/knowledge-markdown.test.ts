import { describe, expect, it } from 'vitest'

import {
  knowledgeInternalSlugFromHref,
  normalizeKnowledgeMarkdownSource,
  parseKnowledgeMarkdown
} from '../src/shared/knowledge-markdown'

describe('knowledgeInternalSlugFromHref', () => {
  it('maps help filenames to slugs', () => {
    expect(knowledgeInternalSlugFromHref('processing-social-presets.md')).toBe('processing-social-presets')
    expect(knowledgeInternalSlugFromHref('./tools-terminal-inspector.md')).toBe('tools-terminal-inspector')
  })

  it('rejects schemes and bad names', () => {
    expect(knowledgeInternalSlugFromHref('https://a/b')).toBe(null)
    expect(knowledgeInternalSlugFromHref('javascript:alert(1)')).toBe(null)
    expect(knowledgeInternalSlugFromHref('file:///tmp/x.md')).toBe(null)
  })
})

describe('parseKnowledgeMarkdown', () => {
  it('parses headings, list, links, inline code and strips duplicate h1', () => {
    const md = normalizeKnowledgeMarkdownSource(`# Hello World

1. First
2. Second

Para with **bold** and \`code\` and [x](other.md).

## Sub
- a
- b
`)
    const blocks = parseKnowledgeMarkdown(md, { articleTitle: 'Hello World' })
    expect(blocks[0]?.kind).toBe('ol')
    expect(blocks.find((b) => b.kind === 'paragraph')).toBeTruthy()
    expect(blocks.some((b) => b.kind === 'heading' && b.level === 2)).toBe(true)
    expect(blocks.some((b) => b.kind === 'ul')).toBe(true)
    expect(blocks.some((b) => b.kind === 'heading' && b.level === 1)).toBe(false)
  })

  it('parses fenced code', () => {
    const md = '```ts\nline1\nline2\n```\n\nDone.'
    const blocks = parseKnowledgeMarkdown(md)
    const pre = blocks.find((b) => b.kind === 'pre')
    expect(pre?.kind).toBe('pre')
    if (pre?.kind === 'pre') {
      expect(pre.language).toBe('ts')
      expect(pre.code).toContain('line1')
    }
  })
})
