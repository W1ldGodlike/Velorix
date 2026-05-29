import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.11 about modal shell (ui.4)', () => {
  it('AboutScreen module and ref11 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/AboutScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref11-about.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/about-ref11-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/about-ref11-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('AboutScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('about-scene')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_ABOUT_REL')
    expect(readFileSync(css, 'utf8')).toContain('about-modal')
    expect(readFileSync(css, 'utf8')).toContain('about-modal__features')
    expect(readFileSync(parts, 'utf8')).toContain('AboutModalPanel')
    expect(readFileSync(parts, 'utf8')).toContain('AboutToolsBackdrop')
    expect(readFileSync(parts, 'utf8')).toContain('about-modal__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('about-modal__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('about-modal__summary')
    expect(readFileSync(data, 'utf8')).toContain('ABOUT_MODAL_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('ABOUT_MODAL_CHIP')
    expect(readFileSync(parts, 'utf8')).toContain('about-modal__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('about-modal__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('.about-info-block:hover')
    expect(readFileSync(css, 'utf8')).toContain('.about-action-card:hover')
    expect(readFileSync(css, 'utf8')).toContain('about-modal__close:hover')
  })

  it('bootstrap supports ref.11 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref11'")
    expect(bootstrap).toContain('AboutScreen')
    expect(bootstrap).toContain('#about')
  })
})
