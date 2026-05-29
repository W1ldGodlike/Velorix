import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.25 plugins shell (ui.4)', () => {
  it('PluginsScreen module and ref25 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/PluginsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref25-plugins.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/plugins-ref25-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/plugins-ref25-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('PluginsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('pl-center__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('pl-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-sidebar__brand-edition')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('pl-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_PLUGINS_REL')
    expect(readFileSync(css, 'utf8')).toContain('pl-table')
    expect(readFileSync(parts, 'utf8')).toContain('ПЛАГИНЫ')
    expect(readFileSync(data, 'utf8')).toContain('ProRes Encoder')
    expect(readFileSync(data, 'utf8')).toContain('com.velorix.proresencoder')
    expect(readFileSync(parts, 'utf8')).toContain('Открыть песочницу')
    expect(readFileSync(tsx, 'utf8')).toContain('PL_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('PL_STATUS_READY')
    expect(readFileSync(data, 'utf8')).toContain('PL_HEAD_CHIP')
    expect(readFileSync(parts, 'utf8')).toContain('PL_CENTER_SUMMARY')
    expect(readFileSync(parts, 'utf8')).toContain('pl-center__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('pl-rail__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('pl-row--selected')
    expect(readFileSync(css, 'utf8')).toContain('pl-sandbox-sticky')
  })

  it('bootstrap supports ref.25 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref25'")
    expect(bootstrap).toContain('PluginsScreen')
    expect(bootstrap).toContain('#plugins')
  })
})
