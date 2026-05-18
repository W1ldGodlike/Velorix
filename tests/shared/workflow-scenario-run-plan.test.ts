import { describe, expect, it } from 'vitest'

import { WORKFLOW_SCENARIO_TEMPLATE_V1 } from '../../src/shared/workflow-scenario-contract'
import { buildWorkflowScenarioRunPlan } from '../../src/shared/workflow-scenario-run-plan'

describe('workflow-scenario-run-plan §11', () => {
  it('builds ffmpeg-export plan for template', () => {
    const plan = buildWorkflowScenarioRunPlan(
      WORKFLOW_SCENARIO_TEMPLATE_V1,
      'C:\\in\\clip.mp4'
    )
    expect(plan?.saveDirectory).toBeTruthy()
    expect(plan?.steps.some((s) => s.kind === 'ffmpeg-export')).toBe(true)
    expect(plan?.steps[0]?.kind).toBe('passthrough-local')
  })

  it('returns null without process node', () => {
    const plan = buildWorkflowScenarioRunPlan(
      {
        ...WORKFLOW_SCENARIO_TEMPLATE_V1,
        nodes: [{ id: 'save-1', kind: 'save', label: 'Save' }],
        edges: []
      },
      'C:\\in\\clip.mp4'
    )
    expect(plan).toBeNull()
  })
})
