import type { JSX } from 'react'
import { useEffect, useState } from 'react'

import { NeonShell } from './app/NeonShell'
import { Ref26StatesPage } from './pages/Ref26StatesPage'
import { Ref27ComponentsPage } from './pages/Ref27ComponentsPage'

type RefBootstrapRoute = 'ref27' | 'ref26' | 'ref1'

function readRoute(): RefBootstrapRoute {
  if (typeof window === 'undefined') {
    return 'ref27'
  }
  const hash = window.location.hash
  if (hash === '#ref26') {
    return 'ref26'
  }
  if (hash === '#ref1' || hash === '#shell') {
    return 'ref1'
  }
  return 'ref27'
}

function RefBootstrapNav(props: { route: RefBootstrapRoute }): JSX.Element {
  const { route } = props
  return (
    <nav className="app-ref-bootstrap-nav" aria-label="NEON dev bootstrap">
      <a href="#" aria-current={route === 'ref27' ? 'page' : undefined}>
        ref.27
      </a>
      <a href="#ref26" aria-current={route === 'ref26' ? 'page' : undefined}>
        ref.26
      </a>
      <a href="#ref1" aria-current={route === 'ref1' ? 'page' : undefined}>
        ref.1 shell
      </a>
    </nav>
  )
}

/** UI ZERO: ref.27 / ref.26 showcase или ref.1 NeonShell по hash. */
export function AppRefBootstrap(): JSX.Element {
  const [route, setRoute] = useState<RefBootstrapRoute>(readRoute)

  useEffect(() => {
    const onHash = (): void => {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === 'ref1') {
    return (
      <>
        <RefBootstrapNav route={route} />
        <NeonShell />
      </>
    )
  }

  return (
    <>
      <RefBootstrapNav route={route} />
      {route === 'ref26' ? <Ref26StatesPage /> : <Ref27ComponentsPage />}
    </>
  )
}
