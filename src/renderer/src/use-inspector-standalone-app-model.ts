import type { Dispatch, SetStateAction } from 'react'

import type { AppAboutInfo } from '../../shared/about-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { PreviewProbeSectionKey } from './components/MediaProbePanel'
import type { ProbeInspectorUiState } from './inspector-standalone-probe-ui'

export type InspectorStandaloneAppModel = {
  theme: ResolvedAppTheme
  mediaPath: string | null
  probePending: boolean
  probeUiPanels: ProbeInspectorUiState
  statusHint: string | null
  setStatusHint: (hint: string | null) => void
  aboutOpen: boolean
  setAboutOpen: (open: boolean) => void
  aboutInfo: AppAboutInfo | null
  displayedProbeInfo: MediaProbeSuccess | null
  displayedProbeError: string | null
  persistProbeSection: (key: PreviewProbeSectionKey, open: boolean) => void
  handleUiLocaleToggle: () => void
  toggleTheme: () => Promise<void>
  handleOpenFolderDialog: () => Promise<void>
  handleOpenDialog: () => Promise<void>
  handleDrop: (files: FileList | null) => Promise<void>
  setProbeRefreshNonce: Dispatch<SetStateAction<number>>
  openAboutDialog: () => void
}
