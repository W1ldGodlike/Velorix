import type { JSX } from 'react'

import type { ToolsCardMock } from './tools-ref10-data'
import {
  TOOLS_LINKS,
  TOOLS_QUICK_ACTIONS,
  TOOLS_RECENT,
  TOOLS_RESOURCES,
  TOOLS_SHORTCUTS
} from './tools-ref10-data'

export function ToolsCardView(props: { card: ToolsCardMock }): JSX.Element {
  const { card } = props
  return (
    <article
      className={
        card.selected
          ? 'tools-card tools-card--selected vn-surface-glass'
          : 'tools-card vn-surface-glass'
      }
    >
      <span className={`tools-glyph tools-glyph--${card.kind} processing-glyph`} aria-hidden />
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <button type="button" className="tools-card__open" disabled>
        Открыть
      </button>
    </article>
  )
}

export function ToolsQuickActionsPanel(): JSX.Element {
  return (
    <section className="tools-quick vn-surface-glass" aria-label="Быстрые действия">
      <h2>Быстрые действия</h2>
      <ul>
        {TOOLS_QUICK_ACTIONS.map((item) => (
          <li key={item.id}>
            <button type="button" className="tools-quick__btn" disabled>
              <strong>{item.title}</strong>
              <span>{item.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ToolsUtilityRail(): JSX.Element {
  return (
    <aside className="tools-rail" aria-label="Ресурсы и быстрый доступ">
      <div className="tools-rail__scroll">
        <section className="tools-rail__section vn-surface-glass">
          <h2 className="tools-rail__title">Ресурсы системы</h2>
          {TOOLS_RESOURCES.map((res) => (
            <div key={res.id} className="tools-resource">
              <div className="tools-resource__head">
                <span>{res.label}</span>
                <em>{res.percent}%</em>
              </div>
              <div className="tools-resource__bar" aria-hidden>
                <span className="tools-resource__fill" style={{ width: `${res.percent}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="tools-rail__section vn-surface-glass">
          <h2 className="tools-rail__title">Быстрый доступ</h2>
          <ul className="tools-shortcuts">
            {TOOLS_SHORTCUTS.map((row) => (
              <li key={row.action}>
                <span>{row.action}</span>
                <kbd>{row.keys}</kbd>
              </li>
            ))}
          </ul>
        </section>
        <section className="tools-rail__section vn-surface-glass">
          <h2 className="tools-rail__title">Недавние действия</h2>
          <ul className="tools-recent">
            {TOOLS_RECENT.map((row) => (
              <li key={row.id}>
                <strong>{row.label}</strong>
                <time>{row.time}</time>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="tools-rail__links-sticky vn-surface-glass" aria-label="Ссылки и версия">
        <h2 className="tools-rail__title">Полезные ссылки</h2>
        <ul className="tools-links">
          {TOOLS_LINKS.map((link) => (
            <li key={link}>
              <button type="button" className="tools-links__btn" disabled>
                {link}
              </button>
            </li>
          ))}
        </ul>
        <footer className="tools-rail__version">
          <span>Текущая версия: 1.7.0</span>
          <button type="button" className="tools-rail__check" disabled>
            Проверить
          </button>
        </footer>
      </section>
    </aside>
  )
}
