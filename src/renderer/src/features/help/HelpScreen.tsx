import { useEffect, useState, type JSX } from 'react'

import {
  KNOWLEDGE_UI_HIDDEN_ARTICLE_SLUGS,
  type KnowledgeArticleListItem
} from '../../../../shared/knowledge-contract'

import { useAppShellStore } from '../../stores/app-shell-store'

const HIDDEN_SLUGS = new Set<string>(KNOWLEDGE_UI_HIDDEN_ARTICLE_SLUGS)

export function HelpScreen(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const setPendingKnowledgeSlug = useAppShellStore((s) => s.setPendingKnowledgeSlug)
  const [articles, setArticles] = useState<KnowledgeArticleListItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

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
      setArticles(visible.slice(0, 12))
    })()
  }, [])

  return (
    <div className="portal-screen help-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Справка</h1>
        <p className="portal-screen__subtitle">
          Быстрый вход в Help — полный каталог во вкладке «База знаний» (ref.5).
        </p>
      </header>
      {loadError != null ? <p className="help-screen__error">{loadError}</p> : null}
      <div className="help-screen__list vn-surface-glass">
        <ul>
          {articles.map((article) => (
            <li key={article.slug}>
              <button
                type="button"
                className="help-screen__link"
                onClick={() => {
                  setPendingKnowledgeSlug(article.slug)
                  setWorkspaceTab('knowledge')
                }}
              >
                {article.title}
              </button>
            </li>
          ))}
        </ul>
        {articles.length === 0 && loadError == null ? (
          <p className="help-screen__empty">Загрузка статей…</p>
        ) : null}
      </div>
      <button
        type="button"
        className="app-btn app-btn-primary"
        onClick={() => setWorkspaceTab('knowledge')}
      >
        Открыть базу знаний
      </button>
    </div>
  )
}

export function HelpRail(): JSX.Element | null {
  return null
}
