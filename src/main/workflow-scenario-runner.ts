import { mkdirSync } from 'node:fs'

import type { WorkflowScenarioDocument } from '../shared/workflow-scenario-contract'
import { buildWorkflowScenarioRunPlan } from '../shared/workflow-scenario-run-plan'
import type {
  WorkflowWatchFolderDetectedPayload,
  WorkflowWatchFolderRunFinishedPayload
} from '../shared/workflow-watch-folder-contract'
import { resolveAppPaths } from './app-paths'
import { pickUniqueAutoExportOutputPath } from './ffmpeg-export-resolve-from-settings'
import { resolveFfmpegExportJobOptionsFromAppSettings } from './ffmpeg-export-resolve-from-settings'
import { runFfmpegExportJob } from './ffmpeg-export-service'
import { resolveEngineExecutablePath } from './engine-service'
import { logInfo } from './logger-service'
import { appendProcessingHistoryEntry } from './processing-history'
import { broadcastWorkflowWatchFolderRunFinished } from './workflow-watch-folder-broadcast'
import { requireWorkflowScenarioRunnerHost } from './workflow-scenario-runner-host'

type PendingRun = {
  payload: WorkflowWatchFolderDetectedPayload
  scenario: WorkflowScenarioDocument
  execute: boolean
}

const queue: PendingRun[] = []
let draining = false

function finishPayload(
  base: WorkflowWatchFolderDetectedPayload,
  outcome: WorkflowWatchFolderRunFinishedPayload['outcome'],
  outputPath: string | null,
  errorHint: string | null
): WorkflowWatchFolderRunFinishedPayload {
  return {
    taskId: base.taskId,
    taskTitle: base.taskTitle,
    scenarioId: base.scenarioId,
    filePath: base.filePath,
    outcome,
    outputPath,
    errorHint,
    finishedAtUtc: new Date().toISOString()
  }
}

async function executeRun(item: PendingRun): Promise<void> {
  const host = requireWorkflowScenarioRunnerHost()
  const { payload, scenario, execute } = item
  if (!execute) {
    broadcastWorkflowWatchFolderRunFinished(
      finishPayload(payload, 'skipped', null, 'executeScenarioOnDetect=false')
    )
    return
  }
  const plan = buildWorkflowScenarioRunPlan(scenario, payload.filePath)
  if (!plan) {
    broadcastWorkflowWatchFolderRunFinished(
      finishPayload(payload, 'error', null, 'no-ffmpeg-export-step')
    )
    return
  }
  if (host.isExportBusy()) {
    logInfo('workflow', `scenario run skipped busy task=${payload.taskId} file=${payload.filePath}`)
    broadcastWorkflowWatchFolderRunFinished(finishPayload(payload, 'skipped', null, 'export-busy'))
    return
  }
  const paths = resolveAppPaths()
  const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', host.getEnginePathOverrides())
  if (!ffmpeg) {
    broadcastWorkflowWatchFolderRunFinished(
      finishPayload(payload, 'error', null, 'ffmpeg-not-found')
    )
    return
  }
  const settings = host.getSettings()
  const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(settings, undefined)
  try {
    mkdirSync(plan.saveDirectory, { recursive: true })
  } catch {
    /* may exist */
  }
  const outPath = pickUniqueAutoExportOutputPath(
    plan.inputPath,
    exportOpts.container,
    '_workflow',
    plan.saveDirectory
  )
  const startedAt = Date.now()
  const runAbort = new AbortController()
  logInfo(
    'workflow',
    `scenario run start task=${payload.taskId} in=${plan.inputPath} out=${outPath}`
  )
  const result = await runFfmpegExportJob({
    ffmpegPath: ffmpeg,
    inputPath: plan.inputPath,
    outputPath: outPath,
    probeDurationSec: null,
    ...exportOpts,
    lutResourcesRoot: paths.resources,
    signal: runAbort.signal,
    onProgress: () => {},
    uiLocale: host.mainUiLocale()
  })
  const finishedAt = Date.now()
  if (result.ok) {
    host.rememberExportOutputPath(outPath)
    host.rememberFfmpegExportDirectory(outPath)
    appendProcessingHistoryEntry(paths.userData, {
      kind: 'workflowScenario',
      startedAt,
      finishedAt,
      inputPath: plan.inputPath,
      outputPath: outPath,
      outcome: 'success',
      status: `workflow ${scenario.title}`,
      errorHint: null,
      exportVideoCodecUsed: result.videoCodecUsed
    })
    broadcastWorkflowWatchFolderRunFinished(
      finishPayload(payload, 'success', outPath, null)
    )
    return
  }
  appendProcessingHistoryEntry(paths.userData, {
    kind: 'workflowScenario',
    startedAt,
    finishedAt,
    inputPath: plan.inputPath,
    outputPath: outPath,
    outcome: 'error',
    status: `workflow ${scenario.title}`,
    errorHint: result.error,
    exportVideoCodecUsed: result.videoCodecUsed
  })
  broadcastWorkflowWatchFolderRunFinished(
    finishPayload(payload, 'error', outPath, result.error)
  )
}

async function drainQueue(): Promise<void> {
  if (draining) {
    return
  }
  draining = true
  try {
    while (queue.length > 0) {
      const item = queue.shift()
      if (!item) {
        break
      }
      try {
        await executeRun(item)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        logInfo('workflow', `scenario run error: ${msg}`)
        broadcastWorkflowWatchFolderRunFinished(
          finishPayload(item.payload, 'error', null, msg)
        )
      }
    }
  } finally {
    draining = false
  }
}

/** §11 — поставить прогон сценария в очередь (последовательно, один ffmpeg). */
export function enqueueWorkflowScenarioRun(
  payload: WorkflowWatchFolderDetectedPayload,
  scenario: WorkflowScenarioDocument,
  executeScenarioOnDetect: boolean
): void {
  queue.push({ payload, scenario, execute: executeScenarioOnDetect })
  void drainQueue()
}
