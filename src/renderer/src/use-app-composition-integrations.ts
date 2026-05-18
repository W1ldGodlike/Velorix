import { useRef } from 'react'

import { useDownloadsWindowUiPanels } from './use-downloads-window-ui-panels'
import { useMainWindowUiPanels } from './use-main-window-ui-panels'
import { useEditorExportSettings } from './use-editor-export-settings'
import { useAppProcessingHistory } from './use-app-processing-history'
import { useDownloadsWorkspace } from './use-downloads-workspace'
import type { AppCompositionLocalState } from './use-app-composition-local-state'
import { useWorkflowWatchFolderStatus } from './use-workflow-watch-folder-status'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- workspace + export hook bundle
export function useAppCompositionIntegrations({
  setStatusHint
}: Pick<AppCompositionLocalState, 'setStatusHint'>) {
  useWorkflowWatchFolderStatus(setStatusHint)
  const downloadsWorkspace = useDownloadsWorkspace({ setStatusHint })
  const processingHistory = useAppProcessingHistory({ setStatusHint })
  const downloadsWindowUiPanels = useDownloadsWindowUiPanels()
  const editorExportSettings = useEditorExportSettings({ setStatusHint })
  const mainWindowUiPanels = useMainWindowUiPanels()
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Стек видео+транспорт+таймлайн: цель fullscreen по референсу v0. */
  const previewStackRef = useRef<HTMLDivElement>(null)
  /** §6 / узкая ширина: `scrollIntoView` к панели настроек yt-dlp под очередью. */
  const downloadsSettingsRailRef = useRef<HTMLElement | null>(null)

  return {
    ...downloadsWorkspace,
    ...processingHistory,
    ...downloadsWindowUiPanels,
    ...editorExportSettings,
    ...mainWindowUiPanels,
    videoRef,
    previewStackRef,
    downloadsSettingsRailRef
  }
}
