import type { JSX, ReactNode } from 'react'

import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TIMELINE_ICONS,
  EDITOR_THEME_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  EDITOR_TRANSPORT_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  WORKSPACE_TAB_ICONS,
  type StrokePrim
} from '../../../shared/lucide-downloads-icons'
import { miniIconTitle } from '../locales/ui-text'

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
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconFolderOpen')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.folder)}
    </SvgBase>
  )
}

export function IconRefreshCw({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconRefreshCw')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.refreshCw)}
    </SvgBase>
  )
}

export function IconDownload({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconDownload')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.download)}
    </SvgBase>
  )
}

/** §6 / v0 — иконка `clipboard` (stroke как `DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard`). */
export function IconClipboardPaste({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconClipboardPaste')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard)}
    </SvgBase>
  )
}

/** §6 — отдельное окно yt-dlp (pop-out), тот же глиф, что external-link в очереди. */
export function IconPopOutWindow({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconPopOutWindow')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.popOutWindow)}
    </SvgBase>
  )
}

export function IconFilm({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconFilm')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.film)}
    </SvgBase>
  )
}

/** §6 rail — «По умолчанию» для каталога (тот же `home`, что топбар pop-out). */
export function IconHome({ title, size = 18 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconHome')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.home)}
    </SvgBase>
  )
}

export function IconZoomOut({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconZoomOut')} size={size}>
      {renderStrokeParts(EDITOR_TIMELINE_ICONS.zoomOut)}
    </SvgBase>
  )
}

export function IconZoomIn({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconZoomIn')} size={size}>
      {renderStrokeParts(EDITOR_TIMELINE_ICONS.zoomIn)}
    </SvgBase>
  )
}

export function IconCircleHelp({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconCircleHelp')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.circleHelp)}
    </SvgBase>
  )
}

export function IconBook({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconBook')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.book)}
    </SvgBase>
  )
}

export function IconImage({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconImage')} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.image)}
    </SvgBase>
  )
}

export function IconSave({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconSave')} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.save)}
    </SvgBase>
  )
}

export function IconBan({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? ''} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.ban)}
    </SvgBase>
  )
}

export function IconCloudDownload({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? ''} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_ACTION_ICONS.cloudDownload)}
    </SvgBase>
  )
}

export function IconSettings({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconSettings')} size={size}>
      {renderStrokeParts(DOWNLOADS_TOPBAR_CLUSTER_ICONS.settings)}
    </SvgBase>
  )
}

export function IconSun({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconSun')} size={size}>
      {renderStrokeParts(EDITOR_THEME_ICONS.sun)}
    </SvgBase>
  )
}

export function IconMoon({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconMoon')} size={size}>
      {renderStrokeParts(EDITOR_THEME_ICONS.moon)}
    </SvgBase>
  )
}

export function IconSkipBack({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconSkipBack')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.skipBack)}
    </SvgBase>
  )
}

export function IconChevronLeft({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconChevronLeft')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.chevronLeft)}
    </SvgBase>
  )
}

export function IconChevronRight({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconChevronRight')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.chevronRight)}
    </SvgBase>
  )
}

export function IconSkipForward({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconSkipForward')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.skipForward)}
    </SvgBase>
  )
}

export function IconPlay({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconPlay')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.play)}
    </SvgBase>
  )
}

export function IconPauseUi({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconPauseUi')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.pause)}
    </SvgBase>
  )
}

export function IconVolume2({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconVolume2')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.volume2)}
    </SvgBase>
  )
}

export function IconVolumeX({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconVolumeX')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.volumeX)}
    </SvgBase>
  )
}

export function IconMaximize2({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconMaximize2')} size={size}>
      {renderStrokeParts(EDITOR_TRANSPORT_ICONS.maximize2)}
    </SvgBase>
  )
}

export function IconWorkspaceEditor({
  title,
  size = 16
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? ''} size={size}>
      {renderStrokeParts(WORKSPACE_TAB_ICONS.editor)}
    </SvgBase>
  )
}

export function IconWorkspaceTerminal({
  title,
  size = 16
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? ''} size={size}>
      {renderStrokeParts(WORKSPACE_TAB_ICONS.terminal)}
    </SvgBase>
  )
}

export function IconRotateCcw({
  title,
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconRotateCcw')} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_TOOLS_ICONS.rotateCcw)}
    </SvgBase>
  )
}

export function IconRotateCw({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconRotateCw')} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_TOOLS_ICONS.rotateCw)}
    </SvgBase>
  )
}

export function IconScissors({ title, size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconScissors')} size={size}>
      {renderStrokeParts(EDITOR_TOPBAR_TOOLS_ICONS.scissors)}
    </SvgBase>
  )
}

/** §6 — reorder / file / folder / trash / retry (те же пути, что data HTML `RowIco`). */
export function IconQueueChevronUp({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueChevronUp')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.chevUp)}
    </SvgBase>
  )
}

export function IconQueueChevronDown({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueChevronDown')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.chevDown)}
    </SvgBase>
  )
}

/** §6 — добавить URL в очередь (lucide `plus`, тот же путь, что `RowIco.plus` в pop-out). */
export function IconQueuePlus({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueuePlus')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.plus)}
    </SvgBase>
  )
}

export function IconQueueRetry({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueRetry')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.retry)}
    </SvgBase>
  )
}

export function IconQueueFile({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueFile')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.file)}
    </SvgBase>
  )
}

export function IconQueueOutbound({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueOutbound')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.outbound)}
    </SvgBase>
  )
}

export function IconQueueTrash({
  title,
  size = 18
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueTrash')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.trash)}
    </SvgBase>
  )
}

/** §6 — очистить вид лога (lucide `x`, тот же путь, что `RowIco.x`). */
export function IconQueueX({ title, size = 18 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title ?? miniIconTitle('miniIconQueueX')} size={size}>
      {renderStrokeParts(QUEUE_ROW_ACTION_ICONS.x)}
    </SvgBase>
  )
}
