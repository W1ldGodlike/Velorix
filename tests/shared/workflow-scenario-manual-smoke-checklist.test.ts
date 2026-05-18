import { describe, expect, it } from 'vitest'

import { buildWorkflowScenarioManualSmokeChecklistFromLocaleShard } from '../../src/shared/workflow-scenario-manual-smoke-checklist-build'
import { formatWorkflowScenarioManualSmokeChecklistLines } from '../../src/shared/workflow-scenario-manual-smoke-checklist'
import ruWorkflowScenarioManualSmoke from '../../locales/ru/workflow-scenario-manual-smoke.json'

describe('workflow-scenario-manual-smoke-checklist §11', () => {
  it('builds scenario builder section', () => {
    const sections = buildWorkflowScenarioManualSmokeChecklistFromLocaleShard(
      ruWorkflowScenarioManualSmoke as Record<string, string>
    )
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe('scenario-builder')
  })

  it('format lines mention constructor', () => {
    const joined = formatWorkflowScenarioManualSmokeChecklistLines().join('\n')
    expect(joined).toContain('Конструктор')
    expect(joined).toContain('step [add-link]')
  })
})
