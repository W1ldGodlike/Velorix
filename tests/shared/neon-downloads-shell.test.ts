import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.2 downloads shell (ui.3)', () => {
  it('DownloadsScreen module and ref2 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/DownloadsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref2-downloads.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/downloads-ref2-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('DownloadsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-center__head--png')
    expect(readFileSync(tsx, 'utf8')).not.toContain('downloads-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-center__toolbar')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-center__active-count')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-center__footer')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-sidebar__footer')
    expect(readFileSync(tsx, 'utf8')).toContain("tab.id === 'all'")
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-rail__period')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonSidebarBrand')
    expect(readFileSync(parts, 'utf8')).toContain('downloads-card__live-dot')
    expect(readFileSync(css, 'utf8')).toContain('.downloads-statusbar__dot')
    expect(readFileSync(css, 'utf8')).toContain('.downloads-center__footer')
    expect(readFileSync(css, 'utf8')).toContain('.downloads-center__head--png')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('DOWNLOADS_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('downloads-card__progress-fill')
    expect(readFileSync(css, 'utf8')).toContain('downloads-statusbar')
    expect(readFileSync(tsx, 'utf8')).toContain('DOWNLOADS_STATS')
    expect(readFileSync(parts, 'utf8')).toContain('downloads-glyph--pause')
    expect(readFileSync(parts, 'utf8')).toContain('DownloadCard')
    const data = readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/downloads-ref2-data.ts'),
      'utf8'
    )
    expect(data).toContain('DOWNLOADS_STATUS_ROWS')
    expect(data).toContain('DOWNLOADS_STATUS_READY')
    expect(data).toContain('aggregateSpeed')
    expect(data).toContain('DOWNLOADS_CENTER_SUMMARY')
    expect(data).toContain('thumbTone:')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-rail__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-rail__quick-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-queue-sticky')
    expect(readFileSync(css, 'utf8')).toContain('downloads-statusbar__item')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('downloads-card--selected')
    expect(readFileSync(css, 'utf8')).toContain('downloads-card:hover')
  })

  it('bootstrap supports ref.2 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref2'")
    expect(bootstrap).toContain('DownloadsScreen')
    expect(bootstrap).toContain('#downloads')
  })
})
