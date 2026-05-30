import type { JSX } from 'react'

import { velorixRefPngUrl } from '../../../shared/neon-reference-overlay-dev'
import {
  VELORIX_NEON_APP_ICON_REFERENCE_REL,
  VELORIX_NEON_LOGO_STACKED_REFERENCE_REL,
  VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL
} from '../../../shared/velorix-neon-theme-tokens'

import '../assets/neon-brand.css'

/** Sidebar brand: wordmark PNG или ref.1 stacked icon (канон processing PNG). */
export function NeonSidebarBrand(props: {
  className?: string
  version?: string
  tagline?: string
  showEdition?: boolean
  /** ref.1 PNG — иконка V + VELORIX + version (без wordmark PNG / PRO). */
  layout?: 'wordmark' | 'ref1'
}): JSX.Element {
  const {
    className = 'processing-sidebar__brand',
    version = 'v1.7.0',
    tagline,
    showEdition = true,
    layout = 'wordmark'
  } = props
  const caption = tagline ?? version

  if (layout === 'ref1') {
    return (
      <div className={`neon-sidebar-brand neon-sidebar-brand--ref1 ${className}`}>
        <NeonBrandAppIcon className="processing-sidebar__brand-icon" />
        <div className="processing-sidebar__brand-text">
          <span className="processing-sidebar__brand-name">VELORIX</span>
          {caption.length > 0 ? <p className="processing-sidebar__version">{caption}</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={`neon-sidebar-brand ${className}`}>
      <img
        className="neon-brand__wordmark"
        src={velorixRefPngUrl(VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL)}
        alt="Velorix"
        decoding="async"
      />
      {showEdition ? <span className="processing-sidebar__brand-edition">PRO</span> : null}
      {caption.length > 0 ? <p className="processing-sidebar__version">{caption}</p> : null}
    </div>
  )
}

/** Центр модалки / about: stacked PNG (`velorix-neon-logo-stacked-reference.png`). */
export function NeonBrandStacked(props: { className?: string }): JSX.Element {
  const { className = 'neon-brand__stacked-wrap' } = props
  return (
    <img
      className={`neon-brand__stacked ${className}`}
      src={velorixRefPngUrl(VELORIX_NEON_LOGO_STACKED_REFERENCE_REL)}
      alt="Velorix"
      decoding="async"
    />
  )
}

/** Компактная полоса окна: горизонтальный wordmark. */
export function NeonChromeWordmark(): JSX.Element {
  return (
    <img
      className="neon-brand__chrome-wordmark"
      src={velorixRefPngUrl(VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL)}
      alt="Velorix"
      decoding="async"
    />
  )
}

/** Mark-only (иконка V) — `velorix-neon-app-icon-reference.png`. */
export function NeonBrandAppIcon(props: { className?: string }): JSX.Element {
  const { className = 'neon-brand__app-icon' } = props
  return (
    <img
      className={className}
      src={velorixRefPngUrl(VELORIX_NEON_APP_ICON_REFERENCE_REL)}
      alt=""
      aria-hidden
      decoding="async"
    />
  )
}
