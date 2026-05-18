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
  '--fa-hover',
  '--fa-focus',
  '--fa-focus-ring',
  '--fa-disabled',
  '--fa-scrim',
  '--fa-preview-video-bg',
  '--fa-preview-card-bg'
] as const

describe('theme-css-tokens §5', () => {
  it('base.css defines the full semantic token set for dark and light', () => {
    const css = readFileSync(
      join(process.cwd(), 'src/renderer/src/assets/base.css'),
      'utf8'
    )
    for (const token of REQUIRED_THEME_TOKENS) {
      expect(css, `missing ${token}`).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
    expect(css).toContain("html[data-theme='dark']")
    expect(css).toContain("html[data-theme='light']")
  })
})
