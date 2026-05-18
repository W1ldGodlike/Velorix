import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'

export const WORKFLOW_SCENARIO_VALID = {
  ...WORKFLOW_SCENARIO_TEMPLATE_V1,
  updatedAt: '2026-05-18T00:00:00.000Z'
}

export const WORKFLOW_SCENARIO_BAD_KIND = {
  ...WORKFLOW_SCENARIO_VALID,
  nodes: [{ id: 'x-1', kind: 'encode', label: 'Bad' }]
}
