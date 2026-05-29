import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.5 knowledge shell (ui.3)', () => {
  it('KnowledgeEmbeddedWorkspace module and ref5 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/KnowledgeEmbeddedWorkspace.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref5-knowledge.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/knowledge-ref5-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('KnowledgeEmbeddedWorkspace')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('KNOWLEDGE_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-preview')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-popular')
    expect(readFileSync(css, 'utf8')).toContain('ref5-knowledge-icons.css')
    expect(readFileSync(parts, 'utf8')).toContain('KnowledgePreviewRail')
    expect(readFileSync(parts, 'utf8')).toContain('KnowledgePopularCardView')
  })

  it('bootstrap supports ref.5 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref5'")
    expect(bootstrap).toContain('KnowledgeEmbeddedWorkspace')
    expect(bootstrap).toContain('#knowledge')
  })
})
