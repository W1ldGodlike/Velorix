import { app } from 'electron'

import { isWorkflowWatchFolderTickArgv } from '../shared/workflow-cli-args'
import { bootstrapMainApplicationHosts } from './main-application-bootstrap-hosts'
import { logInfo } from './logger-service'
import { runWorkflowWatchFolderHeadlessTick } from './workflow-watch-folder-runner'
import { whenWorkflowScenarioRunnerIdle } from './workflow-scenario-runner'

/** §10 — tick без главного окна; вызывать из `index.ts` до полного bootstrap UI. */
export async function runWorkflowHeadlessTickIfRequested(): Promise<boolean> {
  if (!isWorkflowWatchFolderTickArgv()) {
    return false
  }
  await app.whenReady()
  bootstrapMainApplicationHosts()
  logInfo('workflow', 'headless watch-folder tick start')
  runWorkflowWatchFolderHeadlessTick()
  await whenWorkflowScenarioRunnerIdle()
  logInfo('workflow', 'headless watch-folder tick done')
  app.quit()
  return true
}
