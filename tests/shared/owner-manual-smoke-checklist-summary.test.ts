import { describe, expect, it } from 'vitest'

import { summarizeManualSmokeChecklistSections } from '../../src/shared/owner-manual-smoke-checklist-summary'

describe('owner-manual-smoke-checklist-summary', () => {
  it('counts prerequisites, steps, and pass lines', () => {
    const counts = summarizeManualSmokeChecklistSections([
      {
        id: 'scenario-builder',
        title: 'Scenario',
        prerequisites: ['a', 'b'],
        steps: [{ id: 's1', text: 'one' }],
        pass: ['ok']
      }
    ])
    expect(counts).toEqual({
      sectionCount: 1,
      prerequisiteCount: 2,
      stepCount: 1,
      passCount: 1
    })
  })
})
