import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_HISTORY_REL } from '../../../../shared/velorix-neon-theme-tokens'

const EVENTS = [
  {
    title: 'Экспорт завершён',
    project: 'Project 001',
    when: '14.05.2026 18:42',
    tone: 'ready' as const
  },
  {
    title: 'Загрузка начата',
    project: 'Nature 4K',
    when: '14.05.2026 17:10',
    tone: 'info' as const
  },
  {
    title: 'Ошибка FFmpeg',
    project: 'Project 003',
    when: '13.05.2026 22:05',
    tone: 'error' as const
  }
]

export function HistoryScreen(): JSX.Element {
  return (
    <div className="history-screen">
      <header className="history-screen__head">
        <h1 className="history-screen__title">История</h1>
        <p className="history-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_HISTORY_REL}</p>
      </header>
      <div className="history-screen__feed">
        {EVENTS.map((event) => (
          <article key={event.when} className="history-event vn-surface-glass">
            <span
              className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${event.tone}`}
            >
              {event.title}
            </span>
            <strong>{event.project}</strong>
            <span className="history-event__when">{event.when}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export function HistoryRail(): JSX.Element {
  return (
    <aside className="history-rail vn-surface-glass">
      <h2 className="history-rail__title">Аналитика</h2>
      <ul className="history-rail__stats">
        <li>
          <span>Экспортов за неделю</span>
          <strong>24</strong>
        </li>
        <li>
          <span>Загрузок</span>
          <strong>18</strong>
        </li>
        <li>
          <span>Ошибок</span>
          <strong>2</strong>
        </li>
      </ul>
      <div className="app-ui-showcase-sparkline" aria-hidden>
        <span style={{ height: '30%' }} />
        <span style={{ height: '65%' }} />
        <span style={{ height: '45%' }} />
        <span style={{ height: '90%' }} />
        <span style={{ height: '50%' }} />
      </div>
    </aside>
  )
}
