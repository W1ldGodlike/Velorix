import type { JSX } from 'react'

export type NeonKitRoute = 'ref27' | 'ref26'

export function NeonKitNav(props: { route: NeonKitRoute }): JSX.Element {
  const { route } = props
  return (
    <nav className="neon-kit-nav" aria-label="NEON kit dev routes">
      <a href="#" aria-current={route === 'ref27' ? 'page' : undefined}>
        ref.27 components
      </a>
      <a href="#ref26" aria-current={route === 'ref26' ? 'page' : undefined}>
        ref.26 states
      </a>
    </nav>
  )
}
