import type { JSX } from 'react'

import type { WorkspaceTab } from '../../app/workspace-tab'
import { WORKSPACE_TAB_LABELS } from '../../app/workspace-tab'

export function RoutePlaceholderScreen(props: {
  tab: WorkspaceTab
  refLabel: string
}): JSX.Element {
  const { tab, refLabel } = props
  return (
    <div className="neon-route-placeholder vn-surface-glass">
      <h2 className="neon-route-placeholder__title">{WORKSPACE_TAB_LABELS[tab]}</h2>
      <p className="neon-route-placeholder__hint">
        {refLabel} — layout shell; контент в следующих срезах neon.4+.
      </p>
    </div>
  )
}
