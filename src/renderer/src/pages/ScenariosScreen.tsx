import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_SCENARIOS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { PROCESSING_NAV } from './processing-ref1-data'
import {
  SCENARIO_CARDS,
  SCENARIO_RECENT_RUNS,
  SCENARIO_RUNS_SUMMARY,
  SCENARIOS_ACTIVE_NAV,
  SCENARIOS_CENTER_SUMMARY,
  SCENARIOS_FILTER_PILLS,
  SCENARIOS_PAGINATION_SUMMARY,
  SCENARIOS_STATUS_READY,
  SCENARIOS_STATUS_ROWS
} from './scenarios-ref7-data'
import { ScenarioCardView, ScenarioDetailRail, ScenarioRunRow } from './scenarios-ref7-parts'

/** ref.7 — Сценарии / workflow catalog (mock; not sign-off). */
export function ScenariosScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="scenarios-shell" id="ref7" data-ref={VELORIX_NEON_REFERENCE_SCENARIOS_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_SCENARIOS_REL} />
        ) : null}
        <aside className="scenarios-sidebar" aria-label="Навигация">
          <div className="scenarios-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div className="processing-sidebar__brand-text">
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
            <span className="processing-sidebar__brand-edition">PRO</span>
          </div>
          <section className="scenarios-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === SCENARIOS_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === SCENARIOS_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="scenarios-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="scenarios-sidebar__gpu-stats">
              Загрузка: 72% · Температура: 58°C · Память: 17.2/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="scenarios-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">Система</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>18%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>37%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Disk</span>
                <em>42%</em>
              </div>
            </div>
            <div className="processing-sidebar__utilities scenarios-sidebar__utilities">
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
                className="processing-util-btn processing-util-btn--notify processing-glyph"
                disabled
                title="Уведомления"
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

        <section className="scenarios-center" aria-label="Сценарии">
          <header className="scenarios-center__head">
            <div className="scenarios-center__head-main">
              <p className="scenarios-center__eyebrow">Сценарии · workflow</p>
              <h1>Сценарии</h1>
              <p>Автоматизация сложных задач обработки видео и мультимедиа</p>
            </div>
            <div className="scenarios-center__head-tools">
              <span className="scenarios-center__head-chip">24 scenarios</span>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Импорт сценария
              </button>
              <button type="button" className="vn-btn vn-btn--primary" disabled>
                + Новый сценарий
              </button>
            </div>
          </header>
          <p className="scenarios-center__summary">{SCENARIOS_CENTER_SUMMARY}</p>
          <div className="scenarios-center__scroll">
            <div className="scenarios-center__toolbar">
              <input
                type="search"
                className="vn-input scenarios-center__search"
                placeholder="Поиск сценариев… Ctrl+K"
                disabled
              />
              <button type="button" className="scenarios-toolbar-btn" disabled title="Сетка">
                <span
                  className="scenario-glyph scenario-glyph--grid processing-glyph"
                  aria-hidden
                />
              </button>
              <button type="button" className="scenarios-toolbar-btn" disabled title="Список">
                <span
                  className="scenario-glyph scenario-glyph--list processing-glyph"
                  aria-hidden
                />
              </button>
              <span className="scenarios-filter-select" aria-disabled>
                По дате (новые) ▾
              </span>
            </div>
            <div className="scenarios-center__pills">
              {SCENARIOS_FILTER_PILLS.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  className={
                    'active' in pill && pill.active
                      ? 'scenarios-pill scenarios-pill--active'
                      : 'scenarios-pill'
                  }
                  disabled
                >
                  {pill.label} {pill.count}
                </button>
              ))}
            </div>
            <div className="scenarios-center__grid">
              {SCENARIO_CARDS.map((card) => (
                <ScenarioCardView key={card.id} card={card} />
              ))}
            </div>
            <section className="scenarios-runs vn-surface-glass" aria-label="Последние выполнения">
              <header className="scenarios-runs__head">
                <h2>Последние выполнения</h2>
                <div className="scenarios-runs__head-end">
                  <span className="scenarios-runs__summary">{SCENARIO_RUNS_SUMMARY}</span>
                  <button type="button" className="scenarios-runs__link" disabled>
                    Показать все
                  </button>
                </div>
              </header>
              <table className="scenario-runs">
                <thead>
                  <tr>
                    <th>Сценарий</th>
                    <th>Статус</th>
                    <th>Прогресс</th>
                    <th>Начало</th>
                    <th>Длительность</th>
                    <th>Результат</th>
                  </tr>
                </thead>
                <tbody>
                  {SCENARIO_RECENT_RUNS.map((run) => (
                    <ScenarioRunRow key={run.id} run={run} />
                  ))}
                </tbody>
              </table>
            </section>
          </div>
          <footer className="scenarios-pagination-sticky">
            <span className="scenarios-pagination__summary">{SCENARIOS_PAGINATION_SUMMARY}</span>
            <div className="scenarios-pagination__nav">
              <button
                type="button"
                className="scenarios-pagination__arrow"
                disabled
                aria-label="Предыдущая страница"
              >
                ‹
              </button>
              <div className="scenarios-pagination__pages" aria-hidden>
                <span className="scenarios-pagination__page scenarios-pagination__page--active">
                  1
                </span>
                <span className="scenarios-pagination__page">2</span>
                <span className="scenarios-pagination__page">3</span>
                <span className="scenarios-pagination__ellipsis">…</span>
                <span className="scenarios-pagination__page">8</span>
              </div>
              <button
                type="button"
                className="scenarios-pagination__arrow"
                disabled
                aria-label="Следующая страница"
              >
                ›
              </button>
            </div>
            <label className="scenarios-pagination__rows">
              <span>На странице</span>
              <span className="scenarios-filter-select" aria-disabled>
                9 ▾
              </span>
            </label>
          </footer>
        </section>

        <ScenarioDetailRail />

        <footer className="scenarios-statusbar" aria-label="Статус">
          <span className="scenarios-statusbar__ready">
            <span className="scenarios-statusbar__dot" aria-hidden />
            {SCENARIOS_STATUS_READY}
          </span>
          <div className="scenarios-statusbar__center">
            {SCENARIOS_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`scenarios-statusbar__item${row.accent ? ` scenarios-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="scenarios-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
