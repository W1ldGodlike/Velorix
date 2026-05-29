import type { JSX } from 'react'

import type {
  KnowledgePopularCard,
  KnowledgeRecentRow,
  KnowledgeCategorySlug
} from './knowledge-ref5-data'
import { KNOWLEDGE_PREVIEW, KNOWLEDGE_SIDEBAR_CATEGORIES } from './knowledge-ref5-data'

export function KnowledgePopularCardView(props: { card: KnowledgePopularCard }): JSX.Element {
  const { card } = props
  return (
    <article
      className={`knowledge-popular-card knowledge-popular-card--${card.accent} vn-surface-glass`}
    >
      <span
        className={`knowledge-card-glyph knowledge-card-glyph--${card.accent} processing-glyph`}
        aria-hidden
      />
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <footer>
        <span>{card.readMin} мин чтения</span>
        <span>{card.views}</span>
      </footer>
    </article>
  )
}

export function KnowledgeCategoryItem(props: {
  slug: KnowledgeCategorySlug
  label: string
  count: number
}): JSX.Element {
  const { slug, label, count } = props
  return (
    <button type="button" className="knowledge-category-item" disabled>
      <span
        className={`knowledge-cat-glyph knowledge-cat-glyph--${slug} processing-glyph`}
        aria-hidden
      />
      <span className="knowledge-category-item__label">{label}</span>
      <span className="knowledge-category-item__count">{count}</span>
    </button>
  )
}

export function KnowledgeRecentRowView(props: { row: KnowledgeRecentRow }): JSX.Element {
  const { row } = props
  return (
    <tr
      className={
        row.selected
          ? 'knowledge-table__row knowledge-table__row--selected'
          : 'knowledge-table__row'
      }
    >
      <td className="knowledge-table__cell knowledge-table__cell--article">
        <span
          className={`knowledge-cat-glyph knowledge-cat-glyph--${row.categorySlug} processing-glyph`}
          aria-hidden
        />
        <div>
          <strong>{row.title}</strong>
          <span>{row.subtitle}</span>
        </div>
      </td>
      <td className="knowledge-table__cell">
        <span className={`knowledge-tag knowledge-tag--${row.categorySlug}`}>{row.category}</span>
      </td>
      <td className="knowledge-table__cell knowledge-table__cell--mono">{row.updated}</td>
      <td className="knowledge-table__cell knowledge-table__cell--mono">{row.views}</td>
    </tr>
  )
}

export function KnowledgePreviewRail(): JSX.Element {
  const p = KNOWLEDGE_PREVIEW
  return (
    <aside className="knowledge-preview" aria-label="Превью статьи">
      <div className="knowledge-preview__hero" aria-hidden />
      <div className="knowledge-preview__scroll">
        <div className="knowledge-preview__body vn-surface-glass">
          <h2>{p.title}</h2>
          <p>{p.description}</p>
          <dl className="knowledge-preview__meta">
            <div>
              <dt>Обновлено</dt>
              <dd>{p.updated}</dd>
            </div>
            <div>
              <dt>Автор</dt>
              <dd>{p.author}</dd>
            </div>
            <div>
              <dt>Время чтения</dt>
              <dd>{p.readMin} мин</dd>
            </div>
            <div>
              <dt>Просмотров</dt>
              <dd>{p.views}</dd>
            </div>
            <div>
              <dt>Категория</dt>
              <dd className="knowledge-preview__category">{p.category}</dd>
            </div>
          </dl>
          <ul className="knowledge-preview__tags">
            {p.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <section className="knowledge-preview__toc">
            <h3>Содержание</h3>
            <ol>
              {p.toc.map((item, idx) => (
                <li key={item}>
                  {idx + 1}. {item}
                </li>
              ))}
            </ol>
          </section>
          <section className="knowledge-preview__attachments">
            <h3>Прикреплённые файлы</h3>
            <ul>
              {p.attachments.map((file) => (
                <li key={file.id}>
                  <span
                    className={`knowledge-file-glyph knowledge-file-glyph--${file.kind} processing-glyph`}
                    aria-hidden
                  />
                  <span>{file.name}</span>
                  <em>{file.size}</em>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <div className="knowledge-preview__actions-sticky">
        <button type="button" className="vn-btn vn-btn--primary" disabled>
          <span
            className="knowledge-action-glyph knowledge-action-glyph--open processing-glyph"
            aria-hidden
          />
          Открыть статью
        </button>
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          <span
            className="knowledge-action-glyph knowledge-action-glyph--share processing-glyph"
            aria-hidden
          />
          Поделиться
        </button>
      </div>
    </aside>
  )
}

export function KnowledgeCategorySidebar(): JSX.Element {
  return (
    <nav className="knowledge-categories vn-surface-glass" aria-label="Категории">
      <h2 className="knowledge-categories__title">Категории</h2>
      {KNOWLEDGE_SIDEBAR_CATEGORIES.map((cat) => (
        <KnowledgeCategoryItem key={cat.slug} slug={cat.slug} label={cat.label} count={cat.count} />
      ))}
    </nav>
  )
}
