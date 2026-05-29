import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.24 encoder benchmark shell (ui.4)', () => {
  it('EncoderBenchmarkScreen module and ref24 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/EncoderBenchmarkScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref24-encoder-benchmark.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/encoder-benchmark-ref24-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/encoder-benchmark-ref24-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('EncoderBenchmarkScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('eb-center__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('eb-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-sidebar__brand-edition')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('eb-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL')
    expect(readFileSync(css, 'utf8')).toContain('eb-table')
    expect(readFileSync(parts, 'utf8')).toContain('Бенчмарк кодеров')
    expect(readFileSync(parts, 'utf8')).toContain('Запустить тест')
    expect(readFileSync(data, 'utf8')).toContain('H.265 (NVENC)')
    expect(readFileSync(data, 'utf8')).toContain('Big Buck Bunny')
    expect(readFileSync(tsx, 'utf8')).toContain('EB_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('EB_STATUS_READY')
    expect(readFileSync(data, 'utf8')).toContain('EB_HEAD_CHIP')
    expect(readFileSync(parts, 'utf8')).toContain('EB_CENTER_SUMMARY')
    expect(readFileSync(parts, 'utf8')).toContain('eb-center__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('eb-rail__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('eb-row--selected')
  })

  it('bootstrap supports ref.24 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref24'")
    expect(bootstrap).toContain('EncoderBenchmarkScreen')
    expect(bootstrap).toContain('#encoder-benchmark')
  })
})
