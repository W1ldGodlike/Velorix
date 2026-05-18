import { describe, expect, it } from 'vitest'

import { buildWindowsShellManualSmokeChecklistFromLocaleShard } from '../../src/shared/windows-shell-manual-smoke-checklist-build'
import { formatWindowsShellManualSmokeChecklistLines } from '../../src/shared/windows-shell-manual-smoke-checklist'
import ruWindowsShellManualSmoke from '../../locales/ru/windows-shell-manual-smoke.json'

describe('windows-shell-manual-smoke-checklist §14', () => {
  it('builds one section from ru shard', () => {
    const sections = buildWindowsShellManualSmokeChecklistFromLocaleShard(
      ruWindowsShellManualSmoke as Record<string, string>
    )
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe('win-shell')
    expect(sections[0]?.steps.length).toBe(6)
  })

  it('format lines mention Explorer', () => {
    const joined = formatWindowsShellManualSmokeChecklistLines().join('\n')
    expect(joined).toContain('Проводник')
    expect(joined).toContain('step [context-open]')
  })
})
