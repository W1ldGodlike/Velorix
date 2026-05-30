import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { KIT26_SECTIONS } from '../../src/renderer/src/pages/ref26-states-sections-data'

describe('ref.26 UI states showcase shell (ui.5)', () => {
  it('Ref26StatesPage module and showcase CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/Ref26StatesPage.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/ref26-states-sections-data.ts')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref-kit-showcase.css')
    expect(readFileSync(tsx, 'utf8')).toContain('Ref26StatesPage')
    expect(readFileSync(tsx, 'utf8')).toContain('ks-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonWindowChrome')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('ks-head__chip')
    expect(readFileSync(tsx, 'utf8')).toContain('ks-head__summary')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    const sidebar = join(process.cwd(), 'src/renderer/src/pages/kit-showcase-sidebar.tsx')
    expect(readFileSync(sidebar, 'utf8')).toContain('NeonSidebarBrand')
    const statusData = join(process.cwd(), 'src/renderer/src/pages/kit-showcase-status-data.ts')
    expect(readFileSync(statusData, 'utf8')).toContain('KIT_SUMMARY_REF26')
    expect(readFileSync(css, 'utf8')).toContain('.ks-section:hover')
    expect(readFileSync(css, 'utf8')).toContain('.ks-state-cell:hover')
    expect(readFileSync(css, 'utf8')).toContain('.ks-state-cell__label')
    expect(readFileSync(css, 'utf8')).toContain('.ks-empty-state')
    expect(readFileSync(css, 'utf8')).toContain('.ks-tabs__item--disabled')
    const parts = join(process.cwd(), 'src/renderer/src/pages/ref26-states-sections-parts.tsx')
    expect(readFileSync(parts, 'utf8')).toContain('ks-state-cell__label')
    expect(readFileSync(parts, 'utf8')).toContain('ks-toast__stripe')
    expect(readFileSync(parts, 'utf8')).toContain('ks-timeline-demo__playhead')
    expect(readFileSync(parts, 'utf8')).toContain('ks-modal-mock--danger')
    expect(readFileSync(parts, 'utf8')).toContain('ks-sidebar-demo-row')
    expect(readFileSync(parts, 'utf8')).toContain('ks-empty-state')
    expect(readFileSync(data, 'utf8')).toContain('КАРТОЧКИ — СОСТОЯНИЯ')
    expect(readFileSync(data, 'utf8')).toContain('РЕНДЕР / ЭКСПОРТ')
    expect(KIT26_SECTIONS.length).toBe(31)
  })

  it('bootstrap supports ref.26 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref26'")
    expect(bootstrap).toContain('Ref26StatesPage')
    expect(bootstrap).toContain('#states')
  })
})
