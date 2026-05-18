import { describe, expect, it } from 'vitest'

import {
  buildLinuxPackagedManualSmokeChecklistFromLocaleShard,
  formatLinuxPackagedManualSmokeChecklistLines,
  LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST
} from '../../src/shared/linux-packaged-manual-smoke-checklist'
import {
  buildMacosPackagedManualSmokeChecklistFromLocaleShard,
  formatMacosPackagedManualSmokeChecklistLines,
  MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST
} from '../../src/shared/macos-packaged-manual-smoke-checklist'
import {
  buildWinPackagedManualSmokeChecklistFromLocaleShard,
  formatWinPackagedManualSmokeChecklistLines,
  WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST
} from '../../src/shared/win-packaged-manual-smoke-checklist'
import ruLinuxPackagedManualSmoke from '../../locales/ru/linux-packaged-manual-smoke.json'
import ruMacosPackagedManualSmoke from '../../locales/ru/macos-packaged-manual-smoke.json'
import ruWinPackagedManualSmoke from '../../locales/ru/win-packaged-manual-smoke.json'

describe('packaged-manual-smoke-checklist §3', () => {
  it.each([
    {
      id: 'win-packaged',
      build: () =>
        buildWinPackagedManualSmokeChecklistFromLocaleShard(
          ruWinPackagedManualSmoke as Record<string, string>
        ),
      format: formatWinPackagedManualSmokeChecklistLines,
      doc: 'docs/RELEASE.md §4',
      canon: WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST
    },
    {
      id: 'linux-packaged',
      build: () =>
        buildLinuxPackagedManualSmokeChecklistFromLocaleShard(
          ruLinuxPackagedManualSmoke as Record<string, string>
        ),
      format: formatLinuxPackagedManualSmokeChecklistLines,
      doc: 'docs/RELEASE.md §4.1',
      canon: LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST
    },
    {
      id: 'macos-packaged',
      build: () =>
        buildMacosPackagedManualSmokeChecklistFromLocaleShard(
          ruMacosPackagedManualSmoke as Record<string, string>
        ),
      format: formatMacosPackagedManualSmokeChecklistLines,
      doc: 'docs/RELEASE.md §4.2',
      canon: MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST
    }
  ])('$id builds one section with launch step', ({ id, build, format, doc, canon }) => {
    const sections = build()
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe(id)
    expect(sections[0]?.steps.length).toBeGreaterThanOrEqual(8)
    const lines = format()
    expect(lines.some((l) => l.includes(doc))).toBe(true)
    expect(lines.some((l) => l.includes('step [launch]'))).toBe(true)
    expect(lines.some((l) => l.includes('step [mini-player]'))).toBe(true)
    expect(canon[0]?.title.length).toBeGreaterThan(0)
  })
})
