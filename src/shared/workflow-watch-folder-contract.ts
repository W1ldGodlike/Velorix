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
