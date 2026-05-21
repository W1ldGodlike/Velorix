import type { ProcessingHistoryEntry } from '../../../shared/processing-history-contract'
import { resolveWorkflowScenarioDownloadSourceUrl } from '../../../shared/workflow-scenario-url'
import type {
  WorkflowRunScenarioOnFileError,
  WorkflowRunScenarioOnUrlError
} from '../../../shared/workflow-watch-folder-contract'
import { findProcessingHistoryEntryById } from './processing-history'
import { getWorkflowScenario } from '../workflow/workflow-registry-service'
import { runWorkflowScenarioOnFile } from '../workflow/workflow-run-scenario-on-file'
import { runWorkflowScenarioOnUrl } from '../workflow/workflow-run-scenario-on-url'

export type RepeatWorkflowFromHistoryMetaError =
  | 'bad-id'
  | 'entry-not-found'
  | 'not-workflow'
  | 'no-scenario-id'

export type RepeatWorkflowFromHistoryResult =
  | { ok: true }
  | { ok: false; error: RepeatWorkflowFromHistoryMetaError }
  | { ok: false; error: WorkflowRunScenarioOnFileError }
  | { ok: false; error: WorkflowRunScenarioOnUrlError }

export async function repeatWorkflowFromHistoryEntry(
  entry: ProcessingHistoryEntry
): Promise<RepeatWorkflowFromHistoryResult> {
  if (entry.kind !== 'workflowScenario') {
    return { ok: false, error: 'not-workflow' }
  }
  const scenarioId = entry.workflowScenarioId?.trim() ?? ''
  if (!scenarioId) {
    return { ok: false, error: 'no-scenario-id' }
  }
  const scenario = getWorkflowScenario(scenarioId)
  if (!scenario) {
    return { ok: false, error: 'scenario-not-found' }
  }
  if (resolveWorkflowScenarioDownloadSourceUrl(scenario.nodes)) {
    return runWorkflowScenarioOnUrl(scenarioId, 'History')
  }
  return runWorkflowScenarioOnFile(scenarioId, entry.inputPath, 'History')
}

export async function repeatWorkflowScenarioFromHistoryId(
  userDataRoot: string,
  rawId: unknown
): Promise<RepeatWorkflowFromHistoryResult> {
  if (typeof rawId !== 'string' || rawId.trim().length === 0) {
    return { ok: false, error: 'bad-id' }
  }
  const entry = findProcessingHistoryEntryById(userDataRoot, rawId.trim())
  if (!entry) {
    return { ok: false, error: 'entry-not-found' }
  }
  return repeatWorkflowFromHistoryEntry(entry)
}
