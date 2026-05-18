import { describe, expect, it } from 'vitest'

import {
  buildWinPackagedManualSmokeChecklistFromLocaleShard,
  formatWinPackagedManualSmokeChecklistLines,
  WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST
} from '../../src/shared/win-packaged-manual-smoke-checklist'
import ruWinPackagedManualSmoke from '../../locales/ru/win-packaged-manual-smoke.json'

describe('win-packaged-manual-smoke-checklist §3', () => {
  it('builds one section from ru shard', () => {
    const sections = buildWinPackagedManualSmokeChecklistFromLocaleShard(
      ruWinPackagedManualSmoke as Record<string, string>
    )
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe('win-packaged')
    expect(sections[0]?.steps.length).toBeGreaterThanOrEqual(8)
  })

  it('formatWinPackagedManualSmokeChecklistLines includes doc and launch step', () => {
    const lines = formatWinPackagedManualSmokeChecklistLines()
    expect(lines.some((l) => l.includes('docs/RELEASE.md'))).toBe(true)
    expect(lines.some((l) => l.includes('step [launch]'))).toBe(true)
    expect(WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST[0]?.title.length).toBeGreaterThan(0)
  })
})
