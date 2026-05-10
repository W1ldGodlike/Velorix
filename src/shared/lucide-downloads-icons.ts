/**
 * Единые lucide-подобные SVG-примитивы для окна загрузок (data HTML) и топбара главного окна.
 * Пути взяты из lucide-icons (MIT); одна копия данных — меньше расхождений между React и inline SVG.
 */

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

/** Колонка «Действия» таблицы очереди §6 (совпадает с прежними ключами `RowIco`). */
export const QUEUE_ROW_ACTION_ICONS = {
  play: [
    { tag: 'polygon', attr: { points: '6 3 20 12 6 21 6 3' } }
  ] as const satisfies readonly StrokePrim[],
  pause: [
    { tag: 'rect', attr: { x: '6', y: '4', width: '4', height: '16', rx: '1' } },
    { tag: 'rect', attr: { x: '14', y: '4', width: '4', height: '16', rx: '1' } }
  ] as const satisfies readonly StrokePrim[],
  retry: [
    { tag: 'path', attr: { d: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' } },
    { tag: 'path', attr: { d: 'M21 3v5h-5' } },
    { tag: 'path', attr: { d: 'M3 12a9 9 0 0 1 9-9c2.52 0 4.93 1 6.74 2.74L3 16' } },
    { tag: 'path', attr: { d: 'M8 16H3v5' } }
  ] as const satisfies readonly StrokePrim[],
  plus: [
    { tag: 'path', attr: { d: 'M5 12h14' } },
    { tag: 'path', attr: { d: 'M12 5v14' } }
  ] as const satisfies readonly StrokePrim[],
  outbound: [
    { tag: 'path', attr: { d: 'M15 3h6v6' } },
    { tag: 'path', attr: { d: 'M10 14 21 3' } },
    { tag: 'path', attr: { d: 'M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } }
  ] as const satisfies readonly StrokePrim[],
  file: [
    { tag: 'path', attr: { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' } },
    { tag: 'path', attr: { d: 'M14 2v4a2 2 0 0 0 2 2h4' } }
  ] as const satisfies readonly StrokePrim[],
  /** folder-open */
  folder: [
    {
      tag: 'path',
      attr: {
        d: 'm6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.89l.82 1.24a2 2 0 0 0 1.66.89H18a2 2 0 0 1 2 2v2'
      }
    }
  ] as const satisfies readonly StrokePrim[],
  chevUp: [{ tag: 'path', attr: { d: 'm18 15-6-6-6 6' } }] as const satisfies readonly StrokePrim[],
  chevDown: [{ tag: 'path', attr: { d: 'm6 9 6 6 6-6' } }] as const satisfies readonly StrokePrim[],
  /** trash-2 */
  trash: [
    { tag: 'path', attr: { d: 'M3 6h18' } },
    { tag: 'path', attr: { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' } },
    { tag: 'path', attr: { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' } },
    { tag: 'path', attr: { d: 'M10 11v6' } },
    { tag: 'path', attr: { d: 'M14 11v6' } }
  ] as const satisfies readonly StrokePrim[],
  stop: [
    { tag: 'rect', attr: { x: '6', y: '6', width: '12', height: '12', rx: '2' } }
  ] as const satisfies readonly StrokePrim[]
} as const

export type QueueRowActionIconKey = keyof typeof QUEUE_ROW_ACTION_ICONS

const QUEUE_ROW_ICO_KEY_ORDER: QueueRowActionIconKey[] = [
  'play',
  'pause',
  'retry',
  'plus',
  'outbound',
  'file',
  'folder',
  'chevUp',
  'chevDown',
  'trash',
  'stop'
]

/** Топбар окна загрузок + те же глифы доступны главному renderer через `LucideMiniIcons`. */
export const DOWNLOADS_TOPBAR_CLUSTER_ICONS = {
  film: [
    { tag: 'rect', attr: { x: '3', y: '3', width: '18', height: '18', rx: '2' } },
    { tag: 'path', attr: { d: 'M7 3v18' } },
    { tag: 'path', attr: { d: 'M3 7.5h4' } },
    { tag: 'path', attr: { d: 'M3 12h18' } },
    { tag: 'path', attr: { d: 'M3 16.5h4' } },
    { tag: 'path', attr: { d: 'M17 3v18' } },
    { tag: 'path', attr: { d: 'M17 7.5h4' } },
    { tag: 'path', attr: { d: 'M17 16.5h4' } }
  ] as const satisfies readonly StrokePrim[],
  home: [
    { tag: 'path', attr: { d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' } },
    { tag: 'polyline', attr: { points: '9 22 9 12 15 12 15 22' } }
  ] as const satisfies readonly StrokePrim[],
  settings: [
    {
      tag: 'path',
      attr: {
        d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'
      }
    },
    { tag: 'circle', attr: { cx: '12', cy: '12', r: '3' } }
  ] as const satisfies readonly StrokePrim[],
  circleHelp: [
    { tag: 'circle', attr: { cx: '12', cy: '12', r: '10' } },
    { tag: 'path', attr: { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' } },
    { tag: 'path', attr: { d: 'M12 17h.01' } }
  ] as const satisfies readonly StrokePrim[],
  download: [
    { tag: 'path', attr: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
    { tag: 'polyline', attr: { points: '7 10 12 15 17 10' } },
    { tag: 'line', attr: { x1: '12', y1: '15', x2: '12', y2: '3' } }
  ] as const satisfies readonly StrokePrim[]
} as const

export type DownloadsTopbarClusterIconKey = keyof typeof DOWNLOADS_TOPBAR_CLUSTER_ICONS

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

export function emitDownloadsTopbarClusterHtml(iconPx: number): string {
  const btn = (id: string, label: string, key: DownloadsTopbarClusterIconKey): string =>
    `<button type="button" class="icon-btn dl-topbar-ico" id="${id}" title="${escapeXmlAttr(label)}" aria-label="${escapeXmlAttr(label)}">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS[key], iconPx)}</button>`
  return `      <div class="topbar-cluster" role="toolbar" aria-label="Действия">
        ${btn('dlTopFilm', 'Инспектор ffprobe §9', 'film')}
        ${btn('dlTopHome', 'Главное окно (редактор)', 'home')}
        ${btn('dlTopEngines', 'Пути к движкам ffmpeg / yt-dlp / ffprobe', 'settings')}
        ${btn('dlTopHelp', 'О программе', 'circleHelp')}
      </div>`
}
