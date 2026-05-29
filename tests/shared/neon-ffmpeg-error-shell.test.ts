import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.22 ffmpeg error shell (ui.4)', () => {
  it('FfmpegErrorScreen module and ref22 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/FfmpegErrorScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref22-ffmpeg-error.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/ffmpeg-error-ref22-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/ffmpeg-error-ref22-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('FfmpegErrorScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('fe-modal__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('fe-modal__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('fe-modal__summary')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('fe-scene')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL')
    expect(readFileSync(css, 'utf8')).toContain('fe-modal')
    expect(readFileSync(parts, 'utf8')).toContain('ОШИБКА FFmpeg')
    expect(readFileSync(data, 'utf8')).toContain('FFMPEG_E_STARTUP')
    expect(readFileSync(data, 'utf8')).toContain('ERROR_FILE_NOT_FOUND')
    expect(readFileSync(parts, 'utf8')).toContain('Копировать логи')
    expect(readFileSync(tsx, 'utf8')).toContain('FE_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('FE_MODAL_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('FE_MODAL_CHIP')
    expect(readFileSync(data, 'utf8')).toContain('FE_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('fe-modal__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('fe-modal__foot-sticky')
    expect(readFileSync(css, 'utf8')).toContain('fe-details__row--selected')
    expect(readFileSync(css, 'utf8')).toContain('fe-action--selected')
  })

  it('bootstrap supports ref.22 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref22'")
    expect(bootstrap).toContain('FfmpegErrorScreen')
    expect(bootstrap).toContain('#ffmpeg-error')
  })
})
