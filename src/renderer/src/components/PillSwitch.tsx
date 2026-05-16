import type { JSX } from 'react'

import { uiText } from '../locales/ui-text'

export type PillSwitchProps = {
  label: string
  checked: boolean
  disabled?: boolean
  describedBy?: string
  /** Длинная подсказка при наведении (простым языком). */
  tooltip?: string
  onToggle: () => void
}

export function PillSwitch({
  label,
  checked,
  disabled = false,
  describedBy,
  tooltip,
  onToggle
}: PillSwitchProps): JSX.Element {
  return (
    <button
      type="button"
      className={`app-pill-switch${checked ? ' app-pill-switch-on' : ''}`}
      role="switch"
      aria-label={label}
      aria-checked={checked}
      aria-describedby={describedBy}
      title={tooltip}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className="app-pill-switch-knob" aria-hidden />
      <span className="app-pill-switch-text">
        {checked ? uiText('editorPillSwitchOn') : uiText('editorPillSwitchOff')}
      </span>
    </button>
  )
}
