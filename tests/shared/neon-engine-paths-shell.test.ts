import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.19 engine paths shell (ui.4)', () => {
  it('EnginePathsScreen module and ref19 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/EnginePathsScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref19-engine-paths.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/engine-paths-ref19-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/engine-paths-ref19-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('EnginePathsScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('eng-modal__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('eng-modal__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('eng-modal__summary')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('eng-scene')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL')
    expect(readFileSync(css, 'utf8')).toContain('eng-modal')
    expect(readFileSync(css, 'utf8')).toContain('eng-row__valid')
    expect(readFileSync(parts, 'utf8')).toContain('ПУТИ К ДВИЖКАМ')
    expect(readFileSync(data, 'utf8')).toContain('ffmpeg.exe')
    expect(readFileSync(tsx, 'utf8')).toContain('ENG_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('ENG_MODAL_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('ENG_MODAL_CHIP')
    expect(readFileSync(data, 'utf8')).toContain('ENG_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('eng-modal__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('eng-modal__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('eng-row--selected')
    expect(readFileSync(css, 'utf8')).toContain('eng-modal__close:hover')
  })

  it('bootstrap supports ref.19 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref19'")
    expect(bootstrap).toContain('EnginePathsScreen')
    expect(bootstrap).toContain('#engine-paths')
  })
})
