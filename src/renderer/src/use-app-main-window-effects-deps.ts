import type { Dispatch, MutableRefObject, SetStateAction } from 'react'

import type { EnginePathsDraft, EngineSummary } from './app-engines-ui'
import type { WorkspaceTab } from './app-terminal-hint-ui'
import type { AppSettingsDialogSection } from '../../shared/app-settings-dialog-section'
import type { EditorUrlPasteBehaviorId } from '../../shared/editor-url-paste-behavior'
import type { FfmpegExportUserPreset } from '../../shared/ffmpeg-export-contract'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type {
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  ResolvedAppTheme
} from '../../shared/settings-contract'
import type { DownloadsQueueRowView } from './downloads-queue-view'

export type UseAppMainWindowEffectsDeps = {
  trimSnapshotRef: MutableRefObject<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>
  currentSourcePath: string | null
  setDownloadsRows: Dispatch<SetStateAction<DownloadsQueueRowView[]>>
  setTheme: Dispatch<SetStateAction<ResolvedAppTheme>>
  setUiLocaleRenderTick: Dispatch<SetStateAction<number>>
  hydrateExportFieldsFromSettings: (
    loaded: Awaited<ReturnType<typeof window.velorix.settings.get>>
  ) => void
  hydrateMainWindowUiPanels: (patch: MainWindowUiPanelState | null | undefined) => void
  hydrateDownloadsWindowUiPanels: (patch: DownloadsWindowUiPanelState | null | undefined) => void
  setExportUserPresets: Dispatch<SetStateAction<FfmpegExportUserPreset[]>>
  setSnapshotFormat: Dispatch<SetStateAction<FfmpegSnapshotFormatId>>
  refetchHwEncoders: () => Promise<void>
  applyPreview: (payload: RestoredSourceInfo) => void
  previewPath: string | null
  previewMediaUrl: string | undefined
  setPreviewBlobUrl: Dispatch<SetStateAction<string | null>>
  setProbeInfo: Dispatch<SetStateAction<MediaProbeSuccess | null>>
  setProbePending: Dispatch<SetStateAction<boolean>>
  setStatusHint: Dispatch<SetStateAction<string | null>>
  setEngineSummary: Dispatch<SetStateAction<EngineSummary>>
  setEngineVersionsLine: Dispatch<SetStateAction<string>>
  setEnginesOfferDownload: Dispatch<SetStateAction<boolean>>
  engineSummary: EngineSummary
  appSettingsOpen: boolean
  appSettingsSection: AppSettingsDialogSection
  setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
  setAppSettingsOpen: Dispatch<SetStateAction<boolean>>
  setAppSettingsSection: Dispatch<SetStateAction<AppSettingsDialogSection>>
  setExternalFilterScriptOpen: Dispatch<SetStateAction<boolean>>
  setMediaFileUtilitiesOpen: Dispatch<SetStateAction<boolean>>
  setWorkflowPlannerOpen: Dispatch<SetStateAction<boolean>>
  setWorkflowScenarioBuilderOpen: Dispatch<SetStateAction<boolean>>
  setAboutInfo: Dispatch<
    SetStateAction<Awaited<ReturnType<typeof window.velorix.about.getInfo>> | null>
  >
  setAboutOpen: Dispatch<SetStateAction<boolean>>
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  setDownloadsUrl: Dispatch<SetStateAction<string>>
  setDownloadsNarrowLayout: Dispatch<SetStateAction<boolean>>
}
