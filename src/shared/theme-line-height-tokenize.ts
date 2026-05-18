/**
 * §5 — замена unitless line-height на --fa-line-height-*.
 */

const LINE_HEIGHT_TO_TOKEN: Readonly<Record<string, string>> = {
  '0': 'var(--fa-line-height-none)',
  '1': 'var(--fa-line-height-tight)',
  '1.2': 'var(--fa-line-height-compact)',
  '1.25': 'var(--fa-line-height-snug)',
  '1.3': 'var(--fa-line-height-normal)',
  '1.35': 'var(--fa-line-height-body)',
  '1.38': 'var(--fa-line-height-relaxed)',
  '1.4': 'var(--fa-line-height-room)',
  '1.42': 'var(--fa-line-height-loose)',
  '1.45': 'var(--fa-line-height-ui)',
  '1.55': 'var(--fa-line-height-display)'
}

export function tokenizeLineHeightLiterals(value: string): string {
  if (value.includes('var(--fa-line-height')) {
    return value
  }
  return value.replace(/\d+(?:\.\d+)?/g, (n) => LINE_HEIGHT_TO_TOKEN[n] ?? n)
}

export function tokenizeMainCssLineHeightDeclarations(css: string): string {
  return css.replace(/line-height:\s*([^;]+);/g, (full, value) => {
    const trimmed = value.trim()
    const next = tokenizeLineHeightLiterals(trimmed)
    return next === trimmed ? full : `line-height: ${next};`
  })
}
