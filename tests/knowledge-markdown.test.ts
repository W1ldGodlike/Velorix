import { describe, expect, it } from 'vitest'

import {
  isKnowledgeThematicBreak,
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

describe('isKnowledgeThematicBreak', () => {
  it('detects hr lines', () => {
    expect(isKnowledgeThematicBreak('---')).toBe(true)
    expect(isKnowledgeThematicBreak('- - -')).toBe(true)
    expect(isKnowledgeThematicBreak('* * *')).toBe(true)
    expect(isKnowledgeThematicBreak('___')).toBe(true)
    expect(isKnowledgeThematicBreak('- item')).toBe(false)
    expect(isKnowledgeThematicBreak('--')).toBe(false)
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

  it('parses blockquote lines into one block', () => {
    const md = '> First line\n> Second **bit**\n\nAfter.'
    const blocks = parseKnowledgeMarkdown(md)
    const bq = blocks.find((b) => b.kind === 'blockquote')
    expect(bq?.kind).toBe('blockquote')
    if (bq?.kind === 'blockquote') {
      expect(bq.children.some((c) => c.kind === 'strong')).toBe(true)
    }
    expect(blocks.some((b) => b.kind === 'paragraph')).toBe(true)
  })

  it('parses thematic breaks between blocks', () => {
    const md = 'Before\n\n---\n\nAfter\n* * *\nEnd'
    const blocks = parseKnowledgeMarkdown(md)
    const hrs = blocks.filter((b) => b.kind === 'hr')
    expect(hrs).toHaveLength(2)
    expect(blocks.filter((b) => b.kind === 'paragraph').length).toBeGreaterThanOrEqual(2)
  })

  it('parses + unordered markers and indented list continuations', () => {
    const md = normalizeKnowledgeMarkdownSource(`+ One
    continued here
+ Two

1. Alpha
    beta tail
2. Gamma
`)
    const blocks = parseKnowledgeMarkdown(md)
    const ul = blocks.find((b) => b.kind === 'ul')
    expect(ul?.kind).toBe('ul')
    if (ul?.kind === 'ul') {
      expect(ul.items).toHaveLength(2)
    }
    const ol = blocks.find((b) => b.kind === 'ol')
    expect(ol?.kind).toBe('ol')
    if (ol?.kind === 'ol') {
      expect(ol.items).toHaveLength(2)
    }
  })
})
