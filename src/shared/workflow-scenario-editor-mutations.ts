import type {
  WorkflowScenarioDocument,
  WorkflowScenarioNode,
  WorkflowScenarioNodeKind
} from './workflow-scenario-contract'
import {
  applyWorkflowScenarioNodeOrder,
  orderWorkflowScenarioNodes
} from './workflow-scenario-layout'

function nodeIdPrefix(kind: WorkflowScenarioNodeKind): string {
  if (kind === 'download') {
    return 'download'
  }
  if (kind === 'process') {
    return 'process'
  }
  return 'save'
}

/** Уникальный id узла (`download-1`, `process-2`, …). */
export function allocateWorkflowScenarioNodeId(
  kind: WorkflowScenarioNodeKind,
  existing: readonly WorkflowScenarioNode[]
): string {
  const prefix = nodeIdPrefix(kind)
  let index = 1
  while (existing.some((n) => n.id === `${prefix}-${index}`)) {
    index += 1
  }
  return `${prefix}-${index}`
}

export function appendWorkflowScenarioNode(
  scenario: WorkflowScenarioDocument,
  node: WorkflowScenarioNode
): WorkflowScenarioDocument {
  const ordered = orderWorkflowScenarioNodes(scenario.nodes, scenario.edges)
  const ids = [...ordered.map((n) => n.id), node.id]
  const nodes = [...scenario.nodes, node]
  const next = applyWorkflowScenarioNodeOrder({ ...scenario, nodes }, ids)
  if (!next) {
    return scenario
  }
  return next
}

export function removeWorkflowScenarioNode(
  scenario: WorkflowScenarioDocument,
  nodeId: string
): WorkflowScenarioDocument | null {
  if (scenario.nodes.length <= 1) {
    return null
  }
  if (!scenario.nodes.some((n) => n.id === nodeId)) {
    return null
  }
  const nodes = scenario.nodes.filter((n) => n.id !== nodeId)
  const ordered = orderWorkflowScenarioNodes(scenario.nodes, scenario.edges).filter(
    (n) => n.id !== nodeId
  )
  return applyWorkflowScenarioNodeOrder(
    { ...scenario, nodes },
    ordered.map((n) => n.id)
  )
}
