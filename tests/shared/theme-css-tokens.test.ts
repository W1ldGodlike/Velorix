import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const REQUIRED_THEME_TOKENS = [
  '--fa-bg',
  '--fa-surface',
  '--fa-surface-elevated',
  '--fa-bg-elevated',
  '--fa-border',
  '--fa-border-subtle',
  '--fa-text-primary',
  '--fa-text-secondary',
  '--fa-text-muted',
  '--fa-accent',
  '--fa-danger',
  '--fa-success',
  '--fa-warning',
  '--fa-radius-hairline',
  '--fa-radius-2xs',
  '--fa-radius-xs',
  '--fa-radius-sm',
  '--fa-radius-md',
  '--fa-radius-control',
  '--fa-radius-panel',
  '--fa-radius-lg',
  '--fa-radius-preview',
  '--fa-radius-pill',
  '--fa-radius-circle',
  '--fa-font-mono',
  '--fa-hover',
  '--fa-focus',
  '--fa-focus-ring',
  '--fa-disabled',
  '--fa-scrim',
  '--fa-overlay-strong',
  '--fa-modal-backdrop',
  '--fa-elevation-lg',
  '--fa-preview-video-bg',
  '--fa-preview-card-bg',
  '--fa-neon-bg-atmosphere',
  '--fa-neon-accent-gradient',
  '--fa-neon-glow-accent'
] as const

function readBaseCssWithNeonImports(): string {
  const basePath = join(process.cwd(), 'src/renderer/src/assets/base.css')
  let css = readFileSync(basePath, 'utf8')
  const importRe = /@import\s+['"](\.\/[^'"]+)['"]\s*;/g
  for (const match of css.matchAll(importRe)) {
    const rel = match[1]!
    if (!rel.includes('velorix-neon')) {
      continue
    }
    const imported = readFileSync(join(process.cwd(), 'src/renderer/src/assets', rel), 'utf8')
    css = `${css}\n${imported}`
    const nestedRe = /@import\s+['"]\.\/([^'"]+)['"]\s*;/g
    const neonDir = join(process.cwd(), 'src/renderer/src/assets/themes/velorix-neon')
    for (const nested of imported.matchAll(nestedRe)) {
      css = `${css}\n${readFileSync(join(neonDir, nested[1]!), 'utf8')}`
    }
  }
  return css
}

describe('theme-css-tokens §5', () => {
  it('base.css defines the full semantic token set for dark and light', () => {
    const css = readBaseCssWithNeonImports()
    for (const token of REQUIRED_THEME_TOKENS) {
      expect(css, `missing ${token}`).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
    expect(css).toContain("html[data-theme='dark']")
    expect(css).toContain("html[data-theme='light']")
    expect(css).toContain('VELORIX NEON')
  })
})
