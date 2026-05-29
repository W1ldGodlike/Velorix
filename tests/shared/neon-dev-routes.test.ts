import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { NEON_DEV_ROUTES } from '../../src/renderer/src/pages/neon-dev-routes'

describe('neon dev routes registry', () => {
  it('lists refs 1–27 for kit nav', () => {
    expect(NEON_DEV_ROUTES).toHaveLength(27)
    expect(NEON_DEV_ROUTES[0]?.hash).toBe('#ref1')
    expect(NEON_DEV_ROUTES[26]?.hash).toBe('#ref27')
  })

  it('neon-kit-nav exposes all refs panel', () => {
    const nav = readFileSync(join(process.cwd(), 'src/renderer/src/pages/neon-kit-nav.tsx'), 'utf8')
    expect(nav).toContain('NEON_DEV_ROUTES')
    expect(nav).toContain('Все refs 1–27')
  })
})
