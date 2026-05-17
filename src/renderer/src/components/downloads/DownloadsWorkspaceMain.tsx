import type { JSX } from 'react'

import { uiText } from '../../locales/ui-text'
import { DownloadsWorkspaceMainBand } from './DownloadsWorkspaceMainBand'
import { DownloadsWorkspaceMainLowerStack } from './DownloadsWorkspaceMainLowerStack'
import { DownloadsWorkspaceMainOverview } from './DownloadsWorkspaceMainOverview'
import { DownloadsWorkspaceMainQueueTable } from './DownloadsWorkspaceMainQueueTable'
export type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

export function DownloadsWorkspaceMain(props: DownloadsWorkspaceMainProps): JSX.Element {
  const { downloadsOptionsBusy, downloadsHistoryBusy } = props

  return (
    <section
      className="app-downloads-main"
      aria-label={uiText('downloadsMainAria')}
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
    >
      <DownloadsWorkspaceMainBand {...props} />
      <DownloadsWorkspaceMainOverview {...props} />
      <div
        className="app-downloads-table-zone"
        role="region"
        aria-label={uiText('downloadsQueueTableZoneAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <DownloadsWorkspaceMainQueueTable {...props} />
        <DownloadsWorkspaceMainLowerStack {...props} />
      </div>
    </section>
  )
}
