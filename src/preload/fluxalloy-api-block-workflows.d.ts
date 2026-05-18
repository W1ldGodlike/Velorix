/**
 * Типизированный контракт preload -> renderer (фрагмент FluxAlloyApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type { AppAboutInfo } from '../shared/about-contract'
import type { AppUiLocale } from '../shared/app-ui-locale'
import type {
  SaveTextDialogPayload,
  SaveTextDialogResult
} from '../shared/save-text-dialog-contract'
export type FluxAlloyApiWorkflowsBlock = {
  saveTextWithDialog: (payload: SaveTextDialogPayload) => Promise<SaveTextDialogResult>
  about: {
    getInfo: () => Promise<AppAboutInfo>
  }
  externalFilterScript: {
    pickFile: (payload: {
      kind: import('../shared/external-filter-script-contract').ExternalFilterScriptKind
      uiLocale?: import('../shared/app-ui-locale').AppUiLocale
    }) => Promise<
      import('../shared/external-filter-script-contract').ExternalFilterScriptPickResult
    >
    apply: (
      payload: import('../shared/external-filter-script-contract').ExternalFilterScriptApplyPayload & {
        uiLocale?: import('../shared/app-ui-locale').AppUiLocale
      }
    ) => Promise<
      import('../shared/external-filter-script-contract').ExternalFilterScriptApplyResult
    >
  }
  workflows: {
    listScenarios: () => Promise<
      | {
          ok: true
          items: import('../shared/workflow-scenario-contract').WorkflowScenarioListItem[]
        }
      | { ok: false; error: string }
    >
    getScenario: (id: string) => Promise<
      | {
          ok: true
          scenario: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
        }
      | { ok: false; error: string }
    >
    saveScenario: (
      doc: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
    ) => Promise<
      | {
          ok: true
          scenario: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
        }
      | { ok: false; error: string }
    >
    deleteScenario: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    listScheduledTasks: () => Promise<
      | { ok: true; items: import('../shared/scheduled-task-contract').ScheduledTaskListItem[] }
      | { ok: false; error: string }
    >
    saveScheduledTask: (
      doc: import('../shared/scheduled-task-contract').ScheduledTaskDocument
    ) => Promise<
      | {
          ok: true
          task: import('../shared/scheduled-task-contract').ScheduledTaskDocument
          osSchedulerWarning?: string
        }
      | { ok: false; error: string }
    >
    deleteScheduledTask: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    setScheduledTaskEnabled: (
      id: string,
      enabled: boolean
    ) => Promise<{ ok: true; osSchedulerWarning?: string } | { ok: false; error: string }>
    capabilities: () => Promise<
      | {
          ok: true
          windowsTaskScheduler: boolean
          macosLaunchd: boolean
          linuxSystemdUserTimer: boolean
        }
      | { ok: false; error: string }
    >
    pickWatchFolder: () => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    runScenarioOnFile: (
      scenarioId: string,
      filePath: string,
      taskTitle: string
    ) => Promise<
      | { ok: true }
      | {
          ok: false
          error: import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnFileError
        }
    >
    runScenarioOnUrl: (
      scenarioId: string,
      taskTitle: string
    ) => Promise<
      | { ok: true; rowId: number; started: boolean }
      | {
          ok: false
          error: import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnUrlError
        }
    >
    onWatchFolderDetected: (
      listener: (
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderDetectedPayload
      ) => void
    ) => () => void
    onWatchFolderRunFinished: (
      listener: (
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderRunFinishedPayload
      ) => void
    ) => () => void
  }
}
