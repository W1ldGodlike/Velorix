import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME,
  KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE
} from '../../src/shared/knowledge-contract'

const HELP_ROOT = join(process.cwd(), 'Help')
const APPEARANCE_MD = `${KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME}.md`
const OWNER_SMOKE_MD = `${KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE}.md`

describe('Help owner-smoke cross-links §5', () => {
  it('appearance-language-theme links owner-manual-smoke (ru + en)', () => {
    for (const rel of ['ru/appearance-language-theme.md', 'en/appearance-language-theme.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain(OWNER_SMOKE_MD)
    }
  })

  it('owner-manual-smoke links appearance-language-theme (ru + en)', () => {
    for (const rel of ['ru/owner-manual-smoke.md', 'en/owner-manual-smoke.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain(APPEARANCE_MD)
    }
  })

  it('owner-manual-smoke documents video sprite §7.5 (ru + en)', () => {
    for (const rel of ['ru/owner-manual-smoke.md', 'en/owner-manual-smoke.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toMatch(/Video sprite|Спрайт/)
      expect(md, rel).toContain('§7.5')
    }
  })

  it('getting-started links appearance and owner-manual-smoke (ru + en)', () => {
    for (const rel of ['ru/getting-started.md', 'en/getting-started.md']) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain(APPEARANCE_MD)
      expect(md, rel).toContain(OWNER_SMOKE_MD)
    }
  })

  it('knowledge-base-howto and faq link visual smoke articles (ru + en)', () => {
    for (const rel of [
      'ru/knowledge-base-howto.md',
      'en/knowledge-base-howto.md',
      'ru/faq-troubleshooting.md',
      'en/faq-troubleshooting.md'
    ]) {
      const md = readFileSync(join(HELP_ROOT, rel), 'utf8')
      expect(md, rel).toContain(APPEARANCE_MD)
      expect(md, rel).toContain(OWNER_SMOKE_MD)
    }
  })
})
