import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import { VELORIX_NEON_REFERENCE_DOWNLOADS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  ACTIVE_DOWNLOADS,
  DOWNLOAD_FILTER_TABS,
  DOWNLOADS_ACTIVE_NAV,
  DOWNLOADS_ACTIVE_COUNT_LABEL,
  DOWNLOADS_STATS,
  DOWNLOADS_STATS_PERIOD,
  DOWNLOADS_STATUS,
  DOWNLOADS_STATUS_READY,
  DOWNLOADS_STATUS_ROWS,
  QUEUE_DOWNLOADS
} from './downloads-ref2-data'
import { DownloadCard, QueueCard } from './downloads-ref2-parts'
import { PROCESSING_NAV } from './processing-ref1-data'

const SELECTED_DOWNLOAD = ACTIVE_DOWNLOADS.find((row) => row.selected) ?? ACTIVE_DOWNLOADS[0]!

/** ref.2 — Загрузки / download manager (mock; not sign-off). */
export function DownloadsScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="downloads-shell" id="ref2" data-ref={VELORIX_NEON_REFERENCE_DOWNLOADS_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_DOWNLOADS_REL} />
        ) : null}
        <aside className="downloads-sidebar" aria-label="Навигация">
          <NeonSidebarBrand className="downloads-sidebar__brand processing-sidebar__brand" />

          <section className="downloads-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === DOWNLOADS_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === DOWNLOADS_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="downloads-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="downloads-sidebar__gpu-stats">Загрузка: 68% · Температура: 56°C</p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="downloads-sidebar__network vn-surface-glass" aria-label="Сеть">
            <h2 className="processing-sidebar__section-title">Сеть</h2>
            <div className="downloads-sidebar__network-row">
              <span>↓ 12.6 MB/s</span>
              <span>↑ 2.4 MB/s</span>
            </div>
            <div className="downloads-sidebar__network-sparks" aria-hidden>
              <span className="downloads-sidebar__network-spark downloads-sidebar__network-spark--down" />
              <span className="downloads-sidebar__network-spark downloads-sidebar__network-spark--up" />
            </div>
          </section>
          <div className="downloads-sidebar__footer processing-sidebar__footer">
            <button
              type="button"
              className="processing-util-btn processing-util-btn--settings processing-glyph"
              disabled
              title="Настройки"
            />
            <button
              type="button"
              className="downloads-util-btn downloads-util-btn--hex processing-glyph"
              disabled
              title="Инструменты"
            />
            <button
              type="button"
              className="processing-util-btn processing-util-btn--power processing-glyph"
              disabled
              title="Выход"
            />
          </div>
        </aside>

        <section className="downloads-center" aria-label="Менеджер загрузок">
          <header className="downloads-center__head downloads-center__head--png">
            <h1>Менеджер загрузок</h1>
            <p>Управление активными и завершёнными загрузками</p>
          </header>
          <div className="downloads-center__toolbar">
            <input
              type="search"
              className="vn-input downloads-center__search"
              placeholder="Поиск загрузок…"
              disabled
            />
            <button
              type="button"
              className="downloads-toolbar-btn downloads-toolbar-btn--filter processing-glyph"
              disabled
              title="Фильтры"
            />
            <button
              type="button"
              className="downloads-toolbar-btn processing-util-btn processing-util-btn--settings processing-glyph"
              disabled
              title="Настройки списка"
            />
          </div>
          <div className="downloads-center__scroll">
            <div className="downloads-center__filters">
              <div className="downloads-filter-tabs">
                {DOWNLOAD_FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={
                      tab.id === 'all'
                        ? 'downloads-filter-tab downloads-filter-tab--active'
                        : 'downloads-filter-tab'
                    }
                    disabled
                  >
                    {tab.label}
                    {'count' in tab && tab.count !== undefined ? (
                      <span className="downloads-filter-tab__count">{tab.count}</span>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="downloads-center__bulk">
                <p className="downloads-center__active-count">{DOWNLOADS_ACTIVE_COUNT_LABEL}</p>
                <button type="button" className="vn-btn vn-btn--primary" disabled>
                  Старт всех
                </button>
                <button type="button" className="vn-btn vn-btn--secondary" disabled>
                  Пауза всех
                </button>
              </div>
            </div>
            <div className="downloads-center__list">
              {ACTIVE_DOWNLOADS.map((row) => (
                <DownloadCard key={row.id} row={row} />
              ))}
            </div>
          </div>
          <section className="downloads-queue-sticky vn-surface-glass" aria-label="Очередь">
            <h2 className="downloads-queue-sticky__title">Очередь ({QUEUE_DOWNLOADS.length})</h2>
            <div className="downloads-queue-sticky__items">
              {QUEUE_DOWNLOADS.map((row) => (
                <QueueCard key={row.id} title={row.title} badges={row.badges} />
              ))}
            </div>
          </section>
          <footer
            className="downloads-center__footer vn-surface-glass"
            aria-label="Параметры загрузок"
          >
            <label className="downloads-center__footer-field">
              <span>Одновременных загрузок:</span>
              <span className="downloads-center__footer-select" aria-disabled>
                {DOWNLOADS_STATUS.parallel}
                <span aria-hidden> ▾</span>
              </span>
            </label>
            <label className="downloads-center__footer-field">
              <span>Лимит скорости:</span>
              <span className="downloads-center__footer-select" aria-disabled>
                {DOWNLOADS_STATUS.speedLimit}
                <span aria-hidden> ▾</span>
              </span>
            </label>
            <label className="downloads-center__footer-field downloads-center__footer-field--path">
              <span>Папка загрузок:</span>
              <span className="downloads-center__footer-path">{DOWNLOADS_STATUS.folder}</span>
              <span
                className="downloads-center__footer-folder processing-glyph"
                aria-hidden
                title="Папка"
              />
            </label>
          </footer>
        </section>

        <aside className="downloads-rail" aria-label="Детали">
          <div className="downloads-rail__scroll">
            <section className="downloads-rail__section vn-surface-glass">
              <h2 className="downloads-rail__title">Детали загрузки</h2>
              <div className="downloads-rail__preview" aria-hidden />
              <h3 className="downloads-rail__item-title">{SELECTED_DOWNLOAD.title}</h3>
              <dl className="downloads-rail__kv">
                <dt>Источник</dt>
                <dd>{SELECTED_DOWNLOAD.source}</dd>
                <dt>Качество</dt>
                <dd>2160p · 4K</dd>
                <dt>Формат</dt>
                <dd>MP4 · H.265/HEVC</dd>
                <dt>Размер</dt>
                <dd>{SELECTED_DOWNLOAD.total}</dd>
                <dt>Прогресс</dt>
                <dd>{SELECTED_DOWNLOAD.percent}%</dd>
                <dt>Скорость</dt>
                <dd>{SELECTED_DOWNLOAD.speed}</dd>
                <dt>Осталось</dt>
                <dd>{SELECTED_DOWNLOAD.eta}</dd>
                <dt>Добавлено</dt>
                <dd>29.05.2026 07:12</dd>
                <dt>Путь</dt>
                <dd className="downloads-rail__path">D:\Velorix\Downloads\Cyberpunk_4K.mp4</dd>
              </dl>
              <div className="downloads-rail__actions">
                <button type="button" className="vn-btn vn-btn--secondary" disabled>
                  Открыть папку
                </button>
                <button type="button" className="vn-btn vn-btn--secondary" disabled>
                  Копировать ссылку
                </button>
              </div>
            </section>
            <section className="downloads-rail__section vn-surface-glass">
              <div className="downloads-rail__stats-head">
                <h2 className="downloads-rail__title">Статистика</h2>
                <span className="downloads-rail__period" aria-disabled>
                  {DOWNLOADS_STATS_PERIOD}
                  <span aria-hidden> ▾</span>
                </span>
              </div>
              <dl className="downloads-rail__stats">
                <div>
                  <dt>Сегодня</dt>
                  <dd>{DOWNLOADS_STATS.todayGb}</dd>
                </div>
                <div>
                  <dt>Средняя</dt>
                  <dd>{DOWNLOADS_STATS.avgSpeed}</dd>
                </div>
                <div>
                  <dt>Пик</dt>
                  <dd>{DOWNLOADS_STATS.peakSpeed}</dd>
                </div>
              </dl>
              <p className="downloads-rail__stats-time">Время: {DOWNLOADS_STATS.timeSpent}</p>
              <div className="downloads-rail__chart" aria-hidden>
                <span className="downloads-rail__chart-bars" />
                <span className="downloads-rail__chart-label">24ч</span>
              </div>
            </section>
          </div>
          <section
            className="downloads-rail__quick-sticky vn-surface-glass"
            aria-label="Быстрые действия"
          >
            <h2 className="downloads-rail__title">Быстрые действия</h2>
            <div className="downloads-rail__quick">
              <button type="button" className="vn-btn vn-btn--primary" disabled>
                Добавить загрузку
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Импорт из буфера
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Очистить завершённые
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Настройки загрузок
              </button>
            </div>
          </section>
        </aside>

        <footer className="downloads-statusbar" aria-label="Статус">
          <span className="downloads-statusbar__ready">
            <span className="downloads-statusbar__dot" aria-hidden />
            {DOWNLOADS_STATUS_READY}
          </span>
          <div className="downloads-statusbar__center">
            {DOWNLOADS_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`downloads-statusbar__item${row.accent ? ` downloads-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="downloads-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
