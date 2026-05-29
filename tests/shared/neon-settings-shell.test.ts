import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.6 settings shell (ui.3)', () => {
  it('SettingsScreen module and ref6 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/SettingsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref6-settings.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/settings-ref6-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('SettingsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('SETTINGS_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('settings-toggle--on')
    expect(readFileSync(css, 'utf8')).toContain('settings-center__grid')
    expect(readFileSync(parts, 'utf8')).toContain('SettingsSystemRail')
    expect(readFileSync(parts, 'utf8')).toContain('SettingsCard')
  })

  it('bootstrap supports ref.6 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref6'")
    expect(bootstrap).toContain('SettingsScreen')
    expect(bootstrap).toContain('#settings')
  })
})
