import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL } from '../../../shared/velorix-neon-theme-tokens'

import { NeonKitNav } from './neon-kit-nav'

const STATE_COLS = ['default', 'hover', 'active', 'focus', 'disabled'] as const

const ROWS = [
  {
    id: 'btn-primary',
    label: 'Primary',
    render: () => (
      <button type="button" className="vn-btn vn-btn--primary">
        OK
      </button>
    )
  },
  {
    id: 'input',
    label: 'Input',
    render: () => <input className="vn-input" type="text" defaultValue="Text" aria-label="Text" />
  },
  {
    id: 'badge',
    label: 'Badge',
    render: () => <span className="vn-badge vn-badge--processing">Обработка</span>
  }
]

/** ref.26 — UI State Showcase matrix (rebuild; not sign-off). */
export function Ref26StatesPage(): JSX.Element {
  return (
    <div className="neon-states" id="ref26">
      <NeonKitNav route="ref26" />
      <header className="neon-states__head">
        <h1 className="neon-states__title vn-text-gradient">VELORIX UI STATES SHOWCASE</h1>
        <p className="neon-kit__ref">ref.26 · {VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL}</p>
      </header>
      <div className="neon-states__matrix" role="table">
        <div />
        {STATE_COLS.map((col) => (
          <div key={col} className="neon-states__matrix-head">
            {col}
          </div>
        ))}
        {ROWS.flatMap((row) => [
          <div key={`${row.id}-label`} className="neon-states__label">
            {row.label}
          </div>,
          ...STATE_COLS.map((col) => (
            <div
              key={`${row.id}-${col}`}
              className={`neon-states__cell neon-states__cell--${col} vn-surface-glass`}
            >
              {row.render()}
            </div>
          ))
        ])}
      </div>
    </div>
  )
}
