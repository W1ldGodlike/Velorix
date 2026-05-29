import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.16 scenario builder shell (ui.4)', () => {
  it('ScenarioBuilderScreen module and ref16 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ScenarioBuilderScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref16-scenario-builder.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/scenario-builder-ref16-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/scenario-builder-ref16-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('ScenarioBuilderScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('sb-workspace__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('sb-workspace__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('sb-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_SCENARIO_BUILDER_REL')
    expect(readFileSync(css, 'utf8')).toContain('sb-canvas')
    expect(readFileSync(css, 'utf8')).toContain('sb-props')
    expect(readFileSync(parts, 'utf8')).toContain('КОНСТРУКТОР СЦЕНАРИЕВ')
    expect(readFileSync(parts, 'utf8')).toContain('ScenarioBuilderPropertiesRail')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(tsx, 'utf8')).toContain('SB_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('SB_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('sb-workspace__summary')
    expect(readFileSync(parts, 'utf8')).toContain('sb-nodes__import-sticky')
    expect(readFileSync(parts, 'utf8')).toContain('sb-props__foot-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-sidebar-w')
    expect(readFileSync(css, 'utf8')).toContain('sb-log__row--selected')
  })

  it('bootstrap supports ref.16 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref16'")
    expect(bootstrap).toContain('ScenarioBuilderScreen')
    expect(bootstrap).toContain('#scenario-builder')
  })
})
