import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_DOWNLOADS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  ACTIVE_DOWNLOADS,
  DOWNLOAD_FILTER_TABS,
  DOWNLOADS_ACTIVE_NAV,
  DOWNLOADS_STATS,
  DOWNLOADS_STATUS,
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
        <aside className="downloads-sidebar" aria-label="Навигация">
          <div className="downloads-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div>
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
          </div>
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
            <div className="processing-sidebar__utilities">
              <button
                type="button"
                className="processing-util-btn processing-util-btn--search processing-glyph"
                disabled
                title="Поиск"
              />
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
          </section>
        </aside>

        <section className="downloads-center" aria-label="Менеджер загрузок">
          <header className="downloads-center__head">
            <div>
              <h1>Менеджер загрузок</h1>
              <p>Управление активными и завершёнными загрузками</p>
            </div>
            <div className="downloads-center__head-tools">
              <input
                type="search"
                className="vn-input downloads-center__search"
                placeholder="Поиск загрузок…"
                disabled
              />
            </div>
          </header>
          <div className="downloads-center__filters">
            <div className="downloads-filter-tabs">
              {DOWNLOAD_FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    tab.id === 'active'
                      ? 'downloads-filter-tab downloads-filter-tab--active'
                      : 'downloads-filter-tab'
                  }
                  disabled
                >
                  {tab.label}
                  {'count' in tab ? (
                    <span className="downloads-filter-tab__count">{tab.count}</span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="downloads-center__bulk">
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
          <section className="downloads-queue" aria-label="Очередь">
            <h2 className="downloads-queue__title">Очередь ({QUEUE_DOWNLOADS.length})</h2>
            {QUEUE_DOWNLOADS.map((row) => (
              <QueueCard key={row.id} title={row.title} badges={row.badges} />
            ))}
          </section>
        </section>

        <aside className="downloads-rail" aria-label="Детали">
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
            <h2 className="downloads-rail__title">Статистика</h2>
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
              <span className="downloads-rail__chart-label">24ч</span>
            </div>
          </section>
          <section className="downloads-rail__section vn-surface-glass">
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

        <footer className="downloads-statusbar">
          <span>
            <strong>Одновременных загрузок:</strong> {DOWNLOADS_STATUS.parallel}
          </span>
          <span>
            <strong>Лимит скорости:</strong> {DOWNLOADS_STATUS.speedLimit}
          </span>
          <span>
            <strong>Папка загрузок:</strong> {DOWNLOADS_STATUS.folder}
          </span>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
