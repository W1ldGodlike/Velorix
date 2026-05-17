import {
  isKnowledgeThematicBreak,
  normalizeKnowledgeMarkdownSource
} from './knowledge-markdown-assets'
import { parseKnowledgeMarkdownInlines, stripFirstH1IfTitle } from './knowledge-markdown-inlines'
import type { MdBlock } from './knowledge-markdown-types'

function listMarkerBody(line: string, re: RegExp): string | null {
  const m = line.match(re)
  return m?.[1]?.trim() ?? null
}

/** Продолжение пункта списка: строка с табом или ≥4 пробелов до текста (CommonMark-подобно). */
function listContinuationBody(raw: string): string | null {
  const m = raw.match(/^(\t| {4,})(.*)$/)
  if (!m) {
    return null
  }
  const body = (m[2] ?? '').trim()
  return body.length > 0 ? body : null
}

function breaksListContinuation(trimmed: string): boolean {
  if (trimmed.length === 0) {
    return true
  }
  if (trimmed.startsWith('```')) {
    return true
  }
  if (/^#{1,3}\s/.test(trimmed)) {
    return true
  }
  if (/^>/.test(trimmed)) {
    return true
  }
  if (/^[-*+]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
    return true
  }
  if (isKnowledgeThematicBreak(trimmed)) {
    return true
  }
  return false
}

export function parseKnowledgeMarkdown(raw: string, opts?: { articleTitle?: string }): MdBlock[] {
  const md = normalizeKnowledgeMarkdownSource(raw)
  const lines = md.split('\n')
  const blocks: MdBlock[] = []
  let i = 0

  while (i < lines.length) {
    const rawLine = lines[i] ?? ''
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (trimmed.length === 0) {
      i += 1
      continue
    }

    if (isKnowledgeThematicBreak(trimmed)) {
      blocks.push({ kind: 'hr' })
      i += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      const fence = trimmed.slice(0, 3)
      const langPart = trimmed.slice(3).trim()
      const buf: string[] = []
      i += 1
      while (i < lines.length) {
        const L = (lines[i] ?? '').trim()
        if (L === fence || L === '```') {
          i += 1
          break
        }
        buf.push(lines[i] ?? '')
        i += 1
      }
      blocks.push({
        kind: 'pre',
        language: langPart.length > 0 ? langPart : null,
        code: buf.join('\n').replace(/\n+$/, '')
      })
      continue
    }

    const hMatch = trimmed.match(/^(#{1,3})\s+(.*)$/)
    if (hMatch?.[1] && hMatch[2] !== undefined) {
      const level = (hMatch[1].length === 1 ? 1 : hMatch[1].length === 2 ? 2 : 3) as 1 | 2 | 3
      blocks.push({
        kind: 'heading',
        level,
        children: parseKnowledgeMarkdownInlines(hMatch[2].trim())
      })
      i += 1
      continue
    }

    if (/^>/.test(trimmed)) {
      const parts: string[] = []
      while (i < lines.length) {
        const T = (lines[i] ?? '').trim()
        if (T.length === 0) {
          break
        }
        if (!/^>/.test(T)) {
          break
        }
        const stripped = T.replace(/^(?:>\s*)+/, '').trim()
        parts.push(stripped)
        i += 1
      }
      const text = parts.join(' ').replace(/\s+/g, ' ').trim()
      if (text.length > 0) {
        blocks.push({ kind: 'blockquote', children: parseKnowledgeMarkdownInlines(text) })
      }
      continue
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const itemTexts: string[] = []
      while (i < lines.length) {
        const rawL = lines[i] ?? ''
        const L = rawL.trim()
        if (L.length === 0) {
          break
        }
        const body = listMarkerBody(L, /^[-*+]\s+(.*)$/)
        if (body === null) {
          break
        }
        itemTexts.push(body)
        i += 1
        while (i < lines.length) {
          const rawC = lines[i] ?? ''
          const cTrim = rawC.trim()
          if (breaksListContinuation(cTrim)) {
            break
          }
          const cont = listContinuationBody(rawC)
          if (cont === null) {
            break
          }
          const prev = itemTexts[itemTexts.length - 1] ?? ''
          itemTexts[itemTexts.length - 1] = `${prev} ${cont}`.replace(/\s+/g, ' ').trim()
          i += 1
        }
      }
      if (itemTexts.length > 0) {
        blocks.push({ kind: 'ul', items: itemTexts.map((t) => parseKnowledgeMarkdownInlines(t)) })
      }
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const itemTexts: string[] = []
      while (i < lines.length) {
        const rawL = lines[i] ?? ''
        const L = rawL.trim()
        if (L.length === 0) {
          break
        }
        const body = listMarkerBody(L, /^\d+\.\s+(.*)$/)
        if (body === null) {
          break
        }
        itemTexts.push(body)
        i += 1
        while (i < lines.length) {
          const rawC = lines[i] ?? ''
          const cTrim = rawC.trim()
          if (breaksListContinuation(cTrim)) {
            break
          }
          const cont = listContinuationBody(rawC)
          if (cont === null) {
            break
          }
          const prev = itemTexts[itemTexts.length - 1] ?? ''
          itemTexts[itemTexts.length - 1] = `${prev} ${cont}`.replace(/\s+/g, ' ').trim()
          i += 1
        }
      }
      if (itemTexts.length > 0) {
        blocks.push({ kind: 'ol', items: itemTexts.map((t) => parseKnowledgeMarkdownInlines(t)) })
      }
      continue
    }

    const paraLines: string[] = []
    while (i < lines.length) {
      const L = lines[i] ?? ''
      const T = L.trim()
      if (T.length === 0) {
        break
      }
      if (T.startsWith('```')) {
        break
      }
      if (/^#{1,3}\s/.test(T)) {
        break
      }
      if (/^>/.test(T)) {
        break
      }
      if (/^[-*+]\s+/.test(T)) {
        break
      }
      if (/^\d+\.\s+/.test(T)) {
        break
      }
      if (isKnowledgeThematicBreak(T)) {
        break
      }
      paraLines.push(L.trimEnd())
      i += 1
    }
    const paraText = paraLines.join(' ').replace(/\s+/g, ' ').trim()
    if (paraText.length > 0) {
      blocks.push({ kind: 'paragraph', children: parseKnowledgeMarkdownInlines(paraText) })
    }
  }

  return stripFirstH1IfTitle(blocks, opts?.articleTitle)
}
