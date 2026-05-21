/**
 * Типизированный контракт preload -> renderer (фрагмент FluxAlloyApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type { AppUiLocale } from '../shared/app-ui-locale'
import type { PreviewDialogResult } from '../shared/preview-dialog-contract'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../shared/processing-history-contract'
import type { MainWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
/** Данные для привязки `<video>` к локальному файлу через allowlist-схему `fluxmedia://`. */
export type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

export type FluxAlloyApiEventsBlock = {
  processingHistory: {
    get: (
      filter?: ProcessingHistoryFilter & { limit?: number }
    ) => Promise<ProcessingHistoryEntry[]>
    weeklySummary: () => Promise<ProcessingHistoryWeeklySummary>
    clear: () => Promise<{ ok: true } | { ok: false; error: string }>
    openOutput: (
      id: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    openInputInHandler: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    repeatWorkflowScenario: (id: string) => Promise<
      | { ok: true }
      | { ok: false; error: string }
      | {
          ok: false
          errorCode:
            | import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnFileError
            | import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnUrlError
        }
    >
  }
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void) => () => void
  onThemeChanged: (listener: (theme: ResolvedAppTheme) => void) => () => void
  onUiLocaleChanged: (listener: (locale: AppUiLocale) => void) => () => void
  onOpenEnginePaths: (listener: () => void) => () => void
  onOpenSettings: (
    listener: (
      section: import('../shared/app-settings-dialog-section').AppSettingsDialogSection
    ) => void
  ) => () => void
  onEnginePathsChanged: (listener: () => void) => () => void
  onSettingsBackupImported: (listener: () => void) => () => void
  onProcessingHistoryChanged: (listener: () => void) => () => void
  onOpenAbout: (listener: () => void) => () => void
  onOpenMediaFileUtilities: (listener: () => void) => () => void
  onOpenExternalFilterScript: (listener: () => void) => () => void
  onOpenWorkflowPlanner: (listener: () => void) => () => void
  onOpenWorkflowScenarioBuilder: (listener: () => void) => () => void
  onMainWindowUiPanelsChanged: (
    listener: (panels: MainWindowUiPanelState | undefined) => void
  ) => () => void
}
