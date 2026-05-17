import type { StrokePrim } from './lucide-downloads-icons-types'

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

/** Вкладки «Редактор» / «Терминал» в шапке главного окна (lucide-подобные stroke). */
export const WORKSPACE_TAB_ICONS = {
  /** Кадр, play и ножницы — монтаж/обрезка (оригинальная композиция по мотивам «плёнка + ножницы»). */
  editor: [
    { tag: 'rect', attr: { x: '2', y: '6', width: '11.5', height: '12', rx: '1.5' } },
    { tag: 'line', attr: { x1: '2.6', y1: '8.5', x2: '2.6', y2: '10.5' } },
    { tag: 'line', attr: { x1: '2.6', y1: '14', x2: '2.6', y2: '16' } },
    { tag: 'polygon', attr: { points: '5.5 9.8 9.2 12 5.5 14.2' } },
    { tag: 'circle', attr: { cx: '16.5', cy: '15', r: '2' } },
    { tag: 'circle', attr: { cx: '16.5', cy: '19.5', r: '2' } },
    { tag: 'line', attr: { x1: '20.2', y1: '13.6', x2: '14.3', y2: '16.6' } },
    { tag: 'line', attr: { x1: '20.2', y1: '21', x2: '14.3', y2: '18' } },
    { tag: 'line', attr: { x1: '14.3', y1: '16.6', x2: '14.3', y2: '18' } }
  ] as const satisfies readonly StrokePrim[],
  /** lucide `terminal`. */
  terminal: [
    { tag: 'polyline', attr: { points: '4 17 10 11 4 5' } },
    { tag: 'line', attr: { x1: '12', y1: '19', x2: '20', y2: '19' } }
  ] as const satisfies readonly StrokePrim[]
} as const
