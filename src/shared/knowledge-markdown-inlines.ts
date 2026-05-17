import { isKnowledgeTrustedImageSrc } from './knowledge-markdown-assets'
import type { MdBlock, MdInline } from './knowledge-markdown-types'

export function parseKnowledgeMarkdownInlines(input: string): MdInline[] {
  return parseInlinesInner(input, 0)
}

function parseInlinesInner(input: string, depth: number): MdInline[] {
  if (depth > 12) {
    return [{ kind: 'text', text: input }]
  }
  const out: MdInline[] = []
  let i = 0
  let buf = ''

  const flushText = (): void => {
    if (buf.length > 0) {
      out.push({ kind: 'text', text: buf })
      buf = ''
    }
  }

  while (i < input.length) {
    const ch = input[i] ?? ''

    if (ch === '`') {
      flushText()
      const end = input.indexOf('`', i + 1)
      if (end === -1) {
        buf += input.slice(i)
        break
      }
      out.push({ kind: 'code', text: input.slice(i + 1, end) })
      i = end + 1
      continue
    }

    if (ch === '*' && input[i + 1] === '*') {
      flushText()
      const start = i + 2
      const end = input.indexOf('**', start)
      if (end === -1) {
        buf += '**'
        i += 2
        continue
      }
      out.push({ kind: 'strong', children: parseInlinesInner(input.slice(start, end), depth + 1) })
      i = end + 2
      continue
    }

    if (ch === '*' && input[i + 1] !== '*') {
      flushText()
      const start = i + 1
      const end = input.indexOf('*', start)
      if (end === -1 || end === start) {
        buf += ch
        i += 1
        continue
      }
      out.push({ kind: 'em', children: parseInlinesInner(input.slice(start, end), depth + 1) })
      i = end + 1
      continue
    }

    if (ch === '!' && input[i + 1] === '[') {
      flushText()
      const closeLabel = input.indexOf(']', i + 2)
      if (
        closeLabel !== -1 &&
        input[closeLabel + 1] === '(' &&
        input.indexOf(')', closeLabel + 2) !== -1
      ) {
        const closeHref = input.indexOf(')', closeLabel + 2)
        const labelRaw = input.slice(i + 2, closeLabel)
        const href = input.slice(closeLabel + 2, closeHref).trim()
        if (isKnowledgeTrustedImageSrc(href)) {
          out.push({
            kind: 'image',
            alt: labelRaw.trim(),
            src: href.replace(/^\.\//, '')
          })
          i = closeHref + 1
          continue
        }
      }
      buf += '!'
      i += 1
      continue
    }

    if (ch === '[') {
      const closeLabel = input.indexOf(']', i + 1)
      if (closeLabel !== -1 && input[closeLabel + 1] === '(') {
        const closeHref = input.indexOf(')', closeLabel + 2)
        if (closeHref !== -1) {
          flushText()
          const labelRaw = input.slice(i + 1, closeLabel)
          const href = input.slice(closeLabel + 2, closeHref).trim()
          out.push({
            kind: 'link',
            href,
            children: parseInlinesInner(labelRaw, depth + 1)
          })
          i = closeHref + 1
          continue
        }
      }
    }

    buf += ch
    i += 1
  }

  flushText()
  return mergeAdjacentText(out)
}

function mergeAdjacentText(nodes: MdInline[]): MdInline[] {
  const merged: MdInline[] = []
  for (const n of nodes) {
    const prev = merged[merged.length - 1]
    if (n.kind === 'text' && prev?.kind === 'text') {
      prev.text += n.text
    } else {
      merged.push(n)
    }
  }
  return merged
}

export function normalizeKnowledgeTitleKey(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

export function knowledgeInlinesToPlainText(nodes: MdInline[]): string {
  let s = ''
  for (const n of nodes) {
    if (n.kind === 'text') {
      s += n.text
    } else if (n.kind === 'code') {
      s += n.text
    } else if (n.kind === 'strong' || n.kind === 'em') {
      s += knowledgeInlinesToPlainText(n.children)
    } else if (n.kind === 'link') {
      s += knowledgeInlinesToPlainText(n.children)
    } else if (n.kind === 'image') {
      s += n.alt.length > 0 ? n.alt : n.src
    }
  }
  return s
}

export function stripFirstH1IfTitle(blocks: MdBlock[], title: string | undefined): MdBlock[] {
  if (!title || blocks.length === 0) {
    return blocks
  }
  const first = blocks[0]
  if (first?.kind !== 'heading' || first.level !== 1) {
    return blocks
  }
  const h1Text = knowledgeInlinesToPlainText(first.children)
  if (normalizeKnowledgeTitleKey(h1Text) !== normalizeKnowledgeTitleKey(title)) {
    return blocks
  }
  return blocks.slice(1)
}
