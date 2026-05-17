export type StrokePrim =
  | { readonly tag: 'path'; readonly attr: { readonly d: string } }
  | { readonly tag: 'polyline'; readonly attr: { readonly points: string } }
  | { readonly tag: 'polygon'; readonly attr: { readonly points: string } }
  | {
      readonly tag: 'line'
      readonly attr: {
        readonly x1: string
        readonly y1: string
        readonly x2: string
        readonly y2: string
      }
    }
  | {
      readonly tag: 'rect'
      readonly attr: {
        readonly x: string
        readonly y: string
        readonly width: string
        readonly height: string
        readonly rx?: string
      }
    }
  | {
      readonly tag: 'circle'
      readonly attr: { readonly cx: string; readonly cy: string; readonly r: string }
    }

export const SVG_NS = 'http://www.w3.org/2000/svg'

export function escapeXmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
