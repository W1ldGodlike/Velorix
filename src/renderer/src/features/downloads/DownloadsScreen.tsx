import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_DOWNLOADS_REL } from '../../../../shared/velorix-neon-theme-tokens'

type DownloadRow = {
  id: string
  title: string
  source: string
  quality: string
  progress: number
  downloaded: string
  total: string
  speed: string
  eta: string
}

const ACTIVE_DOWNLOADS: DownloadRow[] = [
  {
    id: 'd1',
    title: 'Cyberpunk 2077 — Official Trailer',
    source: 'youtube.com',
    quality: '4K · HEVC',
    progress: 45,
    downloaded: '2.1 GB',
    total: '4.97 GB',
    speed: '12.6 MB/s',
    eta: '03:42'
  },
  {
    id: 'd2',
    title: 'Nature 4K — Forest Ambience',
    source: 'youtube.com',
    quality: '4K · HDR',
    progress: 72,
    downloaded: '1.8 GB',
    total: '2.5 GB',
    speed: '18.2 MB/s',
    eta: '01:15'
  },
  {
    id: 'd3',
    title: 'Black Myth: Wukong — Gameplay',
    source: 'vimeo.com',
    quality: '1080p',
    progress: 18,
    downloaded: '420 MB',
    total: '2.3 GB',
    speed: '8.4 MB/s',
    eta: '08:20'
  }
]

const QUEUE_ROWS = ['Documentary — Arctic (1080p)', 'Lo-Fi Mix — 3 hours'] as const

const FILTER_TABS = [
  { id: 'all', label: 'Все', count: null },
  { id: 'active', label: 'Активные', count: 5 },
  { id: 'done', label: 'Завершённые', count: 142 },
  { id: 'error', label: 'Ошибки', count: 3 },
  { id: 'pause', label: 'Пауза', count: null }
] as const

export function DownloadsScreen(): JSX.Element {
  return (
    <div className="downloads-screen">
      <header className="downloads-screen__head">
        <div>
          <h1 className="downloads-screen__title">Менеджер загрузок</h1>
          <p className="downloads-screen__subtitle">
            Эталон: {VELORIX_NEON_REFERENCE_DOWNLOADS_REL}
          </p>
        </div>
        <div className="downloads-screen__head-actions">
          <button type="button" className="app-btn app-btn-primary">
            Добавить
          </button>
          <button type="button" className="app-btn app-btn-secondary">
            Запустить все
          </button>
          <button type="button" className="app-btn">
            Пауза все
          </button>
        </div>
      </header>

      <div className="downloads-screen__toolbar vn-surface-glass">
        <input
          type="search"
          className="app-input downloads-screen__search"
          placeholder="Поиск загрузок…"
        />
        <div className="downloads-screen__filters" role="tablist">
          {FILTER_TABS.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`downloads-screen__filter${index === 1 ? ' downloads-screen__filter--active' : ''}`}
            >
              {tab.label}
              {tab.count != null ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="downloads-screen__list">
        {ACTIVE_DOWNLOADS.map((row, index) => (
          <article
            key={row.id}
            className={`downloads-card vn-surface-glass${index === 0 ? ' downloads-card--selected' : ''}`}
          >
            <div className="downloads-card__thumb" aria-hidden />
            <div className="downloads-card__body">
              <div className="downloads-card__title-row">
                <strong>{row.title}</strong>
                <span className="app-ui-showcase-badge app-ui-showcase-badge--accent">
                  {row.quality}
                </span>
              </div>
              <span className="downloads-card__source">{row.source}</span>
              <div className="downloads-card__progress-row">
                <div className="app-ui-showcase-progress-track">
                  <span
                    className="app-ui-showcase-progress-fill"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>
                <span>{row.progress}%</span>
              </div>
              <div className="downloads-card__meta">
                <span>
                  {row.downloaded} / {row.total}
                </span>
                <span>{row.speed}</span>
                <span>~{row.eta}</span>
              </div>
            </div>
            <div className="downloads-card__actions">
              <button type="button" className="app-ui-showcase-icon-btn" aria-label="Пауза">
                ❚❚
              </button>
              <button type="button" className="app-ui-showcase-icon-btn" aria-label="Отмена">
                ×
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="downloads-screen__queue vn-surface-glass">
        <h2 className="downloads-screen__queue-title">Очередь (2)</h2>
        <ul className="downloads-screen__queue-list">
          {QUEUE_ROWS.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
        <footer className="downloads-screen__queue-foot">
          <span>Параллельно: 5</span>
          <span>Лимит: без ограничения</span>
          <span>D:\Velorix\Downloads</span>
        </footer>
      </section>
    </div>
  )
}

export function DownloadsRail(): JSX.Element {
  return (
    <aside className="downloads-rail">
      <section className="downloads-rail__section vn-surface-glass">
        <h2 className="downloads-rail__title">Детали загрузки</h2>
        <div className="downloads-rail__preview" aria-hidden />
        <dl className="downloads-rail__meta">
          <div>
            <dt>Качество</dt>
            <dd>2160p 4K</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>MP4 · H.265/HEVC</dd>
          </div>
          <div>
            <dt>Размер</dt>
            <dd>4.97 GB</dd>
          </div>
          <div>
            <dt>Путь</dt>
            <dd>D:\Velorix\Downloads\cyberpunk_trailer.mp4</dd>
          </div>
        </dl>
      </section>
      <section className="downloads-rail__section vn-surface-glass">
        <h2 className="downloads-rail__title">Статистика</h2>
        <ul className="downloads-rail__stats">
          <li>
            <span>Скачано</span>
            <strong>42.7 GB</strong>
          </li>
          <li>
            <span>Средняя скорость</span>
            <strong>18.6 MB/s</strong>
          </li>
          <li>
            <span>Время</span>
            <strong>01:42:37</strong>
          </li>
        </ul>
        <div className="downloads-rail__sparkline" aria-hidden>
          <span style={{ height: '40%' }} />
          <span style={{ height: '70%' }} />
          <span style={{ height: '55%' }} />
          <span style={{ height: '100%' }} />
          <span style={{ height: '60%' }} />
        </div>
      </section>
      <section className="downloads-rail__section vn-surface-glass">
        <h2 className="downloads-rail__title">Быстрые действия</h2>
        <div className="downloads-rail__actions">
          <button type="button" className="app-btn app-btn-primary">
            Добавить загрузку
          </button>
          <button type="button" className="app-btn app-btn-secondary">
            Из буфера
          </button>
          <button type="button" className="app-btn">
            Очистить завершённые
          </button>
        </div>
      </section>
    </aside>
  )
}
