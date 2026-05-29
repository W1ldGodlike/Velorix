import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.13 image conversion shell (ui.4)', () => {
  it('ImageConversionScreen module and ref13 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ImageConversionScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref13-image-conversion.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/image-conversion-ref13-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/image-conversion-ref13-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('ImageConversionScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('ic-center__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('ic-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('ic-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_IMAGE_CONVERSION_REL')
    expect(readFileSync(css, 'utf8')).toContain('ic-drop')
    expect(readFileSync(css, 'utf8')).toContain('ic-file-row')
    expect(readFileSync(parts, 'utf8')).toContain('КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ')
    expect(readFileSync(data, 'utf8')).toContain('landscape_001.jpg')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('ic-center__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('ic-rail__tasks-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('IC_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('IC_STATUS_READY')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.ic-drop:hover')
    expect(readFileSync(css, 'utf8')).toContain('ic-file-row--selected')
  })

  it('bootstrap supports ref.13 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref13'")
    expect(bootstrap).toContain('ImageConversionScreen')
    expect(bootstrap).toContain('#image-conversion')
  })
})
