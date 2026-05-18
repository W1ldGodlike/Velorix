import type { SetStateAction } from 'react'

import { createRendererStore } from './create-renderer-store'

import {
  DEFAULT_APP_SETTINGS_DIALOG_SECTION,
  type AppSettingsDialogSection
} from '../../../shared/app-settings-dialog-section'
import type { ResolvedAppTheme } from '../../../shared/settings-contract'
import type { RestoredSourceInfo } from '../../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import { type EnginePathsDraft, type EngineSummary } from '../app-engines-ui'
import type { WorkspaceTab } from '../app-terminal-hint-ui'
import { type DownloadsQueueRowView, type DownloadsStatusFilter } from '../downloads-queue-view'
import { applySetStateAction } from './store-set-action'

export type AppShellState = {
  workspaceTab: WorkspaceTab
  theme: ResolvedAppTheme
  engineSummary: EngineSummary
  enginesOfferDownload: boolean
  engineDownloadBusy: boolean
  appSettingsOpen: boolean
  appSettingsSection: AppSettingsDialogSection
  settingsResetBusy: boolean
  externalFilterScriptOpen: boolean
  workflowPlannerOpen: boolean
  workflowScenarioBuilderOpen: boolean
  uiLocaleRenderTick: number
  knowledgeOpen: boolean
  knowledgeInitialSlug: string | null
  aboutOpen: boolean
  aboutInfo: Awaited<ReturnType<typeof window.fluxalloy.about.getInfo>> | null
  enginePathsDraft: EnginePathsDraft
  enginePathsSaving: boolean
  statusHint: string | null
  preview: RestoredSourceInfo | null
  previewBlobUrl: string | null
  probeInfo: MediaProbeSuccess | null
  probePending: boolean
  downloadsUrl: string
  downloadsRows: DownloadsQueueRowView[]
  downloadsStatusFilter: DownloadsStatusFilter
  downloadsNarrowLayout: boolean
  downloadsMainUrlFieldId: string
  engineVersionsLine: string
  exportBusy: boolean
  exportCancelBusy: boolean
  lastRendererError: string | null
  /** Инкремент при смене previewPath — отмена устаревших probe (§6.3). */
  previewProbeGeneration: number
  previewTrimPath: string | null
  previewTrimRange: { inSec: number; outSec: number } | null
}

type AppShellSetterKeys = {
  [K in keyof AppShellState as K extends 'previewProbeGeneration'
    ? never
    : `set${Capitalize<string & K>}`]: (next: SetStateAction<AppShellState[K]>) => void
}

export type AppShellStore = AppShellState &
  AppShellSetterKeys & {
    reset: () => void
    bumpUiLocaleRenderTick: () => void
    bumpPreviewProbeGeneration: () => number
    setPreviewTrimSnapshot: (path: string | null, range: { inSec: number; outSec: number }) => void
  }

export const initialAppShellState: AppShellState = {
  workspaceTab: 'editor',
  theme: 'dark',
  engineSummary: 'checking',
  enginesOfferDownload: false,
  engineDownloadBusy: false,
  appSettingsOpen: false,
  appSettingsSection: DEFAULT_APP_SETTINGS_DIALOG_SECTION,
  settingsResetBusy: false,
  externalFilterScriptOpen: false,
  workflowPlannerOpen: false,
  workflowScenarioBuilderOpen: false,
  uiLocaleRenderTick: 0,
  knowledgeOpen: false,
  knowledgeInitialSlug: null,
  aboutOpen: false,
  aboutInfo: null,
  enginePathsDraft: { ffmpeg: '', ffprobe: '', 'yt-dlp': '' },
  enginePathsSaving: false,
  statusHint: null,
  preview: null,
  previewBlobUrl: null,
  probeInfo: null,
  probePending: false,
  downloadsUrl: '',
  downloadsRows: [],
  downloadsStatusFilter: 'all',
  downloadsNarrowLayout: false,
  downloadsMainUrlFieldId: '',
  engineVersionsLine: '',
  exportBusy: false,
  exportCancelBusy: false,
  lastRendererError: null,
  previewProbeGeneration: 0,
  previewTrimPath: null,
  previewTrimRange: null
}

function setter<K extends keyof AppShellState>(
  key: K,
  set: (partial: Partial<AppShellState>) => void,
  get: () => AppShellState
): (next: SetStateAction<AppShellState[K]>) => void {
  return (next) => {
    set({ [key]: applySetStateAction(next, get()[key]) } as Partial<AppShellState>)
  }
}

export const useAppShellStore = createRendererStore<AppShellStore>('AppShell', (set, get) => ({
  ...initialAppShellState,
  setWorkspaceTab: setter('workspaceTab', set, get),
  setTheme: setter('theme', set, get),
  setEngineSummary: setter('engineSummary', set, get),
  setEnginesOfferDownload: setter('enginesOfferDownload', set, get),
  setEngineDownloadBusy: setter('engineDownloadBusy', set, get),
  setAppSettingsOpen: setter('appSettingsOpen', set, get),
  setAppSettingsSection: setter('appSettingsSection', set, get),
  setSettingsResetBusy: setter('settingsResetBusy', set, get),
  setExternalFilterScriptOpen: setter('externalFilterScriptOpen', set, get),
  setWorkflowPlannerOpen: setter('workflowPlannerOpen', set, get),
  setWorkflowScenarioBuilderOpen: setter('workflowScenarioBuilderOpen', set, get),
  setUiLocaleRenderTick: setter('uiLocaleRenderTick', set, get),
  setKnowledgeOpen: setter('knowledgeOpen', set, get),
  setKnowledgeInitialSlug: setter('knowledgeInitialSlug', set, get),
  setAboutOpen: setter('aboutOpen', set, get),
  setAboutInfo: setter('aboutInfo', set, get),
  setEnginePathsDraft: setter('enginePathsDraft', set, get),
  setEnginePathsSaving: setter('enginePathsSaving', set, get),
  setStatusHint: setter('statusHint', set, get),
  setPreview: setter('preview', set, get),
  setPreviewBlobUrl: setter('previewBlobUrl', set, get),
  setProbeInfo: setter('probeInfo', set, get),
  setProbePending: setter('probePending', set, get),
  setDownloadsUrl: setter('downloadsUrl', set, get),
  setDownloadsRows: setter('downloadsRows', set, get),
  setDownloadsStatusFilter: setter('downloadsStatusFilter', set, get),
  setDownloadsNarrowLayout: setter('downloadsNarrowLayout', set, get),
  setDownloadsMainUrlFieldId: setter('downloadsMainUrlFieldId', set, get),
  setEngineVersionsLine: setter('engineVersionsLine', set, get),
  setExportBusy: setter('exportBusy', set, get),
  setExportCancelBusy: setter('exportCancelBusy', set, get),
  setLastRendererError: setter('lastRendererError', set, get),
  setPreviewTrimPath: setter('previewTrimPath', set, get),
  setPreviewTrimRange: setter('previewTrimRange', set, get),
  setPreviewTrimSnapshot: (path, range) => {
    set({ previewTrimPath: path, previewTrimRange: range })
  },
  bumpUiLocaleRenderTick: () => {
    set((s) => ({ uiLocaleRenderTick: s.uiLocaleRenderTick + 1 }))
  },
  bumpPreviewProbeGeneration: () => {
    const next = get().previewProbeGeneration + 1
    set({ previewProbeGeneration: next })
    return next
  },
  reset: () => {
    set(initialAppShellState)
  }
}))
