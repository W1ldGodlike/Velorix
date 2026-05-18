import type {
  WorkflowScenarioEdge,
  WorkflowScenarioNode,
  WorkflowScenarioNodeKind
} from './workflow-scenario-contract'

/** Упорядочивание узлов по рёбрам (Kahn); при цикле — порядок в JSON. */
export function orderWorkflowScenarioNodes(
  nodes: readonly WorkflowScenarioNode[],
  edges: readonly WorkflowScenarioEdge[]
): WorkflowScenarioNode[] {
  if (nodes.length === 0) {
    return []
  }
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const indegree = new Map<string, number>()
  const adj = new Map<string, string[]>()
  for (const n of nodes) {
    indegree.set(n.id, 0)
    adj.set(n.id, [])
  }
  for (const e of edges) {
    if (!byId.has(e.from) || !byId.has(e.to)) {
      continue
    }
    adj.get(e.from)?.push(e.to)
    indegree.set(e.to, (indegree.get(e.to) ?? 0) + 1)
  }
  const queue: string[] = []
  for (const [id, deg] of indegree) {
    if (deg === 0) {
      queue.push(id)
    }
  }
  const ordered: WorkflowScenarioNode[] = []
  while (queue.length > 0) {
    const id = queue.shift()
    if (!id) {
      break
    }
    const node = byId.get(id)
    if (node) {
      ordered.push(node)
    }
    for (const next of adj.get(id) ?? []) {
      const d = (indegree.get(next) ?? 0) - 1
      indegree.set(next, d)
      if (d === 0) {
        queue.push(next)
      }
    }
  }
  if (ordered.length < nodes.length) {
    for (const n of nodes) {
      if (!ordered.some((o) => o.id === n.id)) {
        ordered.push(n)
      }
    }
  }
  return ordered
}

export function workflowScenarioNodeKindLabelKey(
  kind: WorkflowScenarioNodeKind
): 'workflowScenarioKindDownload' | 'workflowScenarioKindProcess' | 'workflowScenarioKindSave' {
  switch (kind) {
    case 'download':
      return 'workflowScenarioKindDownload'
    case 'process':
      return 'workflowScenarioKindProcess'
    case 'save':
      return 'workflowScenarioKindSave'
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}
