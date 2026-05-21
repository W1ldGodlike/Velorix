import { existsSync } from 'node:fs'
import { normalize } from 'node:path'

import { buildWorkflowScenarioRunPlan } from '../../../shared/workflow-scenario-run-plan'
import {
  WORKFLOW_MANUAL_EDITOR_TASK_ID,
  type WorkflowRunScenarioOnFileError,
  type WorkflowWatchFolderDetectedPayload
} from '../../../shared/workflow-watch-folder-contract'
import { logInfo } from '../../core/logger-service'
import { grantMediaPath, isGrantedMediaPath } from '../../core/media-protocol'
import { getWorkflowScenario } from './workflow-registry-service'
import { enqueueWorkflowScenarioRun } from './workflow-scenario-runner'

export type WorkflowRunScenarioOnFileResult =
  | { ok: true }
  | { ok: false; error: WorkflowRunScenarioOnFileError }

/** §11 — очередь ffmpeg-сценария по пути из редактора (тот же runner, что watch-folder). */
export function runWorkflowScenarioOnFile(
  scenarioIdRaw: unknown,
  filePathRaw: unknown,
  taskTitleRaw: unknown
): WorkflowRunScenarioOnFileResult {
  const scenarioId = typeof scenarioIdRaw === 'string' ? scenarioIdRaw.trim() : ''
  const filePath = typeof filePathRaw === 'string' ? normalize(filePathRaw.trim()) : ''
  const taskTitle =
    typeof taskTitleRaw === 'string' && taskTitleRaw.trim().length > 0
      ? taskTitleRaw.trim()
      : 'Editor'
  if (!scenarioId || filePath.length === 0) {
    return { ok: false, error: 'bad-args' }
  }
  if (!existsSync(filePath)) {
    return { ok: false, error: 'path-missing' }
  }
  if (!isGrantedMediaPath(filePath)) {
    grantMediaPath(filePath)
    if (!isGrantedMediaPath(filePath)) {
      return { ok: false, error: 'path-denied' }
    }
  }
  const scenario = getWorkflowScenario(scenarioId)
  if (!scenario) {
    return { ok: false, error: 'scenario-not-found' }
  }
  const plan = buildWorkflowScenarioRunPlan(scenario, filePath)
  if (!plan) {
    return { ok: false, error: 'no-export-step' }
  }
  const payload: WorkflowWatchFolderDetectedPayload = {
    taskId: WORKFLOW_MANUAL_EDITOR_TASK_ID,
    taskTitle,
    scenarioId,
    filePath,
    detectedAtUtc: new Date().toISOString()
  }
  logInfo(
    'workflow',
    `manual scenario queued scenario=${scenarioId} file=${filePath} steps=${plan.steps.length}`
  )
  enqueueWorkflowScenarioRun(payload, scenario, true)
  return { ok: true }
}
