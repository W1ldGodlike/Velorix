import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.3 history shell (ui.3)', () => {
  it('HistoryScreen module and ref3 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/HistoryScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref3-history.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/history-ref3-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('HistoryScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('history-center__head--png')
    expect(readFileSync(tsx, 'utf8')).not.toContain('history-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('history-center__toolbar')
    expect(readFileSync(tsx, 'utf8')).toContain('history-sidebar__footer')
    expect(readFileSync(tsx, 'utf8')).toContain("tab.id === 'all'")
    expect(readFileSync(tsx, 'utf8')).toContain('history-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('history-statusbar__tc')
    expect(readFileSync(parts, 'utf8')).toContain('history-table__row--selected')
    expect(readFileSync(css, 'utf8')).toContain('.history-center__head--png')
    expect(readFileSync(css, 'utf8')).toContain('.history-statusbar__dot')
    expect(readFileSync(css, 'utf8')).toContain('.history-table__row--selected')
    expect(readFileSync(tsx, 'utf8')).toContain('history-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('HISTORY_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('history-table')
    expect(readFileSync(css, 'utf8')).toContain('history-donut')
    expect(readFileSync(css, 'utf8')).toContain('ref3-history-icons.css')
    expect(readFileSync(parts, 'utf8')).toContain('HistoryTableRow')
    expect(readFileSync(parts, 'utf8')).toContain('history-action-glyph')
    const data = readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/history-ref3-data.ts'),
      'utf8'
    )
    expect(data).toContain('HISTORY_PAGINATION_SUMMARY')
    expect(data).toContain('HISTORY_CENTER_SUMMARY')
    expect(data).toContain('HISTORY_STATUS_ROWS')
    expect(data).toContain('HISTORY_STATUS_READY')
    expect(data).toContain('selected: true')
    expect(data).toContain('count: 1248')
    expect(readFileSync(tsx, 'utf8')).toContain('history-rail__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('history-rail__quick-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('history-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('history-pagination-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('history-domain-tab__count')
    expect(readFileSync(css, 'utf8')).toContain('history-statusbar__item')
    expect(readFileSync(css, 'utf8')).toContain('history-table__row:hover')
  })

  it('bootstrap supports ref.3 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref3'")
    expect(bootstrap).toContain('HistoryScreen')
    expect(bootstrap).toContain('#history')
  })
})
