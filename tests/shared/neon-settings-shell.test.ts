import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.6 settings shell (ui.3)', () => {
  it('SettingsScreen module and ref6 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/SettingsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref6-settings.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/settings-ref6-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/settings-ref6-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('SettingsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-center__head--png')
    expect(readFileSync(tsx, 'utf8')).not.toContain('settings-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-center__actions')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-sidebar__footer')
    expect(readFileSync(tsx, 'utf8')).toContain("'active' in tab && tab.active")
    expect(readFileSync(tsx, 'utf8')).toContain('settings-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.settings-center__head--png')
    expect(readFileSync(css, 'utf8')).toContain('.settings-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('SETTINGS_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('settings-toggle--on')
    expect(readFileSync(css, 'utf8')).toContain('settings-center__grid')
    expect(readFileSync(parts, 'utf8')).toContain('SettingsSystemRail')
    expect(readFileSync(parts, 'utf8')).toContain('SettingsCard')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--tools')
    expect(readFileSync(parts, 'utf8')).toContain('settings-rail__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('settings-rail__quick-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.settings-card:hover')
    expect(readFileSync(data, 'utf8')).toContain('SETTINGS_CENTER_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('SETTINGS_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('SETTINGS_STATUS_READY')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('settings-footer-sticky')
    expect(readFileSync(css, 'utf8')).toContain('settings-statusbar__item')
    expect(readFileSync(css, 'utf8')).toContain('settings-tab:hover')
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
