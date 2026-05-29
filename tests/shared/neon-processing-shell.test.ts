import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.1 processing shell (ui.2)', () => {
  it('ProcessingScreen module and ref1 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ProcessingScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref1-processing.css')
    const chrome = join(process.cwd(), 'src/renderer/src/components/NeonWindowChrome.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('ProcessingScreen')
    expect(readFileSync(css, 'utf8')).toContain('processing-shell')
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
