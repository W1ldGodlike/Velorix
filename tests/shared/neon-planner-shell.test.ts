import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.4 planner shell (ui.3)', () => {
  it('PlannerScreen module and ref4 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/PlannerScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref4-planner.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/planner-ref4-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('PlannerScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-center__head--png')
    expect(readFileSync(tsx, 'utf8')).not.toContain('planner-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-center__actions')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-sidebar__footer')
    expect(readFileSync(tsx, 'utf8')).toContain("tab.id === 'schedule'")
    expect(readFileSync(tsx, 'utf8')).toContain('planner-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.planner-center__head--png')
    expect(readFileSync(css, 'utf8')).toContain('.planner-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('PLANNER_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('planner-timeline__block')
    expect(readFileSync(css, 'utf8')).toContain('planner-detail')
    expect(readFileSync(css, 'utf8')).toContain('ref4-planner-icons.css')
    expect(readFileSync(parts, 'utf8')).toContain('PlannerWeekGrid')
    expect(readFileSync(parts, 'utf8')).toContain('PlannerQueueRow')
    const data = readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/planner-ref4-data.ts'),
      'utf8'
    )
    expect(data).toContain('count: 8')
    expect(data).toContain('PLANNER_CENTER_SUMMARY')
    expect(data).toContain('PLANNER_STATUS_ROWS')
    expect(data).toContain("PLANNER_STATUS_READY = 'Готово'")
    expect(readFileSync(tsx, 'utf8')).toContain('planner-rail__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-rail__quick-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('planner-detail-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('planner-tab__count')
    expect(readFileSync(css, 'utf8')).toContain('planner-statusbar__item')
    expect(readFileSync(css, 'utf8')).toContain('planner-task-card:hover')
  })

  it('bootstrap supports ref.4 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref4'")
    expect(bootstrap).toContain('PlannerScreen')
    expect(bootstrap).toContain('#planner')
  })
})
