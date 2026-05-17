import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  QUEUE_ROW_ACTION_ICONS
} from '../../../shared/lucide-downloads-icons'
import { createLucideMiniIcon } from './lucide-mini-icons-core'

export const IconFolderOpen = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.folder, {
  titleKey: 'miniIconFolderOpen'
})

export const IconRefreshCw = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.refreshCw, {
  titleKey: 'miniIconRefreshCw'
})

export const IconDownload = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.download, {
  titleKey: 'miniIconDownload'
})

/** §6 / v0 — иконка `clipboard` (stroke как `DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard`). */
export const IconClipboardPaste = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard, {
  titleKey: 'miniIconClipboardPaste',
  defaultSize: 18
})

/** Копирование в буфер (lucide `copy`, те же штрихи, что `QUEUE_ROW_ACTION_ICONS.copy`). */
export const IconCopy = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.copy, {
  titleKey: 'miniIconCopy',
  defaultSize: 18
})

/** §6 — отдельное окно yt-dlp (pop-out), тот же глиф, что external-link в очереди. */
export const IconPopOutWindow = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.popOutWindow, {
  titleKey: 'miniIconPopOutWindow',
  defaultSize: 18
})

export const IconFilm = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.film, {
  titleKey: 'miniIconFilm'
})

/** §6 rail — «По умолчанию» для каталога (тот же `home`, что топбар pop-out). */
export const IconHome = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.home, {
  titleKey: 'miniIconHome',
  defaultSize: 18
})

export const IconCircleHelp = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.circleHelp, {
  titleKey: 'miniIconCircleHelp'
})

export const IconBook = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.book, {
  titleKey: 'miniIconBook'
})

export const IconSettings = createLucideMiniIcon(DOWNLOADS_TOPBAR_CLUSTER_ICONS.settings, {
  titleKey: 'miniIconSettings'
})

/** §6 — reorder / file / folder / trash / retry (те же пути, что data HTML `RowIco`). */
export const IconQueueChevronUp = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.chevUp, {
  titleKey: 'miniIconQueueChevronUp',
  defaultSize: 18
})

export const IconQueueChevronDown = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.chevDown, {
  titleKey: 'miniIconQueueChevronDown',
  defaultSize: 18
})

/** §6 — добавить URL в очередь (lucide `plus`, тот же путь, что `RowIco.plus` в pop-out). */
export const IconQueuePlus = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.plus, {
  titleKey: 'miniIconQueuePlus',
  defaultSize: 18
})

export const IconQueueRetry = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.retry, {
  titleKey: 'miniIconQueueRetry',
  defaultSize: 18
})

export const IconQueueFile = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.file, {
  titleKey: 'miniIconQueueFile',
  defaultSize: 18
})

export const IconQueueOutbound = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.outbound, {
  titleKey: 'miniIconQueueOutbound',
  defaultSize: 18
})

export const IconQueueTrash = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.trash, {
  titleKey: 'miniIconQueueTrash',
  defaultSize: 18
})

/** §6 — очистить вид лога (lucide `x`, тот же путь, что `RowIco.x`). */
export const IconQueueX = createLucideMiniIcon(QUEUE_ROW_ACTION_ICONS.x, {
  titleKey: 'miniIconQueueX',
  defaultSize: 18
})
