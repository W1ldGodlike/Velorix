import type { RefObject } from 'react'

import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import type { PreviewProbeSectionKey, ProbeTableContextMenu } from './media-probe-panel-helpers'

export type PreviewProbeBodyCtx = {
  probeInfo: MediaProbeSuccess
  probeRefreshing: boolean
  sectionOpen: (key: PreviewProbeSectionKey) => boolean
  persistOrLocalSectionToggle: (key: PreviewProbeSectionKey, open: boolean) => void
  dash: string
  probeExportSummaryRegionId: string
  probeTracksRegionId: string
  probeChaptersRegionId: string
  probeRawJsonRegionId: string
  probeToolbarTip: string | null
  probeTableMenu: ProbeTableContextMenu
  setProbeTableMenu: (menu: ProbeTableContextMenu) => void
  probeTableMenuRef: RefObject<HTMLDivElement | null>
  diagnosticsCompact: string | null
  bitrateLabel: string | null
  formatTooltip: string | undefined
  handleCopyProbeJson: () => Promise<void>
  handleSaveProbeJson: () => Promise<void>
  handleSaveSummaryTxt: () => Promise<void>
  handleSaveSummaryHtml: () => Promise<void>
  copyProbeCellAndDismiss: (text: string) => Promise<void>
}
