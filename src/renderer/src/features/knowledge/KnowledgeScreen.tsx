import { useEffect, useMemo, useState, type JSX } from 'react'

import {
  KNOWLEDGE_UI_HIDDEN_ARTICLE_SLUGS,
  type KnowledgeArticleListItem
} from '../../../../shared/knowledge-contract'
import { VELORIX_NEON_REFERENCE_KNOWLEDGE_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../../stores/app-shell-store'

import { KnowledgeMarkdownBody } from './KnowledgeMarkdownBody'

const HIDDEN_SLUGS = new Set<string>(KNOWLEDGE_UI_HIDDEN_ARTICLE_SLUGS)

export function KnowledgeScreen(): JSX.Element {
  const [articles, setArticles] = useState<KnowledgeArticleListItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    void (async () => {
      const list = window.velorix?.knowledge?.listArticles
      if (list == null) {
        setLoadError('knowledge.listArticles недоступен')
        return
      }
      const result = await list({ preferredUiLocale: 'ru' })
      if (!result.ok) {
        setLoadError(result.error)
        return
      }
      const visible = result.articles.filter((article) => !HIDDEN_SLUGS.has(article.slug))
      setArticles(visible)
      if (visible.length > 0) {
        setSelectedSlug(visible[0]!.slug)
      }
    })()
  }, [])

  useEffect(() => {
    if (selectedSlug == null) {
      return
    }
    const read = window.velorix?.knowledge?.readArticle
    if (read == null) {
      return
    }
    void read({ slug: selectedSlug, preferredUiLocale: 'ru' }).then((result) => {
      if (!result.ok) {
        setMarkdown('')
        setLoadError(result.error)
        return
      }
      setLoadError(null)
      setMarkdown(result.markdown)
    })
  }, [selectedSlug])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q.length === 0) {
      return articles
    }
    return articles.filter((article) => article.title.toLowerCase().includes(q))
  }, [articles, search])

  const selected = articles.find((article) => article.slug === selectedSlug)

  return (
    <div className="portal-screen knowledge-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">База знаний</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_KNOWLEDGE_REL}</p>
      </header>
      {loadError != null ? (
        <p className="portal-screen__subtitle knowledge-screen__error">{loadError}</p>
      ) : null}
      <div className="knowledge-screen__layout">
        <aside className="knowledge-screen__catalog vn-surface-glass">
          <input
            type="search"
            className="app-input"
            placeholder="Поиск по Help…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="knowledge-screen__list">
            {filtered.map((article) => (
              <li key={article.slug}>
                <button
                  type="button"
                  className={`knowledge-screen__item${selectedSlug === article.slug ? ' knowledge-screen__item--active' : ''}`}
                  onClick={() => setSelectedSlug(article.slug)}
                >
                  <span>{article.title}</span>
                  <small>{article.slug}</small>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <article className="knowledge-screen__preview vn-surface-glass">
          <h2>{selected?.title ?? 'Статья'}</h2>
          {markdown.length > 0 ? (
            <KnowledgeMarkdownBody
              markdown={markdown}
              {...(selected?.title != null ? { articleTitle: selected.title } : {})}
              onSelectSlug={(slug) => setSelectedSlug(slug)}
            />
          ) : (
            <p className="knowledge-screen__loading">Загрузка…</p>
          )}
        </article>
      </div>
    </div>
  )
}

export function KnowledgeRail(): JSX.Element {
  const setCommandPaletteOpen = useAppShellStore((s) => s.setCommandPaletteOpen)
  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Навигация</h2>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        onClick={() => setCommandPaletteOpen(true)}
      >
        Ctrl+K
      </button>
      <p className="portal-rail__hint">Статьи из Help/ru через IPC.</p>
    </aside>
  )
}
