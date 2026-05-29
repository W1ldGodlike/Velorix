import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.5 knowledge shell (ui.3)', () => {
  it('KnowledgeEmbeddedWorkspace module and ref5 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/KnowledgeEmbeddedWorkspace.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref5-knowledge.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/knowledge-ref5-parts.tsx')
    expect(readFileSync(tsx, 'utf8')).toContain('KnowledgeEmbeddedWorkspace')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-center__head--png')
    expect(readFileSync(tsx, 'utf8')).not.toContain('knowledge-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-center__toolbar')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-sidebar__footer')
    expect(readFileSync(tsx, 'utf8')).toContain("'active' in pill && pill.active")
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.knowledge-center__head--png')
    expect(readFileSync(css, 'utf8')).toContain('.knowledge-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('KNOWLEDGE_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-preview')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-popular')
    expect(readFileSync(css, 'utf8')).toContain('ref5-knowledge-icons.css')
    expect(readFileSync(parts, 'utf8')).toContain('KnowledgePreviewRail')
    expect(readFileSync(parts, 'utf8')).toContain('KnowledgePopularCardView')
    const data = readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/knowledge-ref5-data.ts'),
      'utf8'
    )
    expect(data).toContain('KNOWLEDGE_PAGINATION_SUMMARY')
    expect(data).toContain('KNOWLEDGE_CENTER_SUMMARY')
    expect(data).toContain('KNOWLEDGE_STATUS_ROWS')
    expect(data).toContain("KNOWLEDGE_STATUS_READY = 'Готово'")
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-pill__count')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('knowledge-pagination-sticky')
    expect(readFileSync(parts, 'utf8')).toContain('knowledge-preview__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-preview__scroll')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-statusbar__item')
    expect(readFileSync(css, 'utf8')).toContain('knowledge-popular-card:hover')
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
