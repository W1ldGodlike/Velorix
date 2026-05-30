import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('reference-assets-protocol (velorixref)', () => {
  it('handler resolves PNG from pathname (velorixref:///file.png)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/main/core/reference-assets-protocol.ts'),
      'utf8'
    )
    expect(src).toContain('parsed.pathname')
    expect(src).toContain('parsed.hostname')
  })

  it('bootstrap registers reference dir with cwd fallback for out/ dev build', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/main/bootstrap/main-application-bootstrap-ipc.ts'),
      'utf8'
    )
    expect(src).toContain("join(process.cwd(), 'docs', 'reference')")
  })
})
