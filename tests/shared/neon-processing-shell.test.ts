import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.1 processing shell (ui.2)', () => {
  it('ProcessingScreen module and ref1 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ProcessingScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref1-processing.css')
    const chrome = join(process.cwd(), 'src/renderer/src/components/NeonWindowChrome.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('ProcessingScreen')
    expect(
      readFileSync(join(process.cwd(), 'src/renderer/src/pages/processing-ref1-parts.tsx'), 'utf8')
    ).toContain('TrackRow')
    expect(readFileSync(css, 'utf8')).toContain('processing-shell')
    expect(readFileSync(css, 'utf8')).toContain('processing-timeline__playhead--38')
    expect(readFileSync(css, 'utf8')).toContain('processing-clip__wave-bars')
    expect(readFileSync(css, 'utf8')).toContain('ref1-processing-icons.css')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-nav__icon--${item.slug}')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-preview__scene')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-timeline__body')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-media-glyph--pause')
    expect(readFileSync(css, 'utf8')).toContain('processing-timeline__ruler-ticks')
    expect(readFileSync(css, 'utf8')).toContain('processing-statusbar__center')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-rail__subtitle')
    expect(readFileSync(tsx, 'utf8')).toContain('trackHint="Высокая громк."')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-rail__preset-card')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-tool-glyph--group')
    expect(readFileSync(css, 'utf8')).toContain('processing-timeline__keyframe')
    expect(
      readFileSync(join(process.cwd(), 'src/renderer/src/pages/processing-ref1-parts.tsx'), 'utf8')
    ).toContain('CLIP_WAVEFORM_BAR_COUNT')
    expect(readFileSync(chrome, 'utf8')).toContain('requestMinimize')
    expect(readFileSync(chrome, 'utf8')).toContain('requestClose')
  })

  it('bootstrap defaults to ref.1 route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref1'")
    expect(bootstrap).toContain('ProcessingScreen')
  })
})
