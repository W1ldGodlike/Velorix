/** Подмножество CommonMark для статей `Help/*.md` (без таблиц/HTML): списки `-`/`+`/`*`, нумерация, перенос строки пункта при отступе ≥4 пробела или таб. */

export type MdInline =
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'strong'; children: MdInline[] }
  | { kind: 'em'; children: MdInline[] }
  | { kind: 'link'; href: string; children: MdInline[] }
  | { kind: 'image'; alt: string; src: string }

export type MdBlock =
  | { kind: 'heading'; level: 1 | 2 | 3; children: MdInline[] }
  | { kind: 'paragraph'; children: MdInline[] }
  | { kind: 'blockquote'; children: MdInline[] }
  | { kind: 'hr' }
  | { kind: 'ul'; items: MdInline[][] }
  | { kind: 'ol'; items: MdInline[][] }
  | { kind: 'pre'; language: string | null; code: string }

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/i

/** Разрешённые пути картинок в статьях: только `Help/assets/**` с безопасным именем файла. */
const KNOWLEDGE_ASSET_IMAGE_RE =
  /^(?:\.\/)?assets\/[a-z0-9][a-z0-9._/-]*\.(?:png|jpg|jpeg|gif|webp|svg)$/i

export function isKnowledgeSafeAssetImageHref(href: string): boolean {
  const t = href.trim()
  if (t.includes('..') || t.includes('\\')) {
    return false
  }
  return KNOWLEDGE_ASSET_IMAGE_RE.test(t)
}

const KNOWLEDGE_DATA_IMAGE_BASE64_MAX_CHARS = 700_000

/** Разрешённые `data:image/*;base64,...` из main (в base64 нет `)`, markdown-парсер не ломается). */
export function isKnowledgeTrustedDataImageSrc(href: string): boolean {
  const t = href.trim()
  if (t.length === 0 || t.length > KNOWLEDGE_DATA_IMAGE_BASE64_MAX_CHARS) {
    return false
  }
  return /^data:image\/(?:svg\+xml|png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+=*$/i.test(t)
}

export function isKnowledgeTrustedImageSrc(href: string): boolean {
  return isKnowledgeSafeAssetImageHref(href) || isKnowledgeTrustedDataImageSrc(href)
}

/** URL для `<img src>` в Electron (схема регистрируется в main). */
export function knowledgeHelpAssetFluxhelpUrl(href: string): string {
  const t = href.trim()
  if (t.startsWith('data:')) {
    return t
  }
  const clean = t.replace(/^\.\//, '')
  return `fluxhelp:///${clean
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`
}

export function normalizeKnowledgeMarkdownSource(raw: string): string {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

/** Строка целиком — thematic break (CommonMark-подобно: `---`, `* * *`, `___` и варианты с пробелами). */
export function isKnowledgeThematicBreak(trimmed: string): boolean {
  if (trimmed.length < 3) {
    return false
  }
  return (
    /^(?:\*[ \t]*){3,}$/.test(trimmed) ||
    /^(?:-[ \t]*){3,}$/.test(trimmed) ||
    /^(?:_[ \t]*){3,}$/.test(trimmed)
  )
}

/** Безопасные внутренние ссылки вида `foo.md` / `./foo.md` → slug; иначе `null`. */
export function knowledgeInternalSlugFromHref(href: string): string | null {
  const t = href.trim()
  if (t.length === 0) {
    return null
  }
  if (/^[a-z][a-z+.-]*:/i.test(t)) {
    return null
  }
  const base = t.split(/[/\\]/).pop() ?? t
  const slug = base.replace(/\.md$/i, '')
  if (!SLUG_RE.test(slug)) {
    return null
  }
  return slug
}

function normalizeTitleKey(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

function parseInlines(input: string): MdInline[] {
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

function stripFirstH1IfTitle(blocks: MdBlock[], title: string | undefined): MdBlock[] {
  if (!title || blocks.length === 0) {
    return blocks
  }
  const first = blocks[0]
  if (first?.kind !== 'heading' || first.level !== 1) {
    return blocks
  }
  const h1Text = inlinesToPlainText(first.children)
  if (normalizeTitleKey(h1Text) !== normalizeTitleKey(title)) {
    return blocks
  }
  return blocks.slice(1)
}

function inlinesToPlainText(nodes: MdInline[]): string {
  let s = ''
  for (const n of nodes) {
    if (n.kind === 'text') {
      s += n.text
    } else if (n.kind === 'code') {
      s += n.text
    } else if (n.kind === 'strong' || n.kind === 'em') {
      s += inlinesToPlainText(n.children)
    } else if (n.kind === 'link') {
      s += inlinesToPlainText(n.children)
    } else if (n.kind === 'image') {
      s += n.alt.length > 0 ? n.alt : n.src
    }
  }
  return s
}

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
        children: parseInlines(hMatch[2].trim())
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
        blocks.push({ kind: 'blockquote', children: parseInlines(text) })
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
        blocks.push({ kind: 'ul', items: itemTexts.map((t) => parseInlines(t)) })
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
        blocks.push({ kind: 'ol', items: itemTexts.map((t) => parseInlines(t)) })
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
      blocks.push({ kind: 'paragraph', children: parseInlines(paraText) })
    }
  }

  return stripFirstH1IfTitle(blocks, opts?.articleTitle)
}
