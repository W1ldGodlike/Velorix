import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const HELP_ROOT = join(process.cwd(), 'Help')

describe('Help owner-smoke cross-links §5', () => {
  it('appearance-language-theme links owner-manual-smoke (ru + en)', () => {
    for (const rel of ['appearance-language-theme.md', 'en/appearance-language-theme.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain('owner-manual-smoke.md')
    }
  })

  it('owner-manual-smoke links appearance-language-theme (ru + en)', () => {
    for (const rel of ['owner-manual-smoke.md', 'en/owner-manual-smoke.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain('appearance-language-theme.md')
    }
  })
})
