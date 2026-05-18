import { describe, expect, it } from 'vitest'

import {
  buildMacosLaunchAgentPlist,
  escapeLaunchdPlistXml,
  macosLaunchAgentLabel,
  macosLaunchAgentPlistPath
} from '../../src/main/macos-launchd-sync'
import { SCHEDULED_TASK_TEMPLATE_V1 } from '../../src/shared/scheduled-task-contract'

describe('macos-launchd-sync §10', () => {
  it('builds stable launchd label', () => {
    expect(macosLaunchAgentLabel('task-watch-abc')).toBe('com.fluxalloy.watch.task-watch-abc')
  })

  it('plist path under LaunchAgents', () => {
    expect(macosLaunchAgentPlistPath('com.fluxalloy.watch.x')).toMatch(
      /LaunchAgents[/\\]com\.fluxalloy\.watch\.x\.plist$/
    )
  })

  it('plist includes StartInterval and tick argv', () => {
    const doc = {
      ...SCHEDULED_TASK_TEMPLATE_V1,
      id: 'task-watch-1',
      backend: 'macos-launchd' as const,
      pollIntervalSec: 120
    }
    const xml = buildMacosLaunchAgentPlist(doc)
    expect(xml).toContain('<key>StartInterval</key>')
    expect(xml).toContain('<integer>120</integer>')
    expect(xml).toContain('--workflow-watch-folder-tick')
    expect(xml).toContain('com.fluxalloy.watch.task-watch-1')
  })

  it('escapeLaunchdPlistXml escapes special chars', () => {
    expect(escapeLaunchdPlistXml('a&b<c>"')).toBe('a&amp;b&lt;c&gt;&quot;')
  })
})
