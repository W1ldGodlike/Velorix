import { describe, expect, it } from 'vitest'

import {
  isKnowledgeSafeAssetImageHref,
  isKnowledgeThematicBreak,
  isKnowledgeTrustedDataImageSrc,
  knowledgeHelpAssetFluxhelpUrl,
  knowledgeInternalSlugFromHref,
  normalizeKnowledgeMarkdownSource,
  parseKnowledgeMarkdown
} from '../src/shared/knowledge-markdown'

describe('knowledgeInternalSlugFromHref', () => {
  it('maps help filenames to slugs', () => {
    expect(knowledgeInternalSlugFromHref('processing-social-presets.md')).toBe(
      'processing-social-presets'
    )
    expect(knowledgeInternalSlugFromHref('./tools-terminal-inspector.md')).toBe(
      'tools-terminal-inspector'
    )
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

describe('isKnowledgeSafeAssetImageHref', () => {
  it('allows Help/assets paths only', () => {
    expect(isKnowledgeSafeAssetImageHref('assets/diagram.svg')).toBe(true)
    expect(isKnowledgeSafeAssetImageHref('./assets/x.png')).toBe(true)
    expect(isKnowledgeSafeAssetImageHref('assets/../x.png')).toBe(false)
    expect(isKnowledgeSafeAssetImageHref('other/x.png')).toBe(false)
    expect(isKnowledgeSafeAssetImageHref('assets/readme.txt')).toBe(false)
  })
})

describe('isKnowledgeTrustedDataImageSrc', () => {
  it('allows only tight data:image/*;base64,... patterns', () => {
    expect(
      isKnowledgeTrustedDataImageSrc(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      )
    ).toBe(true)
    expect(isKnowledgeTrustedDataImageSrc('data:text/html;base64,PHNjcmlwdD4=')).toBe(false)
    expect(isKnowledgeTrustedDataImageSrc('data:image/png;base64,ab)d')).toBe(false)
  })
})

describe('knowledgeHelpAssetFluxhelpUrl', () => {
  it('builds fluxhelp URL with encoded segments', () => {
    expect(knowledgeHelpAssetFluxhelpUrl('assets/a b.svg')).toBe('fluxhelp:///assets/a%20b.svg')
  })

  it('passes through data:image base64 URLs unchanged', () => {
    const data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    expect(knowledgeHelpAssetFluxhelpUrl(data)).toBe(data)
  })
})

describe('parseKnowledgeMarkdown images', () => {
  it('parses safe asset images into image inlines', () => {
    const md = 'Text ![cap](assets/x.png) tail.'
    const blocks = parseKnowledgeMarkdown(md)
    const p = blocks.find((b) => b.kind === 'paragraph')
    expect(p?.kind).toBe('paragraph')
    if (p?.kind === 'paragraph') {
      const img = p.children.find((c) => c.kind === 'image')
      expect(img).toEqual({ kind: 'image', alt: 'cap', src: 'assets/x.png' })
    }
  })

  it('parses inlined data:image base64 into image inlines', () => {
    const data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    const md = `Pic ![1x1](${data}) end.`
    const blocks = parseKnowledgeMarkdown(md)
    const p = blocks.find((b) => b.kind === 'paragraph')
    expect(p?.kind).toBe('paragraph')
    if (p?.kind === 'paragraph') {
      const img = p.children.find((c) => c.kind === 'image')
      expect(img).toEqual({ kind: 'image', alt: '1x1', src: data })
    }
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
