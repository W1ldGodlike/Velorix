import type { StrokePrim } from './lucide-downloads-icons-types'
import { QUEUE_ROW_ACTION_ICONS } from './lucide-downloads-icons-queue'

/**
 * Полоска транспорта под превью редактора (§1.1): lucide-глифы без React-зависимости.
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

/** Полоска таймлайна: zoom-in / zoom-out (§1.1). */
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

/** Быстрые действия топбара: поворот / crop-блиц (см. FFmpeg-панель). */
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
  /** lucide `folder` (closed) — выбор папки с видео §4.B */
  folder: [
    {
      tag: 'path',
      attr: {
        d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9l-.9-1.2A2 2 0 0 0 9.07 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'
      }
    }
  ] as const satisfies readonly StrokePrim[],
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
