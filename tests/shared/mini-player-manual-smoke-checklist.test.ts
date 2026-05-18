import { describe, expect, it } from 'vitest'

import { buildMiniPlayerManualSmokeChecklistFromLocaleShard } from '../../src/shared/mini-player-manual-smoke-checklist-build'
import { formatMiniPlayerManualSmokeChecklistLines } from '../../src/shared/mini-player-manual-smoke-checklist'
import ruMiniPlayerManualSmoke from '../../locales/ru/mini-player-manual-smoke.json'

describe('mini-player-manual-smoke-checklist §4.3', () => {
  it('builds mini-player section', () => {
    const sections = buildMiniPlayerManualSmokeChecklistFromLocaleShard(
      ruMiniPlayerManualSmoke as Record<string, string>
    )
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe('mini-player')
  })

  it('format lines mention service menu and snapshot tests', () => {
    const joined = formatMiniPlayerManualSmokeChecklistLines().join('\n')
    expect(joined).toContain('Мини-плеер')
    expect(joined).toContain('step [open]')
    expect(joined).toContain('mini-player-snapshot-build')
  })
})
