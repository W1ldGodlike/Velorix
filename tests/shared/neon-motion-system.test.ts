import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('NEON motion system (X.4 partial)', () => {
  it('09-motion tokens, route enter, kit hovers, reduced-motion', () => {
    const motion = readFileSync(
      join(process.cwd(), 'src/renderer/src/assets/neon/09-motion.css'),
      'utf8'
    )
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )

    expect(motion).toContain('--vn-transition-route')
    expect(motion).toContain('@keyframes vn-route-enter')
    expect(motion).toContain('.vn-route-surface')
    expect(motion).toContain('.neon-kit-nav a:hover')
    expect(motion).toContain('.processing-nav__item:hover')
    expect(motion).toContain('prefers-reduced-motion: reduce')
    expect(motion).toContain('.vn-route-surface {\n    animation: none')
    expect(bootstrap).toContain('vn-route-surface')
    expect(bootstrap).toContain('key={route}')
    expect(bootstrap).toContain('neonScreenForRoute')
  })
})
