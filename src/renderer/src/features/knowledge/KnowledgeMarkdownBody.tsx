import { useMemo, type JSX, type ReactNode } from 'react'

import {
  isKnowledgeTrustedImageSrc,
  knowledgeHelpAssetVelorixhelpUrl,
  knowledgeInternalSlugFromHref,
  parseKnowledgeMarkdown,
  type MdBlock,
  type MdInline
} from '../../../../shared/knowledge-markdown'

type KnowledgeMarkdownBodyProps = {
  markdown: string
  articleTitle?: string
  onSelectSlug?: (slug: string) => void
}

export function KnowledgeMarkdownBody(props: KnowledgeMarkdownBodyProps): JSX.Element {
  const { markdown, articleTitle, onSelectSlug } = props
  const blocks = useMemo(() => {
    if (articleTitle != null && articleTitle.length > 0) {
      return parseKnowledgeMarkdown(markdown, { articleTitle })
    }
    return parseKnowledgeMarkdown(markdown)
  }, [markdown, articleTitle])
  return <div className="knowledge-markdown">{renderBlocks(blocks, onSelectSlug)}</div>
}

function renderBlocks(blocks: MdBlock[], onSelectSlug?: (slug: string) => void): ReactNode {
  return blocks.map((block, index) => renderBlock(block, `${index}`, onSelectSlug))
}

function renderBlock(
  block: MdBlock,
  key: string,
  onSelectSlug?: (slug: string) => void
): ReactNode {
  switch (block.kind) {
    case 'heading': {
      const Tag = block.level === 1 ? 'h3' : block.level === 2 ? 'h4' : 'h5'
      return (
        <Tag key={key} className={`knowledge-markdown__h${String(block.level)}`}>
          {renderInlines(block.children, onSelectSlug)}
        </Tag>
      )
    }
    case 'paragraph':
      return (
        <p key={key} className="knowledge-markdown__p">
          {renderInlines(block.children, onSelectSlug)}
        </p>
      )
    case 'blockquote':
      return (
        <blockquote key={key} className="knowledge-markdown__quote">
          {renderInlines(block.children, onSelectSlug)}
        </blockquote>
      )
    case 'hr':
      return <hr key={key} className="knowledge-markdown__hr" />
    case 'ul':
      return (
        <ul key={key} className="knowledge-markdown__ul">
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${String(itemIndex)}`}>{renderInlines(item, onSelectSlug)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={key} className="knowledge-markdown__ol">
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${String(itemIndex)}`}>{renderInlines(item, onSelectSlug)}</li>
          ))}
        </ol>
      )
    case 'pre':
      return (
        <pre key={key} className="knowledge-markdown__pre">
          <code>{block.code}</code>
        </pre>
      )
    default:
      return null
  }
}

function renderInlines(nodes: MdInline[], onSelectSlug?: (slug: string) => void): ReactNode {
  return nodes.map((node, index) => renderInline(node, String(index), onSelectSlug))
}

function renderInline(
  node: MdInline,
  key: string,
  onSelectSlug?: (slug: string) => void
): ReactNode {
  switch (node.kind) {
    case 'text':
      return <span key={key}>{node.text}</span>
    case 'code':
      return (
        <code key={key} className="knowledge-markdown__code">
          {node.text}
        </code>
      )
    case 'strong':
      return <strong key={key}>{renderInlines(node.children, onSelectSlug)}</strong>
    case 'em':
      return <em key={key}>{renderInlines(node.children, onSelectSlug)}</em>
    case 'link': {
      const slug = knowledgeInternalSlugFromHref(node.href)
      if (slug != null && onSelectSlug != null) {
        return (
          <button
            key={key}
            type="button"
            className="knowledge-markdown__link"
            onClick={() => onSelectSlug(slug)}
          >
            {renderInlines(node.children, onSelectSlug)}
          </button>
        )
      }
      return (
        <a key={key} className="knowledge-markdown__link" href={node.href} rel="noreferrer">
          {renderInlines(node.children, onSelectSlug)}
        </a>
      )
    }
    case 'image':
      if (!isKnowledgeTrustedImageSrc(node.src)) {
        return null
      }
      return (
        <img
          key={key}
          className="knowledge-markdown__img"
          src={knowledgeHelpAssetVelorixhelpUrl(node.src)}
          alt={node.alt}
          loading="lazy"
        />
      )
    default:
      return null
  }
}
