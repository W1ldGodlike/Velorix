import { describe, expect, it } from 'vitest'

import { formatOwnerManualSmokeHidpiChecklistLinesFromShard } from '../../src/shared/owner-manual-smoke-hidpi-lines'
import { formatOwnerManualSmokeThemeChecklistLinesFromShard } from '../../src/shared/owner-manual-smoke-theme-lines'
import enSettings from '../../locales/en/settings.json'
import ruSettings from '../../locales/ru/settings.json'

describe('owner-manual-smoke visual locale §2.2/§16', () => {
  it('en theme lines use settings shard keys', () => {
    const lines = formatOwnerManualSmokeThemeChecklistLinesFromShard(
      enSettings as Record<string, string>
    )
    const joined = lines.join('\n')
    expect(joined).toContain('owner: Theme')
    expect(joined).toContain('accent')
    expect(joined).toContain('Inspector')
  })

  it('ru and en hidpi headers differ but share checklist shape', () => {
    const ru = formatOwnerManualSmokeHidpiChecklistLinesFromShard(
      ruSettings as Record<string, string>
    )
    const en = formatOwnerManualSmokeHidpiChecklistLinesFromShard(
      enSettings as Record<string, string>
    )
    expect(ru[0]).toContain('HiDPI')
    expect(en[0]).toContain('HiDPI')
    expect(ru.filter((l) => l.startsWith('  - ')).length).toBe(
      en.filter((l) => l.startsWith('  - ')).length
    )
  })
})
