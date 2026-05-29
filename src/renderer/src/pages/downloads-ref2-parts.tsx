import type { JSX } from 'react'

import type { DownloadRowMock } from './downloads-ref2-data'

export function DownloadCard(props: { row: DownloadRowMock }): JSX.Element {
  const { row } = props
  return (
    <article
      className={`downloads-card vn-surface-glass${row.selected ? ' downloads-card--selected' : ''}`}
    >
      <div className="downloads-card__thumb" aria-hidden>
        <span className="downloads-card__thumb-film" />
        <span className="downloads-card__badges">
          {row.badges.map((badge) => (
            <span key={badge} className="downloads-card__badge">
              {badge}
            </span>
          ))}
        </span>
      </div>
      <div className="downloads-card__body">
        <h3 className="downloads-card__title">{row.title}</h3>
        <p className="downloads-card__source">
          <span className={`downloads-card__platform downloads-card__platform--${row.platform}`} />
          {row.source}
        </p>
        <div className="downloads-card__progress">
          <span
            className="downloads-card__progress-fill"
            style={{ '--dl-p': `${String(row.percent)}%` } as Record<string, string>}
          />
        </div>
        <div className="downloads-card__meta">
          <span>{row.percent}%</span>
          <span>
            {row.downloaded} / {row.total}
          </span>
          <span>{row.speed}</span>
          <span>ETA {row.eta}</span>
        </div>
      </div>
      <div className="downloads-card__actions">
        <button
          type="button"
          className="vn-btn vn-btn--secondary vn-btn--icon"
          disabled
          title="Пауза"
        >
          <span className="downloads-glyph downloads-glyph--pause processing-glyph" />
        </button>
        <button
          type="button"
          className="vn-btn vn-btn--secondary vn-btn--icon"
          disabled
          title="Удалить"
        >
          <span className="downloads-glyph downloads-glyph--close processing-glyph" />
        </button>
      </div>
    </article>
  )
}

export function QueueCard(props: { title: string; badges: readonly string[] }): JSX.Element {
  const { title, badges } = props
  return (
    <div className="downloads-queue-card vn-surface-glass">
      <div className="downloads-queue-card__thumb" aria-hidden />
      <div>
        <p className="downloads-queue-card__title">{title}</p>
        <p className="downloads-queue-card__hint">Ожидает · скачивание в 1080p</p>
      </div>
      <span className="downloads-queue-card__badges">
        {badges.map((badge) => (
          <span key={badge} className="downloads-card__badge">
            {badge}
          </span>
        ))}
      </span>
    </div>
  )
}
