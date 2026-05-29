import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_ABOUT_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { AboutModalPanel, AboutToolsBackdrop } from './about-ref11-parts'

/** ref.11 — О программе modal over tools backdrop (mock; not sign-off). */
export function AboutScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="about-scene" data-ref={VELORIX_NEON_REFERENCE_ABOUT_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_ABOUT_REL} />
        ) : null}
        <AboutToolsBackdrop />
        <div className="about-scene__scrim" aria-hidden />
        <AboutModalPanel />
      </div>
    </NeonWindowChrome>
  )
}
