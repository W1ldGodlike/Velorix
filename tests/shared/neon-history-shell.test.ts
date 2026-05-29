import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.3 history shell (ui.3)', () => {
  it('HistoryScreen module and ref3 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/HistoryScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref3-history.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/history-ref3-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('HistoryScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('history-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('HISTORY_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('history-table')
    expect(readFileSync(css, 'utf8')).toContain('history-donut')
    expect(readFileSync(css, 'utf8')).toContain('ref3-history-icons.css')
    expect(readFileSync(parts, 'utf8')).toContain('HistoryTableRow')
    expect(readFileSync(parts, 'utf8')).toContain('history-action-glyph')
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
