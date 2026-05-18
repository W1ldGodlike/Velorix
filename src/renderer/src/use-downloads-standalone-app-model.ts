import type { RefObject } from 'react'

import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { DownloadsSettingsRailProps } from './components/downloads/DownloadsSettingsRail'
import type { DownloadsWorkspaceMainProps } from './components/downloads/DownloadsWorkspaceMain'

export type DownloadsStandaloneAppModel = {
  theme: ResolvedAppTheme
  statusHint: string | null
  setStatusHint: (hint: string | null) => void
  handleUiLocaleToggle: () => void
  toggleTheme: () => Promise<void>
  knowledgeOpen: boolean
  setKnowledgeOpen: (open: boolean) => void
  knowledgeInitialSlug: string | null
  setKnowledgeInitialSlug: (slug: string | null) => void
  onOpenKnowledge: () => void
  onOpenKnowledgeArticle: (slug: string) => void
  downloadsMainProps: DownloadsWorkspaceMainProps
  downloadsSettingsProps: DownloadsSettingsRailProps
  downloadsSettingsRailRef: RefObject<HTMLElement | null>
  downloadsWorkspaceAriaBusy: boolean
}
