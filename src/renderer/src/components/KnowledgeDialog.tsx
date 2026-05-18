import { useEffect, useId, useMemo, useState } from 'react'
import type { JSX } from 'react'

import type { KnowledgeArticleListItem } from '../../../shared/knowledge-contract'
import { parseKnowledgeMarkdown } from '../../../shared/knowledge-markdown'
import { groupKnowledgeArticlesByToc } from '../../../shared/knowledge-toc-registry'

import { KnowledgeMarkdownBody } from './KnowledgeMarkdownBody'
import { getUiLocale, uiText } from '../locales/ui-text'
import type { UiTextKey } from '../locales/ui-text-strings'

export function KnowledgeDialog({
  open,
  onClose,
  onStatus,
  initialSlug = null,
  localeVersion = 0
}: {
  open: boolean
  onClose: () => void
  onStatus?: (message: string) => void
  /** Если задан и есть в списке статей — выбрать при открытии вместо первой в TOC. */
  initialSlug?: string | null
  /** Инкремент при смене языка интерфейса: перечитать список и заголовки статей. */
  localeVersion?: number
}): JSX.Element | null {
  const [articles, setArticles] = useState<KnowledgeArticleListItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [markdownSource, setMarkdownSource] = useState('')
  const [readArticleMeta, setReadArticleMeta] = useState<KnowledgeArticleListItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const knowledgeSearchFieldId = useId()

  useEffect(() => {
    if (!open) {
      return
    }
    let disposed = false
    void Promise.resolve().then(async () => {
      setLoading(true)
      setError(null)
      const res = await window.fluxalloy.knowledge.listArticles({
        preferredUiLocale: getUiLocale()
      })
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
      const resolved = want && res.articles.some((a) => a.slug === want) ? want : null
      setSelectedSlug((current) => (resolved !== null ? resolved : (current ?? first)))
    })
    return () => {
      disposed = true
    }
  }, [initialSlug, localeVersion, onStatus, open])

  useEffect(() => {
    if (!open || selectedSlug === null) {
      return
    }
    let disposed = false
    void Promise.resolve().then(async () => {
      setLoading(true)
      setError(null)
      setReadArticleMeta(null)
      const res = await window.fluxalloy.knowledge.readArticle({
        slug: selectedSlug,
        preferredUiLocale: getUiLocale()
      })
      if (disposed) {
        return
      }
      setLoading(false)
      if (!res.ok) {
        setReadArticleMeta(null)
        setError(res.error)
        onStatus?.(res.error)
        return
      }
      setMarkdownSource(res.markdown)
      setReadArticleMeta(res.article)
    })
    return () => {
      disposed = true
    }
  }, [localeVersion, onStatus, open, selectedSlug])

  const selected = useMemo(
    () => articles.find((article) => article.slug === selectedSlug) ?? null,
    [articles, selectedSlug]
  )

  const articlePane = useMemo(() => {
    if (!open) {
      return null
    }
    if (readArticleMeta && readArticleMeta.slug === selectedSlug) {
      return readArticleMeta
    }
    return selected
  }, [open, readArticleMeta, selected, selectedSlug])

  const mdBlocks = useMemo(() => {
    if (!articlePane) {
      return []
    }
    return parseKnowledgeMarkdown(markdownSource, { articleTitle: articlePane.title })
  }, [articlePane, markdownSource])

  const visibleArticles = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (q.length === 0) {
      return articles
    }
    return articles.filter((article) =>
      `${article.title} ${article.slug} ${article.fileName}`.toLowerCase().includes(q)
    )
  }, [articles, filter])

  const tocSections = useMemo(() => groupKnowledgeArticlesByToc(visibleArticles), [visibleArticles])

  if (!open) {
    return null
  }

  const knowledgeArticleRegionLabelledBy =
    !loading && !error && articlePane ? 'knowledge-article-heading' : undefined

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
        aria-busy={loading}
        aria-labelledby="knowledge-title"
        aria-describedby="knowledge-dialog-hint"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <div
          className="app-modal-header-row"
          role="group"
          aria-label={uiText('knowledgeDialogHeaderRowAria')}
          aria-describedby="knowledge-dialog-hint"
          aria-busy={loading}
        >
          <div>
            <h2 id="knowledge-title" className="app-modal-title">
              {uiText('knowledgeTitle')}
            </h2>
            <p id="knowledge-dialog-hint" className="app-modal-hint">
              {uiText('knowledgeHint')}
            </p>
          </div>
          <div
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('knowledgeDialogActionsToolbarAria')}
            aria-describedby="knowledge-dialog-hint"
            aria-busy={loading}
          >
            <button
              type="button"
              className="app-btn"
              onClick={onClose}
              aria-label={uiText('knowledgeCloseButtonAria')}
              aria-describedby="knowledge-dialog-hint"
              title={uiText('knowledgeCloseTooltip')}
            >
              {uiText('closeButton')}
            </button>
          </div>
        </div>

        <div
          className="app-knowledge-grid"
          role="group"
          aria-label={uiText('knowledgeDialogGridAria')}
          aria-describedby="knowledge-dialog-hint"
          aria-busy={loading}
        >
          <aside
            className="app-knowledge-sidebar"
            aria-label={uiText('knowledgeTocAria')}
            aria-describedby="knowledge-dialog-hint"
            aria-busy={loading}
          >
            <label htmlFor={knowledgeSearchFieldId} className="app-visually-hidden">
              {uiText('knowledgeSearchInputAria')}
            </label>
            <input
              id={knowledgeSearchFieldId}
              className="app-input app-knowledge-search"
              value={filter}
              placeholder={uiText('knowledgeSearchPlaceholder')}
              title={uiText('knowledgeSearchTooltip')}
              aria-describedby="knowledge-dialog-hint"
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            />
            <div
              className="app-knowledge-list"
              role="group"
              aria-label={uiText('knowledgeTocListAria')}
              aria-describedby="knowledge-dialog-hint"
              aria-busy={loading}
            >
              {tocSections.map((section) => (
                <section
                  key={section.spec.id}
                  className="app-knowledge-toc-section"
                  aria-label={uiText(section.spec.titleKey as UiTextKey)}
                >
                  <h3 className="app-knowledge-toc-section-title">
                    {uiText(section.spec.titleKey as UiTextKey)}
                  </h3>
                  {section.articles.map((article) => (
                    <button
                      key={article.slug}
                      type="button"
                      className={
                        article.slug === selectedSlug
                          ? 'app-knowledge-item app-knowledge-item-active'
                          : 'app-knowledge-item'
                      }
                      aria-current={article.slug === selectedSlug ? 'page' : undefined}
                      aria-describedby="knowledge-dialog-hint"
                      title={`${article.fileName} · ${article.slug}`}
                      onClick={() => {
                        setSelectedSlug(article.slug)
                      }}
                    >
                      <strong>{article.title}</strong>
                      <span>{article.fileName}</span>
                    </button>
                  ))}
                </section>
              ))}
            </div>
          </aside>

          <article
            className="app-knowledge-article"
            role="region"
            aria-describedby="knowledge-dialog-hint"
            aria-busy={loading}
            aria-labelledby={knowledgeArticleRegionLabelledBy}
            aria-label={
              knowledgeArticleRegionLabelledBy === undefined
                ? uiText('knowledgeArticleRegionAria')
                : undefined
            }
          >
            {loading ? (
              <p
                className="app-modal-hint"
                role="status"
                aria-live="polite"
                aria-describedby="knowledge-dialog-hint"
              >
                {uiText('loading')}
              </p>
            ) : null}
            {error ? (
              <p
                className="app-modal-hint app-error-text"
                role="alert"
                aria-describedby="knowledge-dialog-hint"
              >
                {error}
              </p>
            ) : null}
            {!loading && !error && articlePane ? (
              <>
                <h3 id="knowledge-article-heading">{articlePane.title}</h3>
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
