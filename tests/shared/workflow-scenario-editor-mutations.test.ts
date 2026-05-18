import { describe, expect, it } from 'vitest'

import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'
import {
  allocateWorkflowScenarioNodeId,
  appendWorkflowScenarioNode,
  removeWorkflowScenarioNode
} from '../../src/shared/workflow-scenario-editor-mutations'
import { orderWorkflowScenarioNodes } from '../../src/shared/workflow-scenario-layout'

describe('workflow-scenario-editor-mutations §11', () => {
  it('allocates unique node ids', () => {
    const doc = WORKFLOW_SCENARIO_TEMPLATE_V1
    expect(allocateWorkflowScenarioNodeId('download', doc.nodes)).toBe('download-2')
  })

  it('appends node and rewires linear edges', () => {
    const doc = WORKFLOW_SCENARIO_TEMPLATE_V1
    const node = {
      id: allocateWorkflowScenarioNodeId('process', doc.nodes),
      kind: 'process' as const,
      label: 'Extra'
    }
    const next = appendWorkflowScenarioNode(doc, node)
    expect(next.nodes).toHaveLength(4)
    expect(next.edges.at(-1)).toEqual({ from: 'save-1', to: node.id })
    expect(orderWorkflowScenarioNodes(next.nodes, next.edges).at(-1)?.id).toBe(node.id)
  })

  it('removes node when more than one remains', () => {
    const doc = WORKFLOW_SCENARIO_TEMPLATE_V1
    const next = removeWorkflowScenarioNode(doc, 'process-1')
    expect(next).not.toBeNull()
    expect(next!.nodes.map((n) => n.id)).toEqual(['download-1', 'save-1'])
    const oneLeft = removeWorkflowScenarioNode(next!, 'download-1')
    expect(oneLeft?.nodes.map((n) => n.id)).toEqual(['save-1'])
    expect(removeWorkflowScenarioNode(oneLeft!, 'save-1')).toBeNull()
  })
})
