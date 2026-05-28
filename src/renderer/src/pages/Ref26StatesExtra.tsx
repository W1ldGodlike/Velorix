import type { JSX } from 'react'

import { StatesSection } from './ref26-states-shared'
import { StatusPill } from './ref27-showcase-shared'

/** ref.26 — доп. секции (таймлайн, поиск, палитра, очередь рендера). */
export function Ref26StatesExtra(): JSX.Element {
  return (
    <>
      <StatesSection title="Таймлайн — состояния">
        <div className="app-ui-showcase-timeline">
          <div className="app-ui-showcase-timeline-strip">
            <span className="app-ui-showcase-timeline-segment" />
            <span className="app-ui-showcase-timeline-segment app-ui-showcase-timeline-segment--selected" />
            <span className="app-ui-showcase-timeline-segment app-ui-state--hover" />
          </div>
        </div>
      </StatesSection>

      <StatesSection title="Поиск — состояния">
        <div className="app-ui-showcase-search">
          <input type="search" className="app-input" placeholder="Поиск…" />
          <input
            type="search"
            className="app-input app-ui-showcase-force-focus"
            defaultValue="ffmpeg"
          />
        </div>
      </StatesSection>

      <StatesSection title="Командная палитра">
        <div className="app-ui-showcase-palette">
          <button type="button" className="app-ui-showcase-palette-row">
            <span>Новый проект</span>
            <span className="app-ui-showcase-palette-shortcut">Ctrl+N</span>
          </button>
          <button type="button" className="app-ui-showcase-palette-row app-ui-state--hover">
            <span>Экспорт</span>
            <span className="app-ui-showcase-palette-shortcut">Ctrl+E</span>
          </button>
        </div>
      </StatesSection>

      <StatesSection title="prefers-reduced-motion">
        <p className="ref26-reduced-motion__hint">
          При <code>prefers-reduced-motion: reduce</code> в <code>neon-motion-v1.css</code>{' '}
          отключены workspace/palette анимации и <code>transform</code> на :active у кнопок.
        </p>
        <div className="ref26-reduced-motion__demo">
          <button type="button" className="app-btn app-btn-primary">
            Primary (motion v1)
          </button>
          <button type="button" className="app-btn app-btn-secondary">
            Secondary
          </button>
        </div>
      </StatesSection>

      <StatesSection title="Рендер / экспорт">
        <ul className="app-ui-states-queue">
          <li className="app-ui-states-queue-item">
            <span>В очереди</span>
            <div className="app-ui-showcase-progress-track">
              <span className="app-ui-showcase-progress-fill" style={{ width: '12%' }} />
            </div>
          </li>
          <li className="app-ui-states-queue-item app-ui-states-queue-item--active">
            <span>Рендер</span>
            <div className="app-ui-showcase-progress-track">
              <span className="app-ui-showcase-progress-fill" style={{ width: '68%' }} />
            </div>
          </li>
          <li className="app-ui-states-queue-item app-ui-states-queue-item--done">
            <span>Готово</span>
            <StatusPill label="100%" tone="ready" />
          </li>
        </ul>
      </StatesSection>
    </>
  )
}
