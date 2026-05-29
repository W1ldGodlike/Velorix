import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { FirstRunEnginesWizard } from './first-run-ref20-parts'

/** ref.20 — Первый запуск / движки wizard (mock; not sign-off). */
export function FirstRunEnginesScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="fr-shell" id="ref20" data-ref={VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL} />
        ) : null}
        <FirstRunEnginesWizard />
      </div>
    </NeonWindowChrome>
  )
}
