import { describe, expect, it } from 'vitest'

import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'
import {
  addWorkflowScenarioEdge,
  listWorkflowScenarioNonAdjacentEdges,
  removeWorkflowScenarioEdge
} from '../../src/shared/workflow-scenario-edge-mutations'

describe('workflow-scenario-edge-mutations §11', () => {
  it('adds and removes an edge', () => {
    const doc = WORKFLOW_SCENARIO_TEMPLATE_V1
    expect(addWorkflowScenarioEdge(doc, 'download-1', 'save-1')).toEqual({
      ...doc,
      edges: [...doc.edges, { from: 'download-1', to: 'save-1' }]
    })
    const withSkip = addWorkflowScenarioEdge(doc, 'download-1', 'save-1')!
    expect(removeWorkflowScenarioEdge(withSkip, 'download-1', 'save-1')!.edges).toEqual(doc.edges)
  })

  it('rejects self-loop and duplicate', () => {
    const doc = WORKFLOW_SCENARIO_TEMPLATE_V1
    expect(addWorkflowScenarioEdge(doc, 'process-1', 'process-1')).toBeNull()
    expect(addWorkflowScenarioEdge(doc, 'download-1', 'process-1')).toBeNull()
  })

  it('lists non-adjacent edges in topo order', () => {
    const doc = WORKFLOW_SCENARIO_TEMPLATE_V1
    const withSkip = addWorkflowScenarioEdge(doc, 'download-1', 'save-1')!
    expect(listWorkflowScenarioNonAdjacentEdges(withSkip)).toEqual([
      { from: 'download-1', to: 'save-1' }
    ])
  })
})
