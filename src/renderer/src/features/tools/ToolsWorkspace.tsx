import type { JSX } from 'react'

import { useAppShellStore } from '../../stores/app-shell-store'
import { ToolsHubScreen } from './ToolsHubScreen'
import { ImageConversionRail, UtilityToolRail, UtilityToolScreen } from './UtilityToolScreens'

export function ToolsWorkspace(): JSX.Element {
  const toolsView = useAppShellStore((s) => s.toolsView)
  if (toolsView === 'hub') {
    return <ToolsHubScreen />
  }
  return <UtilityToolScreen view={toolsView} />
}

export function ToolsRailOutlet(): JSX.Element | null {
  const toolsView = useAppShellStore((s) => s.toolsView)
  const railOpen = useAppShellStore((s) => s.railOpen)
  if (!railOpen) {
    return null
  }
  if (toolsView === 'hub') {
    return <ToolsHubRail />
  }
  if (toolsView === 'img') {
    return <ImageConversionRail />
  }
  return <UtilityToolRail view={toolsView} />
}

function ToolsHubRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Недавние</h2>
      <ul className="tools-rail__recent">
        <li>Обслуживание файлов</li>
        <li>Бенчмарк кодеров</li>
      </ul>
      <div className="tools-rail__showcase">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            window.location.hash = '#ref27'
          }}
        >
          ref.27 kit
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            window.location.hash = '#ref26'
          }}
        >
          ref.26 states
        </button>
      </div>
    </aside>
  )
}
