import type { StrokePrim } from './lucide-downloads-icons-types'

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
  /** lucide `copy` — дублирование пути и др. */
  copy: [
    { tag: 'rect', attr: { x: '9', y: '9', width: '13', height: '13', rx: '2' } },
    {
      tag: 'path',
      attr: {
        d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'
      }
    }
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
  /** lucide `x` — отмена/закрыть (icon-only row actions). */
  x: [
    { tag: 'line', attr: { x1: '18', y1: '6', x2: '6', y2: '18' } },
    { tag: 'line', attr: { x1: '6', y1: '6', x2: '18', y2: '18' } }
  ] as const satisfies readonly StrokePrim[]
} as const

export type QueueRowActionIconKey = keyof typeof QUEUE_ROW_ACTION_ICONS

export const QUEUE_ROW_ICO_KEY_ORDER: QueueRowActionIconKey[] = [
  'play',
  'pause',
  'retry',
  'refreshCw',
  'plus',
  'outbound',
  'file',
  'copy',
  'folder',
  'chevUp',
  'chevDown',
  'trash',
  'stop',
  'x'
]
