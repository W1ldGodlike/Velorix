import type { AppUiLocale } from '../../../shared/app-ui-locale'
import type { AppSettings } from '../settings/settings-store'
import type { EnginePathOverrides } from '../engines/engine-service'

export type WorkflowScenarioRunnerHostAccess = {
  isExportBusy: () => boolean
  getSettings: () => AppSettings
  getEnginePathOverrides: () => EnginePathOverrides
  mainUiLocale: () => AppUiLocale
  rememberExportOutputPath: (filePath: string) => void
  rememberFfmpegExportDirectory: (outputPath: string) => void
}

let access: WorkflowScenarioRunnerHostAccess | null = null

export function configureWorkflowScenarioRunnerHost(next: WorkflowScenarioRunnerHostAccess): void {
  access = next
}

export function requireWorkflowScenarioRunnerHost(): WorkflowScenarioRunnerHostAccess {
  if (!access) {
    throw new Error('workflow-scenario-runner-host: configureWorkflowScenarioRunnerHost not called')
  }
  return access
}
