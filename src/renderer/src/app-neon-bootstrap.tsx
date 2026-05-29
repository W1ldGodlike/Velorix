import type { JSX } from 'react'
import { useEffect, useState } from 'react'

import { ProcessingScreen } from './pages/ProcessingScreen'
import { Ref26StatesPage } from './pages/Ref26StatesPage'
import { Ref27KitPage } from './pages/Ref27KitPage'

type NeonRoute = 'ref27' | 'ref26' | 'ref1'

function readRoute(): NeonRoute {
  if (typeof window === 'undefined') {
    return 'ref1'
  }
  const hash = window.location.hash
  if (hash === '#ref26' || hash === '#states') {
    return 'ref26'
  }
  if (hash === '#ref27' || hash === '#components') {
    return 'ref27'
  }
  return 'ref1'
}

/** NEON dev routes: ref.1 default, #ref27 kit, #ref26 states. */
export function AppNeonBootstrap(): JSX.Element {
  const [route, setRoute] = useState<NeonRoute>(readRoute)

  useEffect(() => {
    const onHash = (): void => {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === 'ref26') {
    return <Ref26StatesPage />
  }
  if (route === 'ref27') {
    return <Ref27KitPage />
  }
  return <ProcessingScreen />
}
