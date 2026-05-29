import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.7 scenarios shell (ui.3)', () => {
  it('ScenariosScreen module and ref7 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ScenariosScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref7-scenarios.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/scenarios-ref7-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/scenarios-ref7-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('ScenariosScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.scenarios-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('SCENARIOS_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('scenario-card')
    expect(readFileSync(css, 'utf8')).toContain('scenario-rail')
    expect(readFileSync(parts, 'utf8')).toContain('ScenarioDetailRail')
    expect(readFileSync(parts, 'utf8')).toContain('ScenarioRunRow')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('scenario-rail__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('scenario-rail__actions-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-statusbar')
    expect(readFileSync(tsx, 'utf8')).toContain('SCENARIO_RUNS_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('SCENARIOS_CENTER_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('SCENARIOS_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('SCENARIOS_STATUS_READY')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('scenarios-pagination-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.scenario-card:hover')
    expect(readFileSync(css, 'utf8')).toContain('.scenarios-pill:hover')
    expect(readFileSync(css, 'utf8')).toContain('.scenario-rail__section:hover')
    expect(readFileSync(css, 'utf8')).toContain('scenario-runs__row--selected')
    expect(readFileSync(css, 'utf8')).toContain('scenarios-statusbar__item')
  })

  it('bootstrap supports ref.7 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref7'")
    expect(bootstrap).toContain('ScenariosScreen')
    expect(bootstrap).toContain('#scenarios')
  })
})
