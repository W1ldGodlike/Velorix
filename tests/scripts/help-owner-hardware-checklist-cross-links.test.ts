import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME } from '../../src/shared/knowledge-contract'

const HELP_ROOT = join(process.cwd(), 'Help')
const APPEARANCE_MD = `${KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME}.md`

describe('Help visual smoke cross-links §5', () => {
  it('getting-started links appearance (ru + en)', () => {
    for (const rel of ['ru/getting-started.md', 'en/getting-started.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain(APPEARANCE_MD)
      expect(md, rel).not.toContain('owner-hardware-checklist.md')
      expect(md, rel).not.toContain('owner-manual-smoke.md')
    }
  })

  it('workflow footer points to about-support and packaged (ru sample)', () => {
    const md = readFileSync(join(HELP_ROOT, 'ru/downloads-workflow.md'), 'utf8')
    expect(md).toContain('about-support-logs.md')
    expect(md).toContain('packaged-windows-smoke.md')
    expect(md).not.toContain('owner-hardware-checklist.md')
    expect(md).not.toContain('owner-manual-smoke.md')
  })
})
