import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { KitShowcaseSidebar } from './kit-showcase-sidebar'
import { KIT_STATUS_READY, KIT_STATUS_ROWS, KIT_SUMMARY_REF27 } from './kit-showcase-status-data'
import { NeonKitNav } from './neon-kit-nav'
import { Kit27SectionsGrid } from './ref27-kit-sections-parts'

/** ref.27 — UI Components kit board (mock; not sign-off). */
export function Ref27KitPage(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="ks-shell" id="ref27" data-ref={VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL} />
        ) : null}
        <KitShowcaseSidebar />
        <div className="ks-main">
          <NeonKitNav route="ref27" />
          <header className="ks-head">
            <div className="ks-head__main">
              <p className="ks-head__eyebrow">UI kit · ref.27</p>
              <h1 className="ks-head__title vn-text-gradient">VELORIX UI COMPONENTS</h1>
              <p className="ks-head__sub">Компоненты и паттерны · v1.7.0 · 31 секции</p>
            </div>
            <span className="ks-head__chip">31 blocks</span>
          </header>
          <p className="ks-head__summary">{KIT_SUMMARY_REF27}</p>
          <Kit27SectionsGrid />
          <footer className="tools-statusbar" aria-label="Статус">
            <span className="tools-statusbar__ready">
              <span className="tools-statusbar__dot" aria-hidden />
              {KIT_STATUS_READY}
            </span>
            <div className="tools-statusbar__center">
              {KIT_STATUS_ROWS.map((row) => (
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
      </div>
    </NeonWindowChrome>
  )
}
