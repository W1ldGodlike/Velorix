import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.20 first-run engines shell (ui.4)', () => {
  it('FirstRunEnginesScreen module and ref20 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/FirstRunEnginesScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref20-first-run-engines.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/first-run-ref20-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/first-run-ref20-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('FirstRunEnginesScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('fr-main__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('fr-main__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('fr-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL')
    expect(readFileSync(css, 'utf8')).toContain('fr-wizard')
    expect(readFileSync(css, 'utf8')).toContain('fr-steps')
    expect(readFileSync(parts, 'utf8')).toContain('ДОБРО ПОЖАЛОВАТЬ В VELORIX')
    expect(readFileSync(parts, 'utf8')).toContain('Установить все недостающие')
    expect(readFileSync(parts, 'utf8')).toContain('FR_MAIN_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('FR_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('fr-main__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('fr-foot-sticky')
    expect(readFileSync(css, 'utf8')).toContain('fr-engine--selected')
    expect(readFileSync(css, 'utf8')).toContain('fr-scan-list__row--selected')
    expect(readFileSync(css, 'utf8')).toContain('--fr-steps-w')
  })

  it('bootstrap supports ref.20 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref20'")
    expect(bootstrap).toContain('FirstRunEnginesScreen')
    expect(bootstrap).toContain('#first-run-engines')
  })
})
