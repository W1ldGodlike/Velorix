import { useId, useState } from 'react'

import {
  DEFAULT_APP_SETTINGS_DIALOG_SECTION,
  type AppSettingsDialogSection
} from '../../shared/app-settings-dialog-section'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import { type EnginePathsDraft, type EngineSummary } from './app-engines-ui'
import type { WorkspaceTab } from './app-terminal-hint-ui'
import { type DownloadsQueueRowView, type DownloadsStatusFilter } from './downloads-queue-view'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat local state for App composition
export function useAppCompositionLocalState() {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('editor')
  const [theme, setTheme] = useState<ResolvedAppTheme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  const [appSettingsOpen, setAppSettingsOpen] = useState(false)
  const [appSettingsSection, setAppSettingsSection] = useState<AppSettingsDialogSection>(
    DEFAULT_APP_SETTINGS_DIALOG_SECTION
  )
  const [settingsResetBusy, setSettingsResetBusy] = useState(false)
  const [externalFilterScriptOpen, setExternalFilterScriptOpen] = useState(false)
  /** Сброс дерева после `applyPersistedUiLocale` — строки из `ui-text` читают `getUiLocale()` из модуля. */
  const [uiLocaleRenderTick, setUiLocaleRenderTick] = useState(0)
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [knowledgeInitialSlug, setKnowledgeInitialSlug] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutInfo, setAboutInfo] = useState<Awaited<
    ReturnType<typeof window.fluxalloy.about.getInfo>
  > | null>(null)
  const [enginePathsDraft, setEnginePathsDraft] = useState<EnginePathsDraft>({
    ffmpeg: '',
    ffprobe: '',
    'yt-dlp': ''
  })
  const [enginePathsSaving, setEnginePathsSaving] = useState(false)
  /** Подстрочное сообщение статусбара: прогресс загрузки движков, ошибки DnD и т.п. */
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [preview, setPreview] = useState<RestoredSourceInfo | null>(null)
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probePending, setProbePending] = useState(false)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [downloadsRows, setDownloadsRows] = useState<DownloadsQueueRowView[]>([])
  const [downloadsStatusFilter, setDownloadsStatusFilter] = useState<DownloadsStatusFilter>('all')
  /** Совпадает с `max-width: 1100px` в `main.css` для вкладки «Загрузки». */
  const [downloadsNarrowLayout, setDownloadsNarrowLayout] = useState(false)
  const downloadsMainUrlFieldId = useId()
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [exportBusy, setExportBusy] = useState(false)
  const [exportCancelBusy, setExportCancelBusy] = useState(false)

  return {
    workspaceTab,
    setWorkspaceTab,
    theme,
    setTheme,
    engineSummary,
    setEngineSummary,
    enginesOfferDownload,
    setEnginesOfferDownload,
    engineDownloadBusy,
    setEngineDownloadBusy,
    appSettingsOpen,
    setAppSettingsOpen,
    appSettingsSection,
    setAppSettingsSection,
    settingsResetBusy,
    setSettingsResetBusy,
    externalFilterScriptOpen,
    setExternalFilterScriptOpen,
    uiLocaleRenderTick,
    setUiLocaleRenderTick,
    knowledgeOpen,
    setKnowledgeOpen,
    knowledgeInitialSlug,
    setKnowledgeInitialSlug,
    aboutOpen,
    setAboutOpen,
    aboutInfo,
    setAboutInfo,
    enginePathsDraft,
    setEnginePathsDraft,
    enginePathsSaving,
    setEnginePathsSaving,
    statusHint,
    setStatusHint,
    preview,
    setPreview,
    previewBlobUrl,
    setPreviewBlobUrl,
    probeInfo,
    setProbeInfo,
    probePending,
    setProbePending,
    downloadsUrl,
    setDownloadsUrl,
    downloadsRows,
    setDownloadsRows,
    downloadsStatusFilter,
    setDownloadsStatusFilter,
    downloadsNarrowLayout,
    setDownloadsNarrowLayout,
    downloadsMainUrlFieldId,
    engineVersionsLine,
    setEngineVersionsLine,
    exportBusy,
    setExportBusy,
    exportCancelBusy,
    setExportCancelBusy
  }
}

export type AppCompositionLocalState = ReturnType<typeof useAppCompositionLocalState>
