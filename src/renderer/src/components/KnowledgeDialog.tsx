import { useEffect, useMemo, useState } from 'react'
import type { JSX } from 'react'

import type { KnowledgeArticleListItem } from '../../../shared/knowledge-contract'

function markdownPreview(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\t/g, '  '))
    .join('\n')
}

export function KnowledgeDialog({
  open,
  onClose,
  onStatus
}: {
  open: boolean
  onClose: () => void
  onStatus?: (message: string) => void
}): JSX.Element | null {
  const [articles, setArticles] = useState<KnowledgeArticleListItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [markdown, setMarkdown] = useState('')
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
      setSelectedSlug((current) => current ?? res.articles[0]?.slug ?? null)
    })
    return () => {
      disposed = true
    }
  }, [onStatus, open])

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
      setMarkdown(markdownPreview(res.markdown))
    })
    return () => {
      disposed = true
    }
  }, [onStatus, open, selectedSlug])

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

  const selected = articles.find((article) => article.slug === selectedSlug) ?? null

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
              База знаний
            </h2>
            <p className="app-modal-hint">
              Локальные статьи из <code>Help/*.md</code>, доступны без браузера и внешних ссылок.
            </p>
          </div>
          <button type="button" className="app-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <div className="app-knowledge-grid">
          <aside className="app-knowledge-sidebar" aria-label="Оглавление справки">
            <input
              className="app-input app-knowledge-search"
              value={filter}
              placeholder="Поиск по статьям"
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
            {loading ? <p className="app-modal-hint">Загрузка…</p> : null}
            {error ? <p className="app-modal-hint app-error-text">{error}</p> : null}
            {!loading && !error && selected ? (
              <>
                <h3>{selected.title}</h3>
                <pre className="app-knowledge-markdown">{markdown}</pre>
              </>
            ) : null}
          </article>
        </div>
      </div>
    </div>
  )
}
