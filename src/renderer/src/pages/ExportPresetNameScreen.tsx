import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { ExportPresetConversionBackdrop, ExportPresetNameModal } from './export-preset-ref18-parts'
import { EPN_STATUS_READY, EPN_STATUS_ROWS } from './export-preset-ref18-data'

/** ref.18 — Имя пресета экспорта modal over conversion backdrop (mock; not sign-off). */
export function ExportPresetNameScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div
        className="about-scene epn-scene"
        data-ref={VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL}
      >
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL} />
        ) : null}
        <ExportPresetConversionBackdrop />
        <div className="about-scene__scrim" aria-hidden />
        <ExportPresetNameModal />
        <footer className="tools-statusbar epn-scene__status" aria-label="Статус">
          <span className="tools-statusbar__ready">
            <span className="tools-statusbar__dot" aria-hidden />
            {EPN_STATUS_READY}
          </span>
          <div className="tools-statusbar__center">
            {EPN_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`tools-statusbar__item${row.accent ? ` tools-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="tools-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
