import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { KIT27_SECTIONS } from '../../src/renderer/src/pages/ref27-kit-sections-data'

describe('ref.27 UI components kit shell (ui.5)', () => {
  it('Ref27KitPage module and showcase CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/Ref27KitPage.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref-kit-showcase.css')
    const data = join(process.cwd(), 'src/renderer/src/pages/ref27-kit-sections-data.ts')
    const parts = join(process.cwd(), 'src/renderer/src/pages/ref27-kit-sections-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('Ref27KitPage')
    expect(readFileSync(tsx, 'utf8')).toContain('ks-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonWindowChrome')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('ks-head__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('ks-head__summary')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    const sidebar = join(process.cwd(), 'src/renderer/src/pages/kit-showcase-sidebar.tsx')
    expect(readFileSync(sidebar, 'utf8')).toContain('NeonSidebarBrand')
    const statusData = join(process.cwd(), 'src/renderer/src/pages/kit-showcase-status-data.ts')
    expect(readFileSync(statusData, 'utf8')).toContain('KIT_STATUS_READY')
    expect(readFileSync(statusData, 'utf8')).toContain('KIT_SUMMARY_REF27')
    expect(readFileSync(css, 'utf8')).toContain('.ks-head__chip')
    expect(readFileSync(css, 'utf8')).toContain('.ks-grid::-webkit-scrollbar-thumb')
    expect(readFileSync(css, 'utf8')).toContain('ks-grid')
    expect(readFileSync(data, 'utf8')).toContain('КНОПКИ')
    expect(readFileSync(data, 'utf8')).toContain('КОМАНДНАЯ ПАЛИТРА')
    expect(readFileSync(data, 'utf8')).toContain('ДРОПДАУН МЕНЮ (ОТКРЫТО)')
    expect(KIT27_SECTIONS.length).toBe(31)
    expect(readFileSync(parts, 'utf8')).toContain('ks-icon-btn')
    expect(readFileSync(parts, 'utf8')).toContain('ks-slider__thumb')
    expect(readFileSync(css, 'utf8')).toContain('.ks-slider--62')
    expect(readFileSync(css, 'utf8')).toContain(".neon-kit-nav a[aria-current='page']")
    expect(readFileSync(parts, 'utf8')).toContain('ks-tabs__item--active')
    expect(readFileSync(parts, 'utf8')).toContain('ks-toast__stripe')
    expect(readFileSync(parts, 'utf8')).toContain('ks-tooltip--arrow')
    expect(readFileSync(css, 'utf8')).toContain('.ks-table tbody tr:hover')
    expect(readFileSync(css, 'utf8')).toContain('.ks-menu__sep')
    expect(readFileSync(parts, 'utf8')).toContain('ks-palette__item--active')
    expect(readFileSync(parts, 'utf8')).toContain('ks-timeline-demo__playhead')
    expect(readFileSync(parts, 'utf8')).toContain('ks-search-demo')
    expect(readFileSync(css, 'utf8')).toContain('.ks-ring-progress--spin')
    expect(readFileSync(css, 'utf8')).toContain('.ks-dropzone--active')
    expect(readFileSync(parts, 'utf8')).toContain('ks-modal-mock--danger')
    expect(readFileSync(parts, 'utf8')).toContain('ks-type__mono')
    expect(readFileSync(parts, 'utf8')).toContain('ks-spacing__chip--4')
    expect(readFileSync(parts, 'utf8')).toContain('ks-swatch-wrap')
    expect(readFileSync(parts, 'utf8')).toContain('ks-statusbar-demo__tc')
    expect(readFileSync(parts, 'utf8')).toContain('ks-brand__mark')
    expect(readFileSync(css, 'utf8')).toContain('.ks-modal-mock--loading p')
  })

  it('bootstrap supports ref.27 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref27'")
    expect(bootstrap).toContain('Ref27KitPage')
    expect(bootstrap).toContain('#components')
    expect(bootstrap).toContain('vn-route-surface')
  })
})
