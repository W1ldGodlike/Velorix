import { useEffect, useMemo, useState } from 'react'
import type { JSX } from 'react'

import type { KnowledgeArticleListItem } from '../../../shared/knowledge-contract'
import { parseKnowledgeMarkdown } from '../../../shared/knowledge-markdown'

import { KnowledgeMarkdownBody } from './KnowledgeMarkdownBody'
import { uiText } from '../locales/ui-text'

export function KnowledgeDialog({
  open,
  onClose,
  onStatus,
  initialSlug = null
}: {
  open: boolean
  onClose: () => void
  onStatus?: (message: string) => void
  /** Если задан и есть в списке статей — выбрать при открытии вместо первой в TOC. */
  initialSlug?: string | null
}): JSX.Element | null {
  const [articles, setArticles] = useState<KnowledgeArticleListItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [markdownSource, setMarkdownSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    let disposed = false
    void Promise.resolve().then(async () => {
      setLoading(true)
      setError(null)
      const res = await window.fluxalloy.knowledge.listArticles()
      if (disposed) {
        return
      }
      setLoading(false)
      if (!res.ok) {
        setError(res.error)
        onStatus?.(res.error)
        return
      }
      setArticles(res.articles)
      const first = res.articles[0]?.slug ?? null
      const want = initialSlug?.trim()
      const resolved =
        want && res.articles.some((a) => a.slug === want) ? want : null
      setSelectedSlug((current) => (resolved !== null ? resolved : current ?? first))
    })
    return () => {
      disposed = true
    }
  }, [initialSlug, onStatus, open])

  useEffect(() => {
    if (!open || selectedSlug === null) {
      return
    }
    let disposed = false
    void Promise.resolve().then(async () => {
      setLoading(true)
      setError(null)
      const res = await window.fluxalloy.knowledge.readArticle(selectedSlug)
      if (disposed) {
        return
      }
      setLoading(false)
      if (!res.ok) {
        setError(res.error)
        onStatus?.(res.error)
        return
      }
      setMarkdownSource(res.markdown)
    })
    return () => {
      disposed = true
    }
  }, [onStatus, open, selectedSlug])

  const selected = useMemo(
    () => articles.find((article) => article.slug === selectedSlug) ?? null,
    [articles, selectedSlug]
  )

  const mdBlocks = useMemo(() => {
    if (!selected) {
      return []
    }
    return parseKnowledgeMarkdown(markdownSource, { articleTitle: selected.title })
  }, [markdownSource, selected])

  const visibleArticles = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (q.length === 0) {
      return articles
    }
    return articles.filter((article) =>
      `${article.title} ${article.slug} ${article.fileName}`.toLowerCase().includes(q)
    )
  }, [articles, filter])

  if (!open) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal app-modal-wide app-knowledge-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="knowledge-title"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="app-modal-header-row">
          <div>
            <h2 id="knowledge-title" className="app-modal-title">
              {uiText('knowledgeTitle')}
            </h2>
            <p className="app-modal-hint">{uiText('knowledgeHint')}</p>
          </div>
          <button type="button" className="app-btn" onClick={onClose}>
            {uiText('closeButton')}
          </button>
        </div>

        <div className="app-knowledge-grid">
          <aside className="app-knowledge-sidebar" aria-label={uiText('knowledgeTocAria')}>
            <input
              className="app-input app-knowledge-search"
              value={filter}
              placeholder={uiText('knowledgeSearchPlaceholder')}
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            />
            <div className="app-knowledge-list" role="list">
              {visibleArticles.map((article) => (
                <button
                  key={article.slug}
                  type="button"
                  className={
                    article.slug === selectedSlug
                      ? 'app-knowledge-item app-knowledge-item-active'
                      : 'app-knowledge-item'
                  }
                  onClick={() => {
                    setSelectedSlug(article.slug)
                  }}
                >
                  <strong>{article.title}</strong>
                  <span>{article.fileName}</span>
                </button>
              ))}
            </div>
          </aside>

          <article className="app-knowledge-article">
            {loading ? <p className="app-modal-hint">{uiText('loading')}</p> : null}
            {error ? <p className="app-modal-hint app-error-text">{error}</p> : null}
            {!loading && !error && selected ? (
              <>
                <h3>{selected.title}</h3>
                <KnowledgeMarkdownBody
                  blocks={mdBlocks}
                  onOpenSlug={(slug) => {
                    setSelectedSlug(slug)
                    setFilter('')
                  }}
                />
              </>
            ) : null}
          </article>
        </div>
      </div>
    </div>
  )
}
