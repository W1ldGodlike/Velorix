import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { ENG_STATUS_READY, ENG_STATUS_ROWS } from './engine-paths-ref19-data'
import { EnginePathsModal, EnginePathsSceneBackdrop } from './engine-paths-ref19-parts'

/** ref.19 — Пути к движкам modal over tools backdrop (mock; not sign-off). */
export function EnginePathsScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="about-scene eng-scene" data-ref={VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL} />
        ) : null}
        <EnginePathsSceneBackdrop />
        <div className="about-scene__scrim" aria-hidden />
        <EnginePathsModal />
        <footer className="tools-statusbar eng-scene__status" aria-label="Статус">
          <span className="tools-statusbar__ready">
            <span className="tools-statusbar__dot" aria-hidden />
            {ENG_STATUS_READY}
          </span>
          <div className="tools-statusbar__center">
            {ENG_STATUS_ROWS.map((row) => (
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
