import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { CC_STATUS_READY, CC_STATUS_ROWS } from './critical-crash-ref23-data'
import { CriticalCrashMain, CriticalCrashSidebar } from './critical-crash-ref23-parts'

/** ref.23 — Критический сбой приложения full-screen (mock; not sign-off). */
export function CriticalCrashScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="cc-shell" data-ref={VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL} />
        ) : null}
        <CriticalCrashSidebar />
        <CriticalCrashMain />
        <footer className="tools-statusbar cc-shell__status" aria-label="Статус">
          <span className="tools-statusbar__ready">
            <span className="tools-statusbar__dot" aria-hidden />
            {CC_STATUS_READY}
          </span>
          <div className="tools-statusbar__center">
            {CC_STATUS_ROWS.map((row) => (
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
