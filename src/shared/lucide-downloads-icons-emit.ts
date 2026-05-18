import type { DownloadsTopbarClusterCopy } from './lucide-downloads-topbar-cluster-copy'
import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  type DownloadsTopbarClusterIconKey
} from './lucide-downloads-icons-clusters'
import { QUEUE_ROW_ACTION_ICONS, QUEUE_ROW_ICO_KEY_ORDER } from './lucide-downloads-icons-queue'
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

/** Inline SVG для data HTML (xmlns — стабильный рендер во встроенном документе Electron). */
export function emitInlineStrokeSvg(parts: readonly StrokePrim[], px: number): string {
  const body = parts.map((prim) => emitPrimEl(prim)).join('')
  return `<svg xmlns="${escapeXmlAttr(SVG_NS)}" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
}

/** Фрагмент скрипта окна загрузок: объект `RowIco` с вызовами `svgIcon([...])`. */
export function emitDownloadsQueueRowIcoBootstrapJs(): string {
  const lines = QUEUE_ROW_ICO_KEY_ORDER.map((key) => {
    const serialized = JSON.stringify(QUEUE_ROW_ACTION_ICONS[key])
    return `        ${key}: function () { return svgIcon(${serialized}); }`
  })
  return `      var RowIco = {\n${lines.join(',\n')}\n      };`
}

export function emitDownloadsTopbarClusterHtml(
  iconPx: number,
  labels: DownloadsTopbarClusterCopy
): string {
  const btn = (id: string, label: string, key: DownloadsTopbarClusterIconKey): string =>
    `<button type="button" class="icon-btn dl-topbar-ico" id="${id}" title="${escapeXmlAttr(label)}" aria-label="${escapeXmlAttr(label)}">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS[key], iconPx)}</button>`
  return `      <div class="topbar-cluster" role="toolbar" aria-label="${escapeXmlAttr(labels.toolbarAria)}">
        ${btn('dlTopFilm', labels.inspector, 'film')}
        ${btn('dlTopUrl', labels.focusUrl, 'download')}
        ${btn('dlTopHome', labels.mainEditor, 'home')}
        ${btn('dlTopEngines', labels.enginePaths, 'settings')}
        ${btn('dlTopHelp', labels.about, 'circleHelp')}
      </div>`
}
