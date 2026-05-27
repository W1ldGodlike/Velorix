import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL } from '../../../shared/velorix-neon-theme-tokens'

/** ref.18 — имя нового пользовательского пресета (сохранение в actions). */
export function ExportPresetNameModalBody(props: {
  label: string
  onLabelChange: (label: string) => void
  statusLine: string | null
}): JSX.Element {
  const { label, onLabelChange, statusLine } = props

  return (
    <div className="app-modal__body app-modal__body--stack">
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Имя пресета</span>
        <input
          type="text"
          className="app-input"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
        />
      </label>
      {statusLine != null ? <p className="app-modal__status">{statusLine}</p> : null}
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL}</p>
    </div>
  )
}
