import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.2 downloads shell (ui.3)', () => {
  it('DownloadsScreen module and ref2 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/DownloadsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref2-downloads.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/downloads-ref2-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('DownloadsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('downloads-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('DOWNLOADS_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('downloads-card__progress-fill')
    expect(readFileSync(css, 'utf8')).toContain('downloads-statusbar')
    expect(readFileSync(tsx, 'utf8')).toContain('DOWNLOADS_STATS')
    expect(readFileSync(parts, 'utf8')).toContain('downloads-glyph--pause')
    expect(readFileSync(parts, 'utf8')).toContain('DownloadCard')
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
