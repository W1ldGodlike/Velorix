import type { JSX, ReactNode } from 'react'

import { ShowcaseCard } from './ref27-showcase-shared'

export type ForcedState =
  | ''
  | 'app-ui-state--hover'
  | 'app-ui-state--active'
  | 'app-ui-state--focus'
  | 'app-ui-state--disabled'

const STATE_COLUMNS: Array<{ label: string; force: ForcedState; disabled: boolean }> = [
  { label: 'По умолчанию', force: '', disabled: false },
  { label: 'Наведение', force: 'app-ui-state--hover', disabled: false },
  { label: 'Активно', force: 'app-ui-state--active', disabled: false },
  { label: 'Фокус', force: 'app-ui-state--focus', disabled: false },
  { label: 'Отключено', force: 'app-ui-state--disabled', disabled: true }
]

export function StateMatrix(props: {
  children: (force: ForcedState, disabled: boolean) => ReactNode
}): JSX.Element {
  const { children } = props
  return (
    <div className="app-ui-states-matrix">
      {STATE_COLUMNS.map((col) => (
        <div key={col.label} className="app-ui-states-cell">
          <span className="app-ui-states-label">{col.label}</span>
          <div className="app-ui-states-demo">{children(col.force, col.disabled)}</div>
        </div>
      ))}
    </div>
  )
}

export function StatesSection(props: { title: string; children: ReactNode }): JSX.Element {
  return <ShowcaseCard title={props.title}>{props.children}</ShowcaseCard>
}

export { ShowcaseCard }
