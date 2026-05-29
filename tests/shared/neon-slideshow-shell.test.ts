import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.15 slideshow shell (ui.4)', () => {
  it('SlideshowScreen module and ref15 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/SlideshowScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref15-slideshow.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/slideshow-ref15-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/slideshow-ref15-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('SlideshowScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('ss-workspace__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('ss-workspace__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('ss-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_SLIDESHOW_REL')
    expect(readFileSync(css, 'utf8')).toContain('ss-timeline')
    expect(readFileSync(css, 'utf8')).toContain('ss-preview')
    expect(readFileSync(parts, 'utf8')).toContain('СЛАЙДШОУ ИЗ ИЗОБРАЖЕНИЙ')
    expect(readFileSync(parts, 'utf8')).toContain('ЭКСПОРТ ВИДЕО')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('ss-workspace__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('ic-rail__tasks-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('SS_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('SS_STATUS_READY')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('ss-seq-row--selected')
    expect(readFileSync(css, 'utf8')).toContain('ss-export-sticky')
  })

  it('bootstrap supports ref.15 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref15'")
    expect(bootstrap).toContain('SlideshowScreen')
    expect(bootstrap).toContain('#slideshow')
  })
})
