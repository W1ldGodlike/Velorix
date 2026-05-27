import { SVG_NS, escapeXmlAttr, type StrokePrim } from './lucide-downloads-icons-types'

function emitPrimEl(p: StrokePrim): string {
  switch (p.tag) {
    case 'path':
      return `<path d="${escapeXmlAttr(p.attr.d)}"/>`
    case 'polyline':
      return `<polyline points="${escapeXmlAttr(p.attr.points)}"/>`
    case 'polygon':
      return `<polygon points="${escapeXmlAttr(p.attr.points)}"/>`
    case 'line':
      return `<line x1="${escapeXmlAttr(p.attr.x1)}" y1="${escapeXmlAttr(p.attr.y1)}" x2="${escapeXmlAttr(p.attr.x2)}" y2="${escapeXmlAttr(p.attr.y2)}"/>`
    case 'rect': {
      const { x, y, width, height, rx } = p.attr
      const rxPart = rx !== undefined ? ` rx="${escapeXmlAttr(rx)}"` : ''
      return `<rect x="${escapeXmlAttr(x)}" y="${escapeXmlAttr(y)}" width="${escapeXmlAttr(width)}" height="${escapeXmlAttr(height)}"${rxPart}/>`
    }
    case 'circle':
      return `<circle cx="${escapeXmlAttr(p.attr.cx)}" cy="${escapeXmlAttr(p.attr.cy)}" r="${escapeXmlAttr(p.attr.r)}"/>`
    default: {
      const _x: never = p
      return _x
    }
  }
}

/** Inline SVG (React renderer и тесты сериализации stroke-иконок). */
export function emitInlineStrokeSvg(parts: readonly StrokePrim[], px: number): string {
  const body = parts.map((prim) => emitPrimEl(prim)).join('')
  return `<svg xmlns="${escapeXmlAttr(SVG_NS)}" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
}
