import { describe, expect, it } from 'vitest'

import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'
import { orderWorkflowScenarioNodes } from '../../src/shared/workflow-scenario-layout'

describe('workflow-scenario-layout §11', () => {
  it('orderWorkflowScenarioNodes follows edges download → process → save', () => {
    const ordered = orderWorkflowScenarioNodes(
      WORKFLOW_SCENARIO_TEMPLATE_V1.nodes,
      WORKFLOW_SCENARIO_TEMPLATE_V1.edges
    )
    expect(ordered.map((n) => n.kind)).toEqual(['download', 'process', 'save'])
  })
})
