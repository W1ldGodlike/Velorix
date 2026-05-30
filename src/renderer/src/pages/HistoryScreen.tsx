import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import { VELORIX_NEON_REFERENCE_HISTORY_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  HISTORY_ACTIVE_NAV,
  HISTORY_DOMAIN_TABS,
  HISTORY_DONUT_SEGMENTS,
  HISTORY_PAGINATION_SUMMARY,
  HISTORY_RECENT_ERRORS,
  HISTORY_ROWS,
  HISTORY_STATUS_READY,
  HISTORY_STATUS_ROWS,
  HISTORY_TOTAL_EVENTS_LABEL
} from './history-ref3-data'
import { HistoryTableRow } from './history-ref3-parts'
import { PROCESSING_NAV } from './processing-ref1-data'

/** ref.3 — История / global audit log (mock; not sign-off). */
export function HistoryScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="history-shell" id="ref3" data-ref={VELORIX_NEON_REFERENCE_HISTORY_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_HISTORY_REL} />
        ) : null}
        <aside className="history-sidebar" aria-label="Навигация">
          <NeonSidebarBrand className="history-sidebar__brand processing-sidebar__brand" />

          <section className="history-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === HISTORY_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === HISTORY_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="history-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="history-sidebar__gpu-stats">Загрузка: 67% · Температура: 58°C</p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="history-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">СИСТЕМА</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>16%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>42%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Диск</span>
                <em>38%</em>
              </div>
            </div>
          </section>
          <div className="history-sidebar__footer processing-sidebar__footer">
            <button
              type="button"
              className="processing-util-btn processing-util-btn--settings processing-glyph"
              disabled
              title="Настройки"
            />
            <button
              type="button"
              className="processing-util-btn processing-util-btn--tools processing-glyph"
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

        <section className="history-center" aria-label="История">
          <header className="history-center__head history-center__head--png">
            <h1>История</h1>
            <p>Полная история всех операций и активностей в системе</p>
          </header>
          <div className="history-center__toolbar">
            <input
              type="search"
              className="vn-input history-center__search"
              placeholder="Поиск в истории… Ctrl+F"
              disabled
            />
            <button type="button" className="history-toolbar-btn" disabled title="Фильтры">
              <span
                className="history-head-glyph history-head-glyph--filter processing-glyph"
                aria-hidden
              />
            </button>
            <button type="button" className="vn-btn vn-btn--secondary history-export-btn" disabled>
              <span
                className="history-head-glyph history-head-glyph--export processing-glyph"
                aria-hidden
              />
              Экспорт истории
            </button>
          </div>
          <div className="history-center__scroll">
            <div className="history-center__tabs">
              {HISTORY_DOMAIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    tab.id === 'all'
                      ? 'history-domain-tab history-domain-tab--active'
                      : 'history-domain-tab'
                  }
                  disabled
                >
                  {tab.label}
                  {'count' in tab && tab.count !== undefined ? (
                    <span className="history-domain-tab__count">{tab.count}</span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="history-center__filters vn-surface-glass">
              <span className="history-filter-select" aria-disabled>
                01.05.2024 – 31.05.2024 ▾
              </span>
              <span className="history-filter-select" aria-disabled>
                Все типы событий ▾
              </span>
              <span className="history-filter-select" aria-disabled>
                Все статусы ▾
              </span>
              <button
                type="button"
                className="vn-btn vn-btn--secondary history-filter-reset"
                disabled
              >
                Сбросить фильтры
              </button>
            </div>
            <div className="history-table-wrap vn-surface-glass">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Событие</th>
                    <th>Файл / проект</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>Дата и время</th>
                    <th>Длительность</th>
                    <th>Размер</th>
                    <th aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {HISTORY_ROWS.map((row) => (
                    <HistoryTableRow key={row.id} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <footer className="history-pagination-sticky">
            <span className="history-pagination__summary">{HISTORY_PAGINATION_SUMMARY}</span>
            <div className="history-pagination__nav">
              <button
                type="button"
                className="history-pagination__arrow"
                disabled
                aria-label="Назад"
              >
                ‹
              </button>
              <div className="history-pagination__pages" aria-hidden>
                <span className="history-pagination__page history-pagination__page--active">1</span>
                <span className="history-pagination__page">2</span>
                <span className="history-pagination__page">3</span>
                <span className="history-pagination__ellipsis">…</span>
                <span className="history-pagination__page">48</span>
                <span className="history-pagination__page">49</span>
              </div>
              <button
                type="button"
                className="history-pagination__arrow"
                disabled
                aria-label="Вперёд"
              >
                ›
              </button>
            </div>
            <label className="history-pagination__rows">
              <span>Показать:</span>
              <span className="history-filter-select" aria-disabled>
                25 ▾
              </span>
            </label>
          </footer>
        </section>

        <aside className="history-rail" aria-label="Аналитика">
          <div className="history-rail__scroll">
            <section className="history-rail__section vn-surface-glass">
              <h2 className="history-rail__title">Общая статистика</h2>
              <div className="history-donut" aria-hidden>
                <div className="history-donut__label">
                  <strong>{HISTORY_TOTAL_EVENTS_LABEL}</strong>
                  <span>событий</span>
                </div>
              </div>
              <ul className="history-donut__legend">
                {HISTORY_DONUT_SEGMENTS.map((seg) => (
                  <li
                    key={seg.label}
                    className={`history-donut__legend-item history-donut__legend-item--${seg.color}`}
                  >
                    <span>
                      {seg.label} {seg.count} · {seg.percent}%
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="history-rail__section vn-surface-glass">
              <h2 className="history-rail__title">Активность по времени</h2>
              <div className="history-rail__chart" aria-hidden>
                <span className="history-rail__chart-bars" />
                <span className="history-rail__chart-tip">31.05.2024 · 142 события</span>
              </div>
            </section>
            <section className="history-rail__section vn-surface-glass">
              <div className="history-rail__section-head">
                <h2 className="history-rail__title">Последние ошибки</h2>
                <button type="button" className="history-rail__link" disabled>
                  Все ошибки
                </button>
              </div>
              <ul className="history-errors">
                {HISTORY_RECENT_ERRORS.map((err) => (
                  <li key={err.id} className="history-errors__item">
                    <span className="history-error-glyph processing-glyph" aria-hidden />
                    <div className="history-errors__body">
                      <strong>{err.title}</strong>
                      <span>{err.file}</span>
                      <time>{err.time}</time>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section
            className="history-rail__quick-sticky vn-surface-glass"
            aria-label="Быстрые действия"
          >
            <h2 className="history-rail__title">Быстрые действия</h2>
            <div className="history-rail__quick">
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Очистить &gt; 30 дней
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Экспорт CSV
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Отчёт об ошибках
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Настройки истории
              </button>
            </div>
          </section>
        </aside>

        <footer className="history-statusbar" aria-label="Статус">
          <span className="history-statusbar__ready">
            <span className="history-statusbar__dot" aria-hidden />
            {HISTORY_STATUS_READY}
          </span>
          <div className="history-statusbar__center">
            {HISTORY_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`history-statusbar__item${row.accent ? ` history-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="history-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
