import type { Dispatch, SetStateAction, SyntheticEvent } from 'react'

import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload
} from '../../../../shared/ytdlp-download-contract'
import { groupYtdlpCommandHintsByCategory } from '../../../../shared/ytdlp-command-hints-group'
import type {
  DownloadsRailPanelKey,
  DownloadsRailPanelsState
} from '../../use-downloads-window-ui-panels'

export type DownloadsSettingsRailProps = {
  downloadsOptionsBusy: boolean
  downloadsHistoryBusy: boolean
  downloadsOptions: YtdlpDownloadOptionsPayload | null
  setDownloadsOptions: Dispatch<SetStateAction<YtdlpDownloadOptionsPayload | null>>
  downloadsRailPanels: DownloadsRailPanelsState
  onRailSectionToggle: (
    key: DownloadsRailPanelKey
  ) => (e: SyntheticEvent<HTMLDetailsElement>) => void
  applyDownloadsOptionsPatch: (patch: YtdlpDownloadOptionsPatch) => Promise<void>
  downloadsOutputDirectory: { path: string; isDefault: boolean } | null
  setDownloadsOutputDirectory: Dispatch<SetStateAction<{ path: string; isDefault: boolean } | null>>
  refreshDownloadsOutputDirectory: () => Promise<void>
  setStatusHint: (hint: string | null) => void
  downloadsExpertHintFilter: string
  setDownloadsExpertHintFilter: (next: string) => void
  ytdlpCommandHintsFilteredByCategory: ReturnType<typeof groupYtdlpCommandHintsByCategory>
  appendDownloadsExtraArgsToken: (token: string) => void
  refreshDownloadsOptions: () => Promise<void>
  onOpenKnowledgeArticle?: (slug: string) => void
}
