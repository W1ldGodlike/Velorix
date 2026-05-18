import { buildWorkflowScenarioRunPlan } from '../shared/workflow-scenario-run-plan'
import { resolveWorkflowScenarioDownloadSourceUrl } from '../shared/workflow-scenario-url'
import type { WorkflowRunScenarioOnUrlError } from '../shared/workflow-watch-folder-contract'
import { enqueueFirstWaitingUrlFromBlock } from './downloads-queue'
import { startDownloadSingleRow } from './downloads-queue-runner'
import { downloadsQueueRunnerState } from './downloads-queue-runner-state'
import { logInfo } from './logger-service'
import { getCachedSettings } from './main-cached-settings-host'
import { getWorkflowScenario } from './workflow-registry-service'
import { registerWorkflowScenarioYtdlpPending } from './workflow-scenario-ytdlp-complete'

export type WorkflowRunScenarioOnUrlResult =
  | { ok: true; rowId: number; started: boolean }
  | { ok: false; error: WorkflowRunScenarioOnUrlError }

/** §11 — yt-dlp по `sourceUrl` блока download, затем ffmpeg через pending hook. */
export async function runWorkflowScenarioOnUrl(
  scenarioIdRaw: unknown,
  taskTitleRaw: unknown
): Promise<WorkflowRunScenarioOnUrlResult> {
  const scenarioId = typeof scenarioIdRaw === 'string' ? scenarioIdRaw.trim() : ''
  const taskTitle =
    typeof taskTitleRaw === 'string' && taskTitleRaw.trim().length > 0
      ? taskTitleRaw.trim()
      : 'Scenario URL'
  if (!scenarioId) {
    return { ok: false, error: 'bad-args' }
  }
  const scenario = getWorkflowScenario(scenarioId)
  if (!scenario) {
    return { ok: false, error: 'scenario-not-found' }
  }
  const sourceUrl = resolveWorkflowScenarioDownloadSourceUrl(scenario.nodes)
  if (!sourceUrl) {
    return { ok: false, error: 'no-source-url' }
  }
  const plan = buildWorkflowScenarioRunPlan(scenario, 'C:\\placeholder.mp4')
  if (!plan) {
    return { ok: false, error: 'no-export-step' }
  }
  const enq = enqueueFirstWaitingUrlFromBlock(sourceUrl)
  if (!enq) {
    return { ok: false, error: 'bad-args' }
  }
  registerWorkflowScenarioYtdlpPending(enq.id, scenario, taskTitle)
  logInfo(
    'workflow',
    `scenario url queued row=${enq.id} scenario=${scenarioId} url=${sourceUrl.slice(0, 80)}`
  )
  if (downloadsQueueRunnerState.sequentialBusy) {
    return { ok: true, rowId: enq.id, started: false }
  }
  const locale = getCachedSettings().uiLocale ?? 'ru'
  const start = await startDownloadSingleRow(enq.id, locale)
  if (!start.ok) {
    return { ok: false, error: 'download-start-failed' }
  }
  return { ok: true, rowId: enq.id, started: true }
}
