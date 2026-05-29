import type { CSSProperties, JSX } from 'react'

import type {
  PlannerQueueItem,
  PlannerScheduledTask,
  PlannerTimelineBlock
} from './planner-ref4-data'
import {
  PLANNER_NOW_MARKER,
  PLANNER_SELECTED_DETAIL,
  PLANNER_TIMELINE_HOURS
} from './planner-ref4-data'

export function PlannerTaskCard(props: { task: PlannerScheduledTask }): JSX.Element {
  const { task } = props
  return (
    <article
      className={
        task.selected
          ? 'planner-task-card planner-task-card--selected vn-surface-glass'
          : 'planner-task-card vn-surface-glass'
      }
    >
      <span
        className={`planner-task-glyph planner-task-glyph--${task.kind} processing-glyph`}
        aria-hidden
      />
      <div className="planner-task-card__body">
        <strong>{task.title}</strong>
        <span>{task.subtitle}</span>
        <em>{task.schedule}</em>
      </div>
      <span
        className={
          task.active
            ? 'planner-task-card__status planner-task-card__status--active'
            : 'planner-task-card__status'
        }
      >
        <span className="planner-status-dot processing-glyph" aria-hidden />
        {task.active ? 'Активна' : 'Выкл.'}
      </span>
    </article>
  )
}

function blockStyle(block: PlannerTimelineBlock): CSSProperties {
  const rowHeight = 100 / 12
  return {
    ['--planner-day' as string]: block.dayIndex,
    top: `${(block.startRow - 1) * rowHeight}%`,
    height: `${block.spanRows * rowHeight}%`
  }
}

export function PlannerWeekGrid(props: { blocks: readonly PlannerTimelineBlock[] }): JSX.Element {
  const { blocks } = props
  const nowStyle: CSSProperties = {
    ['--planner-day' as string]: PLANNER_NOW_MARKER.dayIndex,
    top: `${PLANNER_NOW_MARKER.percent}%`
  }
  return (
    <div className="planner-timeline vn-surface-glass">
      <div className="planner-timeline__hours" aria-hidden>
        {PLANNER_TIMELINE_HOURS.map((hour) => (
          <span key={hour} className="planner-timeline__hour">
            {hour}
          </span>
        ))}
      </div>
      <div className="planner-timeline__grid">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`planner-timeline__block planner-timeline__block--${block.color}`}
            style={blockStyle(block)}
          >
            {block.label}
          </div>
        ))}
        <div className="planner-timeline__now" style={nowStyle} aria-hidden>
          <span className="planner-timeline__now-label">{PLANNER_NOW_MARKER.label}</span>
        </div>
      </div>
    </div>
  )
}

export function PlannerDetailPanel(): JSX.Element {
  const d = PLANNER_SELECTED_DETAIL
  return (
    <section className="planner-detail vn-surface-glass" aria-label="Детали задачи">
      <div className="planner-detail__main">
        <span
          className={`planner-task-glyph planner-task-glyph--${d.kind} processing-glyph`}
          aria-hidden
        />
        <div>
          <h2>{d.title}</h2>
          <p>{d.description}</p>
          <dl className="planner-detail__meta">
            <div>
              <dt>След. запуск</dt>
              <dd>{d.nextRun}</dd>
            </div>
            <div>
              <dt>Длительность</dt>
              <dd>{d.duration}</dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>{d.status}</dd>
            </div>
          </dl>
          <dl className="planner-detail__params">
            <div>
              <dt>Формат</dt>
              <dd>{d.format}</dd>
            </div>
            <div>
              <dt>Разрешение</dt>
              <dd>{d.resolution}</dd>
            </div>
            <div>
              <dt>Битрейт</dt>
              <dd>{d.bitrate}</dd>
            </div>
            <div>
              <dt>Путь</dt>
              <dd>{d.path}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="planner-detail__actions">
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Редактировать
        </button>
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Запустить сейчас
        </button>
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Отключить
        </button>
        <button type="button" className="vn-btn planner-detail__delete" disabled>
          Удалить
        </button>
      </div>
    </section>
  )
}

export function PlannerQueueRow(props: { item: PlannerQueueItem }): JSX.Element {
  const { item } = props
  return (
    <li className="planner-queue__row">
      <div className="planner-queue__head">
        <strong>{item.title}</strong>
        <span>{item.percent}%</span>
      </div>
      <div className="planner-queue__bar" aria-hidden>
        <span className="planner-queue__fill" style={{ width: `${item.percent}%` }} />
      </div>
      <div className="planner-queue__controls" aria-hidden>
        <button type="button" className="planner-queue__btn" disabled title="Пауза">
          <span className="planner-queue-glyph planner-queue-glyph--pause processing-glyph" />
        </button>
        <button type="button" className="planner-queue__btn" disabled title="Стоп">
          <span className="planner-queue-glyph planner-queue-glyph--stop processing-glyph" />
        </button>
      </div>
    </li>
  )
}
