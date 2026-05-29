import type { JSX } from 'react'

import { NEON_DEV_ROUTES } from './neon-dev-routes'

export type NeonKitRoute = 'ref27' | 'ref26' | 'ref1'

export function NeonKitNav(props: { route: NeonKitRoute }): JSX.Element {
  const { route } = props
  return (
    <nav className="neon-kit-nav" aria-label="NEON kit dev routes">
      <div className="neon-kit-nav__primary">
        <a href="#ref1" aria-current={route === 'ref1' ? 'page' : undefined}>
          ref.1 processing
        </a>
        <a href="#ref27" aria-current={route === 'ref27' ? 'page' : undefined}>
          ref.27 components
        </a>
        <a href="#ref26" aria-current={route === 'ref26' ? 'page' : undefined}>
          ref.26 states
        </a>
      </div>
      <details className="neon-kit-nav__all">
        <summary>Все refs 1–27</summary>
        <div className="neon-kit-nav__grid">
          {NEON_DEV_ROUTES.map((item) => (
            <a key={item.ref} href={item.hash}>
              {item.ref}. {item.label}
            </a>
          ))}
        </div>
      </details>
    </nav>
  )
}
