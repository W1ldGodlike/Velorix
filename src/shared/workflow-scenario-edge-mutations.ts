import type { WorkflowScenarioDocument } from './workflow-scenario-contract'
import { orderWorkflowScenarioNodes } from './workflow-scenario-layout'

function hasNode(scenario: WorkflowScenarioDocument, id: string): boolean {
  return scenario.nodes.some((n) => n.id === id)
}

/** Добавить ребро «from → to» (без дубликатов и петель). */
export function addWorkflowScenarioEdge(
  scenario: WorkflowScenarioDocument,
  from: string,
  to: string
): WorkflowScenarioDocument | null {
  if (from === to) {
    return null
  }
  if (!hasNode(scenario, from) || !hasNode(scenario, to)) {
    return null
  }
  if (scenario.edges.some((e) => e.from === from && e.to === to)) {
    return null
  }
  return {
    ...scenario,
    edges: [...scenario.edges, { from, to }]
  }
}

/** Удалить ребро «from → to». */
export function removeWorkflowScenarioEdge(
  scenario: WorkflowScenarioDocument,
  from: string,
  to: string
): WorkflowScenarioDocument | null {
  const edges = scenario.edges.filter((e) => !(e.from === from && e.to === to))
  if (edges.length === scenario.edges.length) {
    return null
  }
  return { ...scenario, edges }
}

/** Рёбра, которые не совпадают со стрелкой между соседними узлами в topo-порядке. */
export function listWorkflowScenarioNonAdjacentEdges(
  scenario: WorkflowScenarioDocument
): { from: string; to: string }[] {
  const ordered = orderWorkflowScenarioNodes(scenario.nodes, scenario.edges)
  const extra: { from: string; to: string }[] = []
  for (const edge of scenario.edges) {
    const fromIdx = ordered.findIndex((n) => n.id === edge.from)
    const toIdx = ordered.findIndex((n) => n.id === edge.to)
    if (fromIdx < 0 || toIdx < 0) {
      continue
    }
    if (toIdx !== fromIdx + 1) {
      extra.push(edge)
    }
  }
  return extra
}
