import { describe, expect, it } from 'vitest'

import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'
import {
  applyWorkflowScenarioNodeOrder,
  buildLinearWorkflowScenarioEdges,
  orderWorkflowScenarioNodes
} from '../../src/shared/workflow-scenario-layout'

describe('workflow-scenario-layout reorder §11', () => {
  it('builds linear edges', () => {
    expect(buildLinearWorkflowScenarioEdges(['a', 'b', 'c'])).toEqual([
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' }
    ])
  })

  it('reorders nodes and rewires edges', () => {
    const doc = {
      ...WORKFLOW_SCENARIO_TEMPLATE_V1,
      nodes: [
        { id: 'a', kind: 'download' as const, label: 'A' },
        { id: 'b', kind: 'process' as const, label: 'B' },
        { id: 'c', kind: 'save' as const, label: 'C' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]
    }
    const next = applyWorkflowScenarioNodeOrder(doc, ['c', 'a', 'b'])
    expect(next).not.toBeNull()
    expect(next!.nodes.map((n) => n.id)).toEqual(['c', 'a', 'b'])
    expect(next!.edges).toEqual([
      { from: 'c', to: 'a' },
      { from: 'a', to: 'b' }
    ])
    expect(orderWorkflowScenarioNodes(next!.nodes, next!.edges).map((n) => n.id)).toEqual([
      'c',
      'a',
      'b'
    ])
  })
})
