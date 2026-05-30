import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import { VELORIX_NEON_REFERENCE_PLANNER_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  PLANNER_ACTIVE_NAV,
  PLANNER_CALENDAR_ACTIVE_DAY,
  PLANNER_CALENDAR_DAYS,
  PLANNER_QUEUE,
  PLANNER_SCHEDULED_TASKS,
  PLANNER_STATS,
  PLANNER_STATUS_READY,
  PLANNER_STATUS_ROWS,
  PLANNER_TABS,
  PLANNER_TIMELINE_BLOCKS,
  PLANNER_WEEK_DAYS
} from './planner-ref4-data'
import {
  PlannerDetailPanel,
  PlannerQueueRow,
  PlannerTaskCard,
  PlannerWeekGrid
} from './planner-ref4-parts'
import { PROCESSING_NAV } from './processing-ref1-data'

/** ref.4 — Планировщик / task scheduler (mock; not sign-off). */
export function PlannerScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="planner-shell" id="ref4" data-ref={VELORIX_NEON_REFERENCE_PLANNER_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_PLANNER_REL} />
        ) : null}
        <aside className="planner-sidebar" aria-label="Навигация">
          <NeonSidebarBrand className="planner-sidebar__brand processing-sidebar__brand" />

          <section className="planner-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === PLANNER_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === PLANNER_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="planner-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="planner-sidebar__gpu-stats">
              Загрузка: 68% · Температура: 58°C · Память: 14.2/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="planner-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">СИСТЕМА</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>18%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>42%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Диск</span>
                <em>37%</em>
              </div>
            </div>
          </section>
          <div className="planner-sidebar__footer processing-sidebar__footer">
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

        <section className="planner-center" aria-label="Планировщик">
          <header className="planner-center__head planner-center__head--png">
            <h1>Планировщик</h1>
            <p>Управление запланированными задачами и автоматизацией</p>
          </header>
          <div className="planner-center__actions">
            <button type="button" className="vn-btn vn-btn--primary" disabled>
              + Создать задачу
            </button>
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Импорт задач
            </button>
          </div>
          <div className="planner-center__scroll">
            <div className="planner-center__tabs">
              {PLANNER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    tab.id === 'schedule' ? 'planner-tab planner-tab--active' : 'planner-tab'
                  }
                  disabled
                >
                  {tab.label}
                  {'count' in tab && tab.count !== undefined ? (
                    <span className="planner-tab__count">{tab.count}</span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="planner-center__toolbar vn-surface-glass">
              <span className="planner-filter-select" aria-disabled>
                Все задачи ▾
              </span>
              <span className="planner-filter-select" aria-disabled>
                По расписанию ▾
              </span>
              <span className="planner-filter-select planner-filter-select--date" aria-disabled>
                01.06.2024 – 07.06.2024 ▾
              </span>
              <button type="button" className="planner-toolbar-btn" disabled>
                ‹ Сегодня ›
              </button>
              <span className="planner-filter-select" aria-disabled>
                Неделя ▾
              </span>
              <button
                type="button"
                className="planner-toolbar-btn planner-toolbar-btn--grid"
                disabled
              >
                <span className="planner-toolbar-glyph planner-toolbar-glyph--grid processing-glyph" />
              </button>
              <input
                type="search"
                className="vn-input planner-center__search"
                placeholder="Поиск задач…"
                disabled
              />
            </div>
            <div className="planner-center__schedule">
              <div className="planner-task-list">
                <h2 className="planner-task-list__title">
                  Запланированные задачи ({PLANNER_SCHEDULED_TASKS.length})
                </h2>
                <div className="planner-task-list__scroll">
                  {PLANNER_SCHEDULED_TASKS.map((task) => (
                    <PlannerTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
              <div className="planner-timeline-wrap">
                <div className="planner-timeline__days" aria-hidden>
                  {PLANNER_WEEK_DAYS.map((day) => (
                    <span
                      key={day.id}
                      className={
                        'today' in day && day.today
                          ? 'planner-timeline__day planner-timeline__day--today'
                          : 'planner-timeline__day'
                      }
                    >
                      {day.label} {day.date}
                    </span>
                  ))}
                </div>
                <PlannerWeekGrid blocks={PLANNER_TIMELINE_BLOCKS} />
              </div>
            </div>
          </div>
          <div className="planner-detail-sticky">
            <PlannerDetailPanel />
          </div>
        </section>

        <aside className="planner-rail" aria-label="Виджеты">
          <div className="planner-rail__scroll">
            <section className="planner-rail__section vn-surface-glass">
              <h2 className="planner-rail__title">Июнь 2024</h2>
              <div className="planner-mini-cal" aria-hidden>
                <span>Пн</span>
                <span>Вт</span>
                <span>Ср</span>
                <span>Чт</span>
                <span>Пт</span>
                <span>Сб</span>
                <span>Вс</span>
                {PLANNER_CALENDAR_DAYS.map((day, idx) =>
                  day === null ? (
                    <span key={`e-${idx}`} className="planner-mini-cal__empty" />
                  ) : (
                    <span
                      key={day}
                      className={
                        day === PLANNER_CALENDAR_ACTIVE_DAY
                          ? 'planner-mini-cal__day planner-mini-cal__day--active'
                          : 'planner-mini-cal__day'
                      }
                    >
                      {day}
                    </span>
                  )
                )}
              </div>
            </section>
            <section className="planner-rail__section vn-surface-glass">
              <h2 className="planner-rail__title">Очередь выполнения ({PLANNER_QUEUE.length})</h2>
              <ul className="planner-queue">
                {PLANNER_QUEUE.map((item) => (
                  <PlannerQueueRow key={item.id} item={item} />
                ))}
              </ul>
            </section>
            <section className="planner-rail__section vn-surface-glass">
              <h2 className="planner-rail__title">Статистика недели</h2>
              <div className="planner-stats">
                <div className="planner-stats__row">
                  <span>
                    <strong>{PLANNER_STATS.done}</strong> выполнено
                  </span>
                  <em>{PLANNER_STATS.doneDelta}</em>
                </div>
                <div className="planner-stats__row">
                  <span>
                    <strong>{PLANNER_STATS.success}</strong> успешно
                  </span>
                  <em>{PLANNER_STATS.successRate}</em>
                </div>
                <div className="planner-stats__row">
                  <span>
                    <strong>{PLANNER_STATS.errors}</strong> ошибки
                  </span>
                  <em>{PLANNER_STATS.errorRate}</em>
                </div>
              </div>
              <div className="planner-stats__chart" aria-hidden>
                <span className="planner-stats__chart-bars" />
              </div>
            </section>
          </div>
          <section
            className="planner-rail__quick-sticky vn-surface-glass"
            aria-label="Быстрые действия"
          >
            <h2 className="planner-rail__title">Быстрые действия</h2>
            <div className="planner-rail__quick">
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Создать задачу
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Создать шаблон
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Импорт задач
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Настройки планировщика
              </button>
            </div>
          </section>
        </aside>

        <footer className="planner-statusbar" aria-label="Статус">
          <span className="planner-statusbar__ready">
            <span className="planner-statusbar__dot" aria-hidden />
            {PLANNER_STATUS_READY}
          </span>
          <div className="planner-statusbar__center">
            {PLANNER_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`planner-statusbar__item${row.accent ? ` planner-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="planner-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
