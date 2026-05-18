/** §5 — расчёт контраста WCAG 2.x для hex-значений токенов. */

export type RgbTriplet = { readonly r: number; readonly g: number; readonly b: number }

export function parseHexColor(raw: string): RgbTriplet | null {
  const hex = raw.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex)) {
    return null
  }
  const expanded =
    hex.length === 3
      ? [...hex].map((ch) => ch + ch).join('')
      : hex
  const value = Number.parseInt(expanded, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  }
}

function channelLinear(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(rgb: RgbTriplet): number {
  const r = channelLinear(rgb.r)
  const g = channelLinear(rgb.g)
  const b = channelLinear(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(foreground: RgbTriplet, background: RgbTriplet): number {
  const l1 = relativeLuminance(foreground)
  const l2 = relativeLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
