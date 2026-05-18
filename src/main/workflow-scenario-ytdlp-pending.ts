import type { WorkflowScenarioDocument } from '../shared/workflow-scenario-contract'

type Pending = {
  scenario: WorkflowScenarioDocument
  taskTitle: string
}

const pendingByRowId = new Map<number, Pending>()

export function registerWorkflowScenarioYtdlpPending(
  rowId: number,
  scenario: WorkflowScenarioDocument,
  taskTitle: string
): void {
  pendingByRowId.set(rowId, { scenario, taskTitle })
}

export function takeWorkflowScenarioYtdlpPending(rowId: number): Pending | null {
  const hit = pendingByRowId.get(rowId)
  if (!hit) {
    return null
  }
  pendingByRowId.delete(rowId)
  return hit
}

export function hasWorkflowScenarioYtdlpPending(rowId: number): boolean {
  return pendingByRowId.has(rowId)
}
