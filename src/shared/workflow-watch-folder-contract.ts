/** §11 — ручной прогон сценария по файлу из редактора (не watch-folder задача). */
export const WORKFLOW_MANUAL_EDITOR_TASK_ID = 'manual-editor'

export type WorkflowRunScenarioOnFileError =
  | 'bad-args'
  | 'scenario-not-found'
  | 'path-missing'
  | 'path-denied'
  | 'no-export-step'

export type WorkflowRunScenarioOnUrlError =
  | WorkflowRunScenarioOnFileError
  | 'no-source-url'
  | 'download-start-failed'

/** §10 — событие runner: новый медиафайл в папке задачи. */
export type WorkflowWatchFolderDetectedPayload = {
  taskId: string
  taskTitle: string
  scenarioId: string
  filePath: string
  detectedAtUtc: string
}

export type WorkflowWatchFolderRunOutcome = 'success' | 'error' | 'skipped'

/** §10/§11 — итог авто-прогона сценария по файлу из watch-folder. */
export type WorkflowWatchFolderRunFinishedPayload = {
  taskId: string
  taskTitle: string
  scenarioId: string
  filePath: string
  outcome: WorkflowWatchFolderRunOutcome
  outputPath: string | null
  errorHint: string | null
  finishedAtUtc: string
}
