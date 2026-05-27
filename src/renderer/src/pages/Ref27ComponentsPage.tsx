import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL } from '../../../shared/velorix-neon-theme-tokens'

type StatusTone = 'ready' | 'processing' | 'attention' | 'error' | 'info'

const TABLE_ROWS: Array<{
  name: string
  status: string
  size: string
  date: string
  tone: StatusTone
}> = [
  { name: 'Project 001', status: 'Готово', size: '246 GB', date: '14.05.2026', tone: 'ready' },
  {
    name: 'Project 002',
    status: 'Обработка',
    size: '18.8 GB',
    date: '13.05.2026',
    tone: 'processing'
  },
  { name: 'Project 003', status: 'Ошибка', size: '8.7 GB', date: '12.05.2026', tone: 'error' },
  { name: 'Project 004', status: 'Внимание', size: '1.1 GB', date: '11.05.2026', tone: 'attention' }
]

const COMMAND_ROWS = [
  { label: 'Открыть медиа', shortcut: 'Ctrl+K' },
  { label: 'Повторить экспорт', shortcut: 'Ctrl+K' },
  { label: 'Открыть инспектор', shortcut: 'Ctrl+K' }
] as const

function StatusPill(props: { label: string; tone: StatusTone }): JSX.Element {
  const { label, tone } = props
  return (
    <span className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${tone}`}>
      {label}
    </span>
  )
}

function PillSwitch(props: { label: string; active: boolean; disabled?: boolean }): JSX.Element {
  const { label, active, disabled } = props
  return (
    <button
      type="button"
      className={`app-pill-switch${active ? ' app-pill-switch-on' : ''}`}
      disabled={disabled}
    >
      <span className="app-pill-switch-knob" aria-hidden />
      <span className="app-pill-switch-text">{label}</span>
    </button>
  )
}

/** ref.27 — UI Components / States (components grid only; ref.26 states — отдельный срез). */
export function Ref27ComponentsPage(): JSX.Element {
  return (
    <section
      className="app-tools-workspace-shell app-ui-showcase-shell"
      aria-label="UI Components"
      aria-describedby="ref27-hint"
    >
      <header className="app-tools-workspace-head">
        <div className="app-tools-workspace-copy">
          <h1 className="app-settings-title">UI Components / States</h1>
          <p id="ref27-hint" className="app-settings-subtitle">
            Эталон: {VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL} — rebuild UI ZERO (neon.1).
          </p>
        </div>
      </header>

      <div className="app-ui-showcase-grid" role="list">
        <section className="app-ui-showcase-card vn-surface-glass" role="listitem">
          <h2 className="app-ui-showcase-card-title">Элементы управления</h2>
          <div className="app-ui-showcase-controls-stack">
            <div className="app-ui-showcase-button-row">
              <button type="button" className="app-btn">
                Открыть медиа
              </button>
              <button type="button" className="app-btn app-btn-primary">
                Сохранить
              </button>
              <button type="button" className="app-btn">
                Копировать
              </button>
              <button type="button" className="app-btn app-btn-warn">
                Обновить
              </button>
            </div>
            <div className="app-ui-showcase-toggle-row">
              <PillSwitch label="По умолчанию" active={false} />
              <PillSwitch label="Активно" active />
              <PillSwitch label="Отключено" active={false} disabled />
            </div>
            <div className="app-ui-showcase-checkbox-row">
              <label>
                <input type="checkbox" /> По умолчанию
              </label>
              <label>
                <input type="checkbox" defaultChecked /> Выбрано
              </label>
              <label>
                <input type="radio" name="ref27-radio" defaultChecked /> Активно
              </label>
              <label>
                <input type="radio" name="ref27-radio" /> По умолчанию
              </label>
            </div>
          </div>
        </section>

        <section className="app-ui-showcase-card vn-surface-glass" role="listitem">
          <h2 className="app-ui-showcase-card-title">Таблица</h2>
          <div className="app-ui-showcase-table-wrap">
            <table className="app-ui-showcase-table">
              <thead>
                <tr>
                  <th scope="col">Имя</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Размер</th>
                  <th scope="col">Дата</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>
                      <StatusPill label={row.status} tone={row.tone} />
                    </td>
                    <td>{row.size}</td>
                    <td>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="app-ui-showcase-card vn-surface-glass" role="listitem">
          <h2 className="app-ui-showcase-card-title">Палитра команд</h2>
          <div className="app-ui-showcase-palette">
            {COMMAND_ROWS.map((row) => (
              <button key={row.label} type="button" className="app-ui-showcase-palette-row">
                <span>{row.label}</span>
                <span className="app-ui-showcase-palette-shortcut">{row.shortcut}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="app-ui-showcase-card vn-surface-glass" role="listitem">
          <h2 className="app-ui-showcase-card-title">Строка состояния</h2>
          <div className="app-ui-showcase-statusbar">
            <StatusPill label="Готово" tone="ready" />
            <span className="app-ui-showcase-statusbar-sep" aria-hidden />
            <StatusPill label="Обработка" tone="processing" />
            <span className="app-ui-showcase-statusbar-sep" aria-hidden />
            <StatusPill label="Инфо" tone="info" />
          </div>
        </section>

        <section className="app-ui-showcase-card vn-surface-glass" role="listitem">
          <h2 className="app-ui-showcase-card-title">Скелетон</h2>
          <div className="app-ui-showcase-skeleton-card" aria-hidden>
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--title" />
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--line" />
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--line app-ui-showcase-skeleton--line-short" />
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--bar" />
          </div>
        </section>
      </div>
    </section>
  )
}
