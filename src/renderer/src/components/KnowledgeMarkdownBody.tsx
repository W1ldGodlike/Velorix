import type { JSX } from 'react'

import type { MdBlock, MdInline } from '../../../shared/knowledge-markdown'
import {
  knowledgeHelpAssetFluxhelpUrl,
  knowledgeInternalSlugFromHref
} from '../../../shared/knowledge-markdown'

import { uiText } from '../locales/ui-text'

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
    if (n.kind === 'image') {
      return (
        <img
          key={k}
          className="app-knowledge-img"
          src={knowledgeHelpAssetFluxhelpUrl(n.src)}
          alt={n.alt}
          loading="lazy"
          decoding="async"
        />
      )
    }
    if (n.kind === 'link') {
      const slug = knowledgeInternalSlugFromHref(n.href)
      if (slug !== null) {
        return (
          <button
            key={k}
            type="button"
            className="app-knowledge-link"
            title={uiText('knowledgeMdInternalLinkTooltip')}
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
          <a
            key={k}
            className="app-knowledge-a"
            href={n.href.trim()}
            target="_blank"
            rel="noreferrer noopener"
            title={uiText('knowledgeMdExternalLinkTooltip')}
          >
            {renderInline(n.children, `${k}-a`, onOpenSlug)}
          </a>
        )
      }
      return (
        <span key={k} className="app-knowledge-link-denied" title={n.href}>
          {renderInline(n.children, `${k}-d`, onOpenSlug)}
        </span>
      )
    }
    throw new Error(`Unexpected MdInline kind: ${(n as { kind: string }).kind}`)
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
  if (block.kind === 'blockquote') {
    return (
      <blockquote key={p} className="app-knowledge-bq">
        {renderInline(block.children, p, onOpenSlug)}
      </blockquote>
    )
  }
  if (block.kind === 'hr') {
    return <hr key={p} className="app-knowledge-hr" />
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
    <article
      className="app-knowledge-body"
      aria-label={uiText('knowledgeArticleBodyGroupAria')}
    >
      {blocks.map((block, idx) => renderBlock(block, idx, onOpenSlug))}
    </article>
  )
}
