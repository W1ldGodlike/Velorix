/**
 * §5 — пары токенов с минимальным контрастом (проверяется по hex в base.css).
 */

export const THEME_WCAG_AA_TEXT = 4.5
export const THEME_WCAG_AA_UI = 3

export type ThemeContrastPair = {
  readonly id: string
  readonly foreground: `--fa-${string}`
  readonly background: `--fa-${string}`
  readonly minRatio: number
}

/** Только пары с прямыми hex в base.css (без color-mix / var). */
export const THEME_CONTRAST_PAIRS: ReadonlyArray<ThemeContrastPair> = [
  {
    id: 'text-primary-on-bg',
    foreground: '--fa-text-primary',
    background: '--fa-bg',
    minRatio: THEME_WCAG_AA_TEXT
  },
  {
    id: 'text-primary-on-surface',
    foreground: '--fa-text-primary',
    background: '--fa-surface',
    minRatio: THEME_WCAG_AA_TEXT
  },
  {
    id: 'text-primary-on-elevated',
    foreground: '--fa-text-primary',
    background: '--fa-surface-elevated',
    minRatio: THEME_WCAG_AA_TEXT
  },
  {
    id: 'text-secondary-on-surface',
    foreground: '--fa-text-secondary',
    background: '--fa-surface',
    minRatio: THEME_WCAG_AA_TEXT
  },
  {
    id: 'text-muted-on-surface',
    foreground: '--fa-text-muted',
    background: '--fa-surface',
    minRatio: THEME_WCAG_AA_UI
  },
  {
    id: 'accent-contrast-on-accent',
    foreground: '--fa-accent-contrast',
    background: '--fa-accent',
    minRatio: THEME_WCAG_AA_TEXT
  },
  {
    id: 'disabled-on-surface',
    foreground: '--fa-disabled',
    background: '--fa-surface',
    minRatio: THEME_WCAG_AA_UI
  }
]

export const THEME_BASE_CSS_DARK_BLOCK =
  /html\[data-theme='dark'\],\s*html:not\(\[data-theme\]\)\s*\{([\s\S]*?)\n\}/

export const THEME_BASE_CSS_LIGHT_BLOCK = /html\[data-theme='light'\]\s*\{([\s\S]*?)\n\}/

const HEX_TOKEN_LINE = /(--fa-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g

export function parseThemeHexTokens(block: string): Map<string, string> {
  const tokens = new Map<string, string>()
  for (const match of block.matchAll(HEX_TOKEN_LINE)) {
    tokens.set(match[1]!, match[2]!.toLowerCase())
  }
  return tokens
}

export function readThemeHexTokensFromBaseCss(
  css: string,
  theme: 'dark' | 'light'
): Map<string, string> {
  const re = theme === 'dark' ? THEME_BASE_CSS_DARK_BLOCK : THEME_BASE_CSS_LIGHT_BLOCK
  const block = css.match(re)?.[1]
  if (!block) {
    throw new Error(`missing ${theme} theme block in base.css`)
  }
  return parseThemeHexTokens(block)
}
