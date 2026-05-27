import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_KNOWLEDGE_REL } from '../../../../shared/velorix-neon-theme-tokens'

const ARTICLES = [
  { id: 'a1', title: 'Первый экспорт', category: 'Старт' },
  { id: 'a2', title: 'Настройка FFmpeg', category: 'Обработка' },
  { id: 'a3', title: 'yt-dlp и загрузки', category: 'Загрузки' }
] as const

export function KnowledgeScreen(): JSX.Element {
  return (
    <div className="portal-screen knowledge-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">База знаний</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_KNOWLEDGE_REL}</p>
      </header>
      <div className="knowledge-screen__layout">
        <aside className="knowledge-screen__catalog vn-surface-glass">
          <input type="search" className="app-input" placeholder="Поиск по Help…" />
          <ul className="knowledge-screen__list">
            {ARTICLES.map((article, index) => (
              <li key={article.id}>
                <button
                  type="button"
                  className={`knowledge-screen__item${index === 0 ? ' knowledge-screen__item--active' : ''}`}
                >
                  <span>{article.title}</span>
                  <small>{article.category}</small>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <article className="knowledge-screen__preview vn-surface-glass">
          <h2>Первый экспорт</h2>
          <p>Откройте медиа, задайте диапазон на таймлайне и запустите экспорт из правого rail.</p>
        </article>
      </div>
    </div>
  )
}

export function KnowledgeRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Навигация</h2>
      <button type="button" className="app-btn app-btn-secondary">
        Ctrl+K
      </button>
      <p className="portal-rail__hint">AI-вход и вложения — отдельный продуктовый срез.</p>
    </aside>
  )
}
