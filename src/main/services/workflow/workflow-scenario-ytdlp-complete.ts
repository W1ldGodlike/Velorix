import { grantMediaPath } from '../../core/media-protocol'
import { logInfo } from '../../core/logger-service'
import { enqueueWorkflowScenarioRun } from './workflow-scenario-runner'
import {
  registerWorkflowScenarioYtdlpPending,
  takeWorkflowScenarioYtdlpPending
} from './workflow-scenario-ytdlp-pending'

/** §11 — после успешного yt-dlp запустить ffmpeg-сценарий вместо авто-open. */
export function tryRunWorkflowScenarioAfterYtdlpDownload(
  rowId: number,
  outputPath: string
): boolean {
  const pending = takeWorkflowScenarioYtdlpPending(rowId)
  if (!pending) {
    return false
  }
  grantMediaPath(outputPath)
  const payload = {
    taskId: 'workflow-url',
    taskTitle: pending.taskTitle,
    scenarioId: pending.scenario.id,
    filePath: outputPath,
    detectedAtUtc: new Date().toISOString()
  }
  logInfo(
    'workflow',
    `scenario url download done row=${rowId} file=${outputPath} scenario=${pending.scenario.id}`
  )
  enqueueWorkflowScenarioRun(payload, pending.scenario, true)
  return true
}

export { registerWorkflowScenarioYtdlpPending }
