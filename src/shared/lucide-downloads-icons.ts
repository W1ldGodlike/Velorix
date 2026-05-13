/**
 * Единые lucide-подобные SVG-примитивы для окна загрузок (data HTML) и топбара главного окна.
 * Пути взяты из lucide-icons (MIT); одна копия данных — меньше расхождений между React и inline SVG.
 */

import type { DownloadsTopbarClusterCopy } from './downloads-window-ui-locale'

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
  /** refresh-cw — повторное чтение (окно инспектора §9). */
  refreshCw: [
    { tag: 'path', attr: { d: 'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' } },
    { tag: 'path', attr: { d: 'M3 3v5h5' } },
    { tag: 'path', attr: { d: 'M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' } },
    { tag: 'path', attr: { d: 'M16 16h5v5' } }
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
  ] as const satisfies readonly StrokePrim[],
  /** lucide `x` — отмена/закрыть (v0 row actions). */
  x: [
    { tag: 'line', attr: { x1: '18', y1: '6', x2: '6', y2: '18' } },
    { tag: 'line', attr: { x1: '6', y1: '6', x2: '18', y2: '18' } }
  ] as const satisfies readonly StrokePrim[]
} as const

export type QueueRowActionIconKey = keyof typeof QUEUE_ROW_ACTION_ICONS

const QUEUE_ROW_ICO_KEY_ORDER: QueueRowActionIconKey[] = [
  'play',
  'pause',
  'retry',
  'refreshCw',
  'plus',
  'outbound',
  'file',
  'folder',
  'chevUp',
  'chevDown',
  'trash',
  'stop',
  'x'
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
  /** lucide `book` — база знаний (отличается от круглой «справки» у «О программе»). */
  book: [
    { tag: 'path', attr: { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' } },
    {
      tag: 'path',
      attr: {
        d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'
      }
    }
  ] as const satisfies readonly StrokePrim[],
  download: [
    { tag: 'path', attr: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
    { tag: 'polyline', attr: { points: '7 10 12 15 17 10' } },
    { tag: 'line', attr: { x1: '12', y1: '15', x2: '12', y2: '3' } }
  ] as const satisfies readonly StrokePrim[],
  /** lucide `clipboard` — вкладка «Загрузки» (из буфера), тот же набор stroke, что в React. */
  clipboard: [
    { tag: 'rect', attr: { x: '8', y: '2', width: '8', height: '4', rx: '1' } },
    {
      tag: 'path',
      attr: {
        d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'
      }
    }
  ] as const satisfies readonly StrokePrim[],
  /** Отдельное окно менеджера: те же штрихи, что `outbound` в очереди (external-link). */
  popOutWindow: [
    { tag: 'path', attr: { d: 'M15 3h6v6' } },
    { tag: 'path', attr: { d: 'M10 14 21 3' } },
    { tag: 'path', attr: { d: 'M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } }
  ] as const satisfies readonly StrokePrim[]
} as const

export type DownloadsTopbarClusterIconKey = keyof typeof DOWNLOADS_TOPBAR_CLUSTER_ICONS

/**
 * Полоска транспорта под превью редактора (§1.1 / `docs/UX_REFERENCE_V0.md`): lucide-глифы без React-зависимости.
 */
export const EDITOR_TRANSPORT_ICONS = {
  skipBack: [
    { tag: 'polygon', attr: { points: '19 20 9 12 19 4 19 20' } },
    { tag: 'line', attr: { x1: '5', y1: '19', x2: '5', y2: '5' } }
  ] as const satisfies readonly StrokePrim[],
  chevronLeft: [
    { tag: 'path', attr: { d: 'm15 18-6-6 6-6' } }
  ] as const satisfies readonly StrokePrim[],
  play: QUEUE_ROW_ACTION_ICONS.play,
  pause: QUEUE_ROW_ACTION_ICONS.pause,
  chevronRight: [
    { tag: 'path', attr: { d: 'm9 18 6-6-6-6' } }
  ] as const satisfies readonly StrokePrim[],
  skipForward: [
    { tag: 'polygon', attr: { points: '5 4 15 12 5 20 5 4' } },
    { tag: 'line', attr: { x1: '19', y1: '5', x2: '19', y2: '19' } }
  ] as const satisfies readonly StrokePrim[],
  volume2: [
    { tag: 'polygon', attr: { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' } },
    { tag: 'path', attr: { d: 'M15.54 8.46a5 5 0 0 1 0 7.07' } },
    { tag: 'path', attr: { d: 'M19.07 4.93a10 10 0 0 1 0 14.14' } }
  ] as const satisfies readonly StrokePrim[],
  volumeX: [
    { tag: 'polygon', attr: { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' } },
    { tag: 'line', attr: { x1: '22', y1: '9', x2: '16', y2: '15' } },
    { tag: 'line', attr: { x1: '16', y1: '9', x2: '22', y2: '15' } }
  ] as const satisfies readonly StrokePrim[],
  maximize2: [
    { tag: 'polyline', attr: { points: '15 3 21 3 21 9' } },
    { tag: 'polyline', attr: { points: '9 21 3 21 3 15' } },
    { tag: 'line', attr: { x1: '21', y1: '3', x2: '14', y2: '10' } },
    { tag: 'line', attr: { x1: '3', y1: '21', x2: '10', y2: '14' } }
  ] as const satisfies readonly StrokePrim[]
} as const

/** Полоска таймлайна: масштаб времени как в `docs/UX_REFERENCE_V0.md` (zoom-in / zoom-out). */
export const EDITOR_TIMELINE_ICONS = {
  zoomIn: [
    { tag: 'circle', attr: { cx: '11', cy: '11', r: '8' } },
    { tag: 'line', attr: { x1: '21', y1: '21', x2: '16.65', y2: '16.65' } },
    { tag: 'line', attr: { x1: '11', y1: '8', x2: '11', y2: '14' } },
    { tag: 'line', attr: { x1: '8', y1: '11', x2: '14', y2: '11' } }
  ] as const satisfies readonly StrokePrim[],
  zoomOut: [
    { tag: 'circle', attr: { cx: '11', cy: '11', r: '8' } },
    { tag: 'line', attr: { x1: '21', y1: '21', x2: '16.65', y2: '16.65' } },
    { tag: 'line', attr: { x1: '8', y1: '11', x2: '14', y2: '11' } }
  ] as const satisfies readonly StrokePrim[]
} as const

/** Быстрые действия v0-топбара: поворот / crop-блиц (см. FFmpeg-панель). */
export const EDITOR_TOPBAR_TOOLS_ICONS = {
  rotateCcw: [
    { tag: 'path', attr: { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' } },
    { tag: 'path', attr: { d: 'M3 3v5h5' } }
  ] as const satisfies readonly StrokePrim[],
  rotateCw: [
    { tag: 'path', attr: { d: 'M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' } },
    { tag: 'path', attr: { d: 'M21 3v5h-5' } }
  ] as const satisfies readonly StrokePrim[],
  scissors: [
    { tag: 'circle', attr: { cx: '6', cy: '6', r: '3' } },
    { tag: 'circle', attr: { cx: '6', cy: '18', r: '3' } },
    { tag: 'line', attr: { x1: '20', y1: '4', x2: '8.12', y2: '15.88' } },
    { tag: 'line', attr: { x1: '14.47', y1: '14.48', x2: '20', y2: '20' } },
    { tag: 'line', attr: { x1: '8.12', y1: '8.12', x2: '12', y2: '12' } }
  ] as const satisfies readonly StrokePrim[]
} as const

/** Экспорт/снимок/отмена/загрузка движков в правой части топбара редактора (общие данные с data HTML §6 при необходимости). */
export const EDITOR_TOPBAR_ACTION_ICONS = {
  image: [
    { tag: 'rect', attr: { x: '3', y: '3', width: '18', height: '18', rx: '2' } },
    { tag: 'circle', attr: { cx: '9', cy: '9', r: '2' } },
    { tag: 'path', attr: { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' } }
  ] as const satisfies readonly StrokePrim[],
  save: [
    {
      tag: 'path',
      attr: {
        d: 'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.2Z'
      }
    },
    { tag: 'path', attr: { d: 'M17 21v-8H7v8' } },
    { tag: 'path', attr: { d: 'M7 3v5h8' } }
  ] as const satisfies readonly StrokePrim[],
  ban: [
    { tag: 'circle', attr: { cx: '12', cy: '12', r: '10' } },
    { tag: 'path', attr: { d: 'm4.9 4.9 14.2 14.2' } }
  ] as const satisfies readonly StrokePrim[],
  cloudDownload: [
    { tag: 'path', attr: { d: 'M12 13v8l-4-4' } },
    { tag: 'path', attr: { d: 'm12 21 4-4' } },
    { tag: 'path', attr: { d: 'M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284' } }
  ] as const satisfies readonly StrokePrim[]
} as const

/** Переключатель темы в топбаре редактора/инспектора (общий источник путей). */
export const EDITOR_THEME_ICONS = {
  sun: [
    { tag: 'circle', attr: { cx: '12', cy: '12', r: '4' } },
    { tag: 'path', attr: { d: 'M12 2v2' } },
    { tag: 'path', attr: { d: 'M12 20v2' } },
    { tag: 'path', attr: { d: 'm4.93 4.93 1.41 1.41' } },
    { tag: 'path', attr: { d: 'm17.66 17.66 1.41 1.41' } },
    { tag: 'path', attr: { d: 'M2 12h2' } },
    { tag: 'path', attr: { d: 'M20 12h2' } },
    { tag: 'path', attr: { d: 'm6.34 17.66-1.41 1.41' } },
    { tag: 'path', attr: { d: 'm19.07 4.93-1.41 1.41' } }
  ] as const satisfies readonly StrokePrim[],
  moon: [
    { tag: 'path', attr: { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' } }
  ] as const satisfies readonly StrokePrim[]
} as const

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
