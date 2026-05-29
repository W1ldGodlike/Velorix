import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.10 tools shell (ui.4)', () => {
  it('ToolsScreen module and ref10 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ToolsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref10-tools.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/tools-ref10-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/tools-ref10-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('ToolsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.tools-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('TOOLS_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('tools-card')
    expect(readFileSync(css, 'utf8')).toContain('tools-statusbar')
    expect(readFileSync(parts, 'utf8')).toContain('ToolsUtilityRail')
    expect(readFileSync(parts, 'utf8')).toContain('ToolsQuickActionsPanel')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('tools-rail__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('tools-rail__links-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('TOOLS_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('TOOLS_STATUS_READY')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.tools-card:hover')
    expect(readFileSync(parts, 'utf8')).toContain('tools-card--selected')
  })

  it('bootstrap supports ref.10 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref10'")
    expect(bootstrap).toContain('ToolsScreen')
    expect(bootstrap).toContain('#tools')
  })
})
