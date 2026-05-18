import { describe, expect, it } from 'vitest'

import {
  buildLinuxSystemdServiceUnit,
  buildLinuxSystemdTimerUnit,
  linuxSystemdTimerUnitPath,
  linuxSystemdWatchUnitBase
} from '../../src/main/linux-systemd-user-timer-sync'
import { SCHEDULED_TASK_TEMPLATE_V1 } from '../../src/shared/scheduled-task-contract'

describe('linux-systemd-user-timer-sync §10', () => {
  it('builds stable systemd unit base name', () => {
    expect(linuxSystemdWatchUnitBase('task-watch-abc')).toBe('fluxalloy-watch-task-watch-abc')
  })

  it('timer unit path under ~/.config/systemd/user', () => {
    expect(linuxSystemdTimerUnitPath('task-watch-1')).toMatch(
      /\.config[/\\]systemd[/\\]user[/\\]fluxalloy-watch-task-watch-1\.timer$/
    )
  })

  it('service unit includes tick argv', () => {
    const doc = {
      ...SCHEDULED_TASK_TEMPLATE_V1,
      id: 'task-watch-2',
      backend: 'linux-systemd-user-timer' as const
    }
    const unit = buildLinuxSystemdServiceUnit(doc)
    expect(unit).toContain('Type=oneshot')
    expect(unit).toContain('--workflow-watch-folder-tick')
  })

  it('timer unit uses OnUnitActiveSec from poll interval', () => {
    const doc = {
      ...SCHEDULED_TASK_TEMPLATE_V1,
      id: 'task-watch-3',
      backend: 'linux-systemd-user-timer' as const,
      pollIntervalSec: 45
    }
    const unit = buildLinuxSystemdTimerUnit(doc)
    expect(unit).toContain('OnUnitActiveSec=45s')
    expect(unit).toContain('fluxalloy-watch-task-watch-3.service')
  })
})
