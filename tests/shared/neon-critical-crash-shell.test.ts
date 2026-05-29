import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.23 critical crash shell (ui.4)', () => {
  it('CriticalCrashScreen module and ref23 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/CriticalCrashScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref23-critical-crash.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/critical-crash-ref23-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/critical-crash-ref23-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('CriticalCrashScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('cc-hero__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('cc-hero__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('processing-sidebar__brand-edition')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('cc-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL')
    expect(readFileSync(css, 'utf8')).toContain('cc-hero')
    expect(readFileSync(parts, 'utf8')).toContain('КРИТИЧЕСКИЙ СБОЙ ПРИЛОЖЕНИЯ')
    expect(readFileSync(data, 'utf8')).toContain('VRX_CRASH_0x000041A7')
    expect(readFileSync(data, 'utf8')).toContain('velorix-media-core.dll')
    expect(readFileSync(parts, 'utf8')).toContain('Копировать стек')
    expect(readFileSync(tsx, 'utf8')).toContain('CC_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('CC_MAIN_CHIP')
    expect(readFileSync(data, 'utf8')).toContain('CC_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('CC_MAIN_SUMMARY')
    expect(readFileSync(parts, 'utf8')).toContain('cc-main__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('cc-recovery-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-sidebar-w')
    expect(readFileSync(css, 'utf8')).toContain('cc-status--selected')
  })

  it('bootstrap supports ref.23 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref23'")
    expect(bootstrap).toContain('CriticalCrashScreen')
    expect(bootstrap).toContain('#critical-crash')
  })
})
