import type { JSX } from 'react'

import { AppShellLayout } from './components/shell/AppShellLayout'
import { useAppComposition } from './use-app-composition'

function App(): JSX.Element {
  return <AppShellLayout {...useAppComposition()} />
}

export default App
