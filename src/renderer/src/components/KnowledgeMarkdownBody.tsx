import type { JSX } from 'react'

import type { MdBlock, MdInline } from '../../../shared/knowledge-markdown'
import { knowledgeInternalSlugFromHref } from '../../../shared/knowledge-markdown'

function renderInline(
  nodes: MdInline[],
  keyPrefix: string,
  onOpenSlug: (slug: string) => void
): JSX.Element[] {
  return nodes.map((n, i) => {
    const k = `${keyPrefix}-${i}`
    if (n.kind === 'text') {
      return <span key={k}>{n.text}</span>
    }
    if (n.kind === 'code') {
      return (
        <code key={k} className="app-knowledge-code">
          {n.text}
        </code>
      )
    }
    if (n.kind === 'strong') {
      return <strong key={k}>{renderInline(n.children, `${k}-s`, onOpenSlug)}</strong>
    }
    if (n.kind === 'em') {
      return <em key={k}>{renderInline(n.children, `${k}-e`, onOpenSlug)}</em>
    }
    const slug = knowledgeInternalSlugFromHref(n.href)
    if (slug !== null) {
      return (
        <button
          key={k}
          type="button"
          className="app-knowledge-link"
          onClick={() => {
            onOpenSlug(slug)
          }}
        >
          {renderInline(n.children, `${k}-l`, onOpenSlug)}
        </button>
      )
    }
    if (/^https?:\/\//i.test(n.href.trim())) {
      return (
        <a key={k} className="app-knowledge-a" href={n.href.trim()} target="_blank" rel="noreferrer noopener">
          {renderInline(n.children, `${k}-a`, onOpenSlug)}
        </a>
      )
    }
    return (
      <span key={k} className="app-knowledge-link-denied" title={n.href}>
        {renderInline(n.children, `${k}-d`, onOpenSlug)}
      </span>
    )
  })
}

function renderBlock(block: MdBlock, idx: number, onOpenSlug: (slug: string) => void): JSX.Element {
  const p = `kb-${idx}`
  if (block.kind === 'heading') {
    const Tag = block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3'
    return (
      <Tag key={p} className={`app-knowledge-h app-knowledge-h${block.level}`}>
        {renderInline(block.children, p, onOpenSlug)}
      </Tag>
    )
  }
  if (block.kind === 'paragraph') {
    return (
      <p key={p} className="app-knowledge-p">
        {renderInline(block.children, p, onOpenSlug)}
      </p>
    )
  }
  if (block.kind === 'ul') {
    return (
      <ul key={p} className="app-knowledge-ul">
        {block.items.map((item, j) => (
          <li key={`${p}-li-${j}`} className="app-knowledge-li">
            {renderInline(item, `${p}-li-${j}`, onOpenSlug)}
          </li>
        ))}
      </ul>
    )
  }
  if (block.kind === 'ol') {
    return (
      <ol key={p} className="app-knowledge-ol">
        {block.items.map((item, j) => (
          <li key={`${p}-li-${j}`} className="app-knowledge-li">
            {renderInline(item, `${p}-li-${j}`, onOpenSlug)}
          </li>
        ))}
      </ol>
    )
  }
  return (
    <pre key={p} className="app-knowledge-pre">
      {block.language ? (
        <div className="app-knowledge-pre-lang" aria-hidden="true">
          {block.language}
        </div>
      ) : null}
      <code>{block.code}</code>
    </pre>
  )
}

export function KnowledgeMarkdownBody({
  blocks,
  onOpenSlug
}: {
  blocks: MdBlock[]
  onOpenSlug: (slug: string) => void
}): JSX.Element {
  return (
    <div className="app-knowledge-body">
      {blocks.map((block, idx) => renderBlock(block, idx, onOpenSlug))}
    </div>
  )
}
