import type { JSX } from 'react'
import { useEffect, useState } from 'react'

import { DownloadsScreen } from './pages/DownloadsScreen'
import { HistoryScreen } from './pages/HistoryScreen'
import { KnowledgeEmbeddedWorkspace } from './pages/KnowledgeEmbeddedWorkspace'
import { PlannerScreen } from './pages/PlannerScreen'
import { ProcessingScreen } from './pages/ProcessingScreen'
import { SettingsScreen } from './pages/SettingsScreen'
import { Ref26StatesPage } from './pages/Ref26StatesPage'
import { Ref27KitPage } from './pages/Ref27KitPage'

type NeonRoute = 'ref27' | 'ref26' | 'ref1' | 'ref2' | 'ref3' | 'ref4' | 'ref5' | 'ref6'

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
  if (hash === '#ref2' || hash === '#downloads') {
    return 'ref2'
  }
  if (hash === '#ref3' || hash === '#history') {
    return 'ref3'
  }
  if (hash === '#ref4' || hash === '#planner') {
    return 'ref4'
  }
  if (hash === '#ref5' || hash === '#knowledge') {
    return 'ref5'
  }
  if (hash === '#ref6' || hash === '#settings') {
    return 'ref6'
  }
  return 'ref1'
}

/** NEON dev routes: ref.1 default, #ref2–6 portal screens, #ref27 kit, #ref26 states. */
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
  if (route === 'ref2') {
    return <DownloadsScreen />
  }
  if (route === 'ref3') {
    return <HistoryScreen />
  }
  if (route === 'ref4') {
    return <PlannerScreen />
  }
  if (route === 'ref5') {
    return <KnowledgeEmbeddedWorkspace />
  }
  if (route === 'ref6') {
    return <SettingsScreen />
  }
  return <ProcessingScreen />
}
