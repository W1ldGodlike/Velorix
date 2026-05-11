import type { JSX, ReactNode } from 'react'

import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TIMELINE_ICONS,
  EDITOR_THEME_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  EDITOR_TRANSPORT_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  type StrokePrim
} from '../../../shared/lucide-downloads-icons'

/** Единые 24×24 lucide-подобные stroke-иконки для topbar (MIT paths lucide-icons). */

function renderStrokeParts(parts: readonly StrokePrim[]): JSX.Element[] {
  return parts.map((p, i): JSX.Element => {
    switch (p.tag) {
      case 'path':
        return <path key={i} d={p.attr.d} />
      case 'polyline':
        return <polyline key={i} points={p.attr.points} />
      case 'polygon':
        return <polygon key={i} points={p.attr.points} />
      case 'line':
        return <line key={i} x1={p.attr.x1} y1={p.attr.y1} x2={p.attr.x2} y2={p.attr.y2} />
      case 'rect':
        return (
          <rect
            key={i}
            x={p.attr.x}
            y={p.attr.y}
            width={p.attr.width}
            height={p.attr.height}
            rx={p.attr.rx}
          />
        )
      case 'circle':
        return <circle key={i} cx={p.attr.cx} cy={p.attr.cy} r={p.attr.r} />
      default: {
        const _e: never = p
        return _e
      }
    }
  })
}

function SvgBase({
  title,
  size = 20,
  children
}: {
  title?: string
  size?: number
  children: ReactNode
}): JSX.Element {
  const labeled = title !== undefined && title.length > 0
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labeled ? undefined : true}
      role={labeled ? 'img' : undefined}
    >
      {labeled ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function IconFolderOpen({
  title = 'Открыть файл',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.folder)}
    </SvgBase>
  )
}

export function IconRefreshCw({
  title = 'Обновить',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.refreshCw)}
    </SvgBase>
  )
}

export function IconDownload({
  title = 'Загрузки',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.download)}
    </SvgBase>
  )
}

/** §6 / v0 — «Из буфера» на вкладке загрузок (общий stroke с `DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard`). */
export function IconClipboardPaste({
  title = 'Вставить из буфера',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard)}
    </SvgBase>
  )
}

/** §6 — отдельное окно yt-dlp (pop-out), тот же глиф, что external-link в очереди. */
export function IconPopOutWindow({
  title = 'Открыть отдельное окно загрузок',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.popOutWindow)}
    </SvgBase>
  )
}

export function IconFilm({
  title = 'Инспектор',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.film)}
    </SvgBase>
  )
}

export function IconZoomOut({
  title = 'Уменьшить масштаб таймлайна',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TIMELINE_ICONS.zoomOut)}
    </SvgBase>
  )
}

export function IconZoomIn({
  title = 'Увеличить масштаб таймлайна',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TIMELINE_ICONS.zoomIn)}
    </SvgBase>
  )
}

export function IconCircleHelp({
  title = 'О программе',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.circleHelp)}
    </SvgBase>
  )
}

export function IconImage({
  title = 'Снимок кадра',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.image)}
    </SvgBase>
  )
}

export function IconSave({
  title = 'Экспорт',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.save)}
    </SvgBase>
  )
}

export function IconBan({ title = '', size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.ban)}
    </SvgBase>
  )
}

export function IconCloudDownload({
  title = '',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.cloudDownload)}
    </SvgBase>
  )
}

export function IconSettings({
  title = 'Пути к движкам',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.settings)}
    </SvgBase>
  )
}

export function IconSun({
  title = 'Светлая тема',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_THEME_ICONS.sun)}
    </SvgBase>
  )
}

export function IconMoon({
  title = 'Тёмная тема',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_THEME_ICONS.moon)}
    </SvgBase>
  )
}

export function IconSkipBack({
  title = 'В начало',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.skipBack)}
    </SvgBase>
  )
}

export function IconChevronLeft({
  title = 'Назад на 5 сек',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.chevronLeft)}
    </SvgBase>
  )
}

export function IconChevronRight({
  title = 'Вперёд на 5 сек',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.chevronRight)}
    </SvgBase>
  )
}

export function IconSkipForward({
  title = 'В конец',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.skipForward)}
    </SvgBase>
  )
}

export function IconPlay({
  title = 'Воспроизвести',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.play)}
    </SvgBase>
  )
}

export function IconPauseUi({
  title = 'Пауза',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.pause)}
    </SvgBase>
  )
}

export function IconVolume2({
  title = 'Громкость',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.volume2)}
    </SvgBase>
  )
}

export function IconVolumeX({
  title = 'Без звука',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.volumeX)}
    </SvgBase>
  )
}

export function IconMaximize2({
  title = 'Полноэкранный предпросмотр',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.maximize2)}
    </SvgBase>
  )
}

export function IconRotateCcw({
  title = 'Шаг поворота против часовой (как FFmpeg §7.2)',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_TOOLS_ICONS.rotateCcw)}
    </SvgBase>
  )
}

export function IconRotateCw({
  title = 'Шаг поворота по часовой (как FFmpeg §7.2)',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_TOOLS_ICONS.rotateCw)}
    </SvgBase>
  )
}

export function IconScissors({
  title = 'Следующий crop-пресет (§7.2)',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_TOOLS_ICONS.scissors)}
    </SvgBase>
  )
}

/** §6 — reorder / file / folder / trash / retry (те же пути, что data HTML `RowIco`). */
export function IconQueueChevronUp({
  title = 'Выше',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.chevUp)}
    </SvgBase>
  )
}

export function IconQueueChevronDown({
  title = 'Ниже',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.chevDown)}
    </SvgBase>
  )
}

/** §6 — добавить URL в очередь (lucide `plus`, тот же путь, что `RowIco.plus` в pop-out). */
export function IconQueuePlus({
  title = 'Добавить',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.plus)}
    </SvgBase>
  )
}

export function IconQueueRetry({
  title = 'Повтор',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.retry)}
    </SvgBase>
  )
}

export function IconQueueFile({
  title = 'Открыть файл',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.file)}
    </SvgBase>
  )
}

export function IconQueueOutbound({
  title = 'Открыть в редакторе',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.outbound)}
    </SvgBase>
  )
}

export function IconQueueTrash({
  title = 'Удалить из очереди',
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.trash)}
    </SvgBase>
  )
}
