import type { JSX, ReactNode } from 'react'

export type StatusTone = 'ready' | 'processing' | 'attention' | 'error' | 'info'

export function ShowcaseCard(props: { title: string; children: ReactNode }): JSX.Element {
  const { title, children } = props
  return (
    <section className="app-ui-showcase-card vn-surface-glass" role="listitem">
      <h2 className="app-ui-showcase-card-title">{title}</h2>
      {children}
    </section>
  )
}

export function StatusPill(props: { label: string; tone: StatusTone }): JSX.Element {
  const { label, tone } = props
  return (
    <span className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${tone}`}>
      {label}
    </span>
  )
}

export function PillSwitch(props: {
  label: string
  active: boolean
  disabled?: boolean
}): JSX.Element {
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
