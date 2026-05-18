import { describe, expect, it } from 'vitest'

import { buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard } from '../../src/shared/workflow-os-scheduler-manual-smoke-checklist-build'
import ruWorkflowOsSchedulerManualSmoke from '../../locales/ru/workflow-os-scheduler-manual-smoke.json'

describe('workflow-os-scheduler-manual-smoke-checklist-build §10', () => {
  it('builds three platform sections from ru shard', () => {
    const sections = buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard(
      ruWorkflowOsSchedulerManualSmoke as Record<string, string>
    )
    expect(sections).toHaveLength(3)
    expect(sections.map((s) => s.id)).toEqual([
      'win-scheduler',
      'macos-scheduler',
      'linux-scheduler'
    ])
    expect(sections[0]?.steps.length).toBeGreaterThanOrEqual(5)
  })

  it('filters sections by platform', () => {
    const sections = buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard(
      ruWorkflowOsSchedulerManualSmoke as Record<string, string>,
      { platforms: ['win'] }
    )
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe('win-scheduler')
  })
})
