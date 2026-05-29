import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_KNOWLEDGE_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  KNOWLEDGE_ACTIVE_NAV,
  KNOWLEDGE_CATEGORY_PILLS,
  KNOWLEDGE_POPULAR,
  KNOWLEDGE_RECENT_ROWS
} from './knowledge-ref5-data'
import {
  KnowledgeCategorySidebar,
  KnowledgePopularCardView,
  KnowledgePreviewRail,
  KnowledgeRecentRowView
} from './knowledge-ref5-parts'
import { PROCESSING_NAV } from './processing-ref1-data'

/** ref.5 — База знаний / Help portal (mock; not sign-off). */
export function KnowledgeEmbeddedWorkspace(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="knowledge-shell" id="ref5" data-ref={VELORIX_NEON_REFERENCE_KNOWLEDGE_REL}>
        <aside className="knowledge-sidebar" aria-label="Навигация">
          <div className="knowledge-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div>
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
          </div>
          <section className="knowledge-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === KNOWLEDGE_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === KNOWLEDGE_ACTIVE_NAV ? 'page' : undefined}
                >
                  <span
                    className={`processing-nav__icon processing-nav__icon--${item.slug} processing-glyph`}
                    aria-hidden
                  />
                  {item.label}
                </span>
              ))}
            </nav>
          </section>
          <div className="knowledge-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="knowledge-sidebar__gpu-stats">
              Загрузка: 72% · Температура: 58°C · Память: 17.3/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="knowledge-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">Система</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>16%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>38%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Disk</span>
                <em>42%</em>
              </div>
            </div>
            <div className="processing-sidebar__utilities knowledge-sidebar__utilities">
              <button
                type="button"
                className="processing-util-btn processing-util-btn--settings processing-glyph"
                disabled
                title="Настройки"
              />
              <button
                type="button"
                className="planner-util-btn planner-util-btn--help processing-glyph"
                disabled
                title="Справка"
              />
              <button
                type="button"
                className="processing-util-btn processing-util-btn--power processing-glyph"
                disabled
                title="Выход"
              />
            </div>
          </section>
        </aside>

        <section className="knowledge-center" aria-label="База знаний">
          <header className="knowledge-center__head">
            <div>
              <h1>База знаний</h1>
              <p>Централизованная база знаний, руководств и документации</p>
            </div>
          </header>
          <div className="knowledge-center__search-row">
            <input
              type="search"
              className="vn-input knowledge-center__search"
              placeholder="Поиск в базе знаний… Ctrl+K"
              disabled
            />
            <button type="button" className="vn-btn vn-btn--primary knowledge-ai-btn" disabled>
              <span className="knowledge-ai-glyph processing-glyph" aria-hidden />
              AI-ассистент
            </button>
          </div>
          <div className="knowledge-center__pills">
            {KNOWLEDGE_CATEGORY_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={
                  'active' in pill && pill.active
                    ? 'knowledge-pill knowledge-pill--active'
                    : 'knowledge-pill'
                }
                disabled
              >
                {pill.label}
                {pill.count !== null ? ` ${pill.count}` : ''}
              </button>
            ))}
          </div>
          <section className="knowledge-popular" aria-label="Популярные статьи">
            <h2 className="knowledge-section-title">Популярные статьи</h2>
            <div className="knowledge-popular__grid">
              {KNOWLEDGE_POPULAR.map((card) => (
                <KnowledgePopularCardView key={card.id} card={card} />
              ))}
            </div>
          </section>
          <div className="knowledge-center__split">
            <KnowledgeCategorySidebar />
            <div className="knowledge-recent">
              <h2 className="knowledge-section-title">Недавно обновлённые</h2>
              <div className="knowledge-table-wrap vn-surface-glass">
                <table className="knowledge-table">
                  <thead>
                    <tr>
                      <th>Статья</th>
                      <th>Категория</th>
                      <th>Обновлено</th>
                      <th>Просмотры</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KNOWLEDGE_RECENT_ROWS.map((row) => (
                      <KnowledgeRecentRowView key={row.id} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
              <footer className="knowledge-center__pagination">
                <div className="knowledge-pagination__nav">
                  <button
                    type="button"
                    className="knowledge-pagination__arrow"
                    disabled
                    aria-label="Назад"
                  >
                    ‹
                  </button>
                  <div className="knowledge-pagination__pages" aria-hidden>
                    <span className="knowledge-pagination__page knowledge-pagination__page--active">
                      1
                    </span>
                    <span className="knowledge-pagination__page">2</span>
                    <span className="knowledge-pagination__page">3</span>
                    <span className="knowledge-pagination__ellipsis">…</span>
                    <span className="knowledge-pagination__page">16</span>
                  </div>
                  <button
                    type="button"
                    className="knowledge-pagination__arrow"
                    disabled
                    aria-label="Вперёд"
                  >
                    ›
                  </button>
                </div>
                <label className="knowledge-pagination__rows">
                  <span>Показать:</span>
                  <span className="knowledge-filter-select" aria-disabled>
                    10 ▾
                  </span>
                </label>
              </footer>
            </div>
          </div>
        </section>

        <KnowledgePreviewRail />
      </div>
    </NeonWindowChrome>
  )
}
