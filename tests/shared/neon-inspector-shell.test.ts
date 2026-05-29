import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.8 inspector shell (ui.3)', () => {
  it('InspectorScreen module and ref8 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/InspectorScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref8-inspector.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/inspector-ref8-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/inspector-ref8-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('InspectorScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.inspector-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('INSPECTOR_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('inspector-scope')
    expect(readFileSync(css, 'utf8')).toContain('inspector-statusbar')
    expect(readFileSync(parts, 'utf8')).toContain('InspectorTechRail')
    expect(readFileSync(parts, 'utf8')).toContain('InspectorPreviewPlayer')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('inspector-rail__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('inspector-rail__tools-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('INSPECTOR_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('INSPECTOR_CENTER_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('INSPECTOR_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('INSPECTOR_STATUS_READY')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('inspector-transport-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.inspector-panel:hover')
    expect(readFileSync(css, 'utf8')).toContain('.inspector-tab:hover')
    expect(readFileSync(css, 'utf8')).toContain('.inspector-rail__section:hover')
    expect(readFileSync(css, 'utf8')).toContain('inspector-stream--active')
    expect(readFileSync(css, 'utf8')).toContain('grid-template-rows')
  })

  it('bootstrap supports ref.8 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref8'")
    expect(bootstrap).toContain('InspectorScreen')
    expect(bootstrap).toContain('#inspector')
  })
})
