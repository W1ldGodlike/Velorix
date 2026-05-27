import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PLANNER_REL } from '../../../../shared/velorix-neon-theme-tokens'

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const
const HOURS = ['08:00', '12:00', '16:00', '20:00'] as const

export function PlannerScreen(): JSX.Element {
  return (
    <div className="planner-screen">
      <header className="planner-screen__head">
        <h1 className="planner-screen__title">Планировщик</h1>
        <p className="planner-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_PLANNER_REL}</p>
        <button type="button" className="app-btn app-btn-primary">
          Новая задача
        </button>
      </header>
      <div className="planner-grid vn-surface-glass" role="grid" aria-label="Неделя">
        <div className="planner-grid__corner" />
        {WEEK_DAYS.map((day) => (
          <div key={day} className="planner-grid__day-head">
            {day}
          </div>
        ))}
        {HOURS.flatMap((hour) => [
          <div key={`hour-${hour}`} className="planner-grid__hour">
            {hour}
          </div>,
          ...WEEK_DAYS.map((day) => (
            <div
              key={`${day}-${hour}`}
              className={`planner-grid__cell${day === 'Ср' && hour === '12:00' ? ' planner-grid__cell--active' : ''}`}
            />
          ))
        ])}
      </div>
    </div>
  )
}

export function PlannerRail(): JSX.Element {
  return (
    <aside className="planner-rail vn-surface-glass">
      <h2 className="planner-rail__title">Автоматизация</h2>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Сценарий</span>
        <select className="app-settings-select" defaultValue="export">
          <option value="export">Ночной экспорт</option>
          <option value="download">Загрузка плейлиста</option>
        </select>
      </label>
      <button type="button" className="app-btn app-btn-secondary">
        Запустить сейчас
      </button>
    </aside>
  )
}
