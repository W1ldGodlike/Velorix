import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { QC_STATUS_READY, QC_STATUS_ROWS } from './quit-confirm-ref21-data'
import { QuitConfirmModal, QuitConfirmProcessingBackdrop } from './quit-confirm-ref21-parts'

/** ref.21 — Закрыть Velorix? modal over processing backdrop (mock; not sign-off). */
export function QuitConfirmScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="about-scene qc-scene" data-ref={VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL} />
        ) : null}
        <QuitConfirmProcessingBackdrop />
        <div className="about-scene__scrim" aria-hidden />
        <QuitConfirmModal />
        <footer className="tools-statusbar qc-scene__status" aria-label="Статус">
          <span className="tools-statusbar__ready">
            <span className="tools-statusbar__dot" aria-hidden />
            {QC_STATUS_READY}
          </span>
          <div className="tools-statusbar__center">
            {QC_STATUS_ROWS.map((row) => (
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
