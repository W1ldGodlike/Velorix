import { describe, expect, it } from 'vitest'

import { windowsScheduledTaskName } from '../../src/main/windows-task-scheduler-sync'

describe('windows-task-scheduler-sync §10', () => {
  it('builds stable schtasks TN', () => {
    expect(windowsScheduledTaskName('task-watch-abc')).toBe('\\FluxAlloy\\watch-task-watch-abc')
  })
})
