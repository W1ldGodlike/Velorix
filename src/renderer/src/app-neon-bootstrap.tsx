import type { JSX } from 'react'
import { useEffect, useState } from 'react'

import { Ref26StatesPage } from './pages/Ref26StatesPage'
import { Ref27KitPage } from './pages/Ref27KitPage'

type NeonKitRoute = 'ref27' | 'ref26'

function readRoute(): NeonKitRoute {
  if (typeof window === 'undefined') {
    return 'ref27'
  }
  const hash = window.location.hash
  if (hash === '#ref26' || hash === '#states') {
    return 'ref26'
  }
  return 'ref27'
}

/** ui.1 — ref.27 default, ref.26 via #ref26 (rebuild from PNG; not sign-off). */
export function AppNeonBootstrap(): JSX.Element {
  const [route, setRoute] = useState<NeonKitRoute>(readRoute)

  useEffect(() => {
    const onHash = (): void => {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route === 'ref26' ? <Ref26StatesPage /> : <Ref27KitPage />
}
