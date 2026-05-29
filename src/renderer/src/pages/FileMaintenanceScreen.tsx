import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { AboutToolsBackdrop } from './about-ref11-parts'
import { FileMaintenanceModalPanel } from './file-maintenance-ref12-parts'

/** ref.12 — Обслуживание файлов modal over tools backdrop (mock; not sign-off). */
export function FileMaintenanceScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="about-scene fm-scene" data-ref={VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL} />
        ) : null}
        <AboutToolsBackdrop />
        <div className="about-scene__scrim" aria-hidden />
        <FileMaintenanceModalPanel />
      </div>
    </NeonWindowChrome>
  )
}
