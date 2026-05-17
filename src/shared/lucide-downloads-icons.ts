/**
 * Единые lucide-подобные SVG-примитивы для окна загрузок (data HTML) и топбара главного окна.
 * Пути взяты из lucide-icons (MIT); одна копия данных — меньше расхождений между React и inline SVG.
 */

export type { StrokePrim } from './lucide-downloads-icons-types'
export { SVG_NS, escapeXmlAttr } from './lucide-downloads-icons-types'

export {
  QUEUE_ROW_ACTION_ICONS,
  type QueueRowActionIconKey
} from './lucide-downloads-icons-queue'

export {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  WORKSPACE_TAB_ICONS,
  type DownloadsTopbarClusterIconKey
} from './lucide-downloads-icons-clusters'

export {
  EDITOR_TRANSPORT_ICONS,
  EDITOR_TIMELINE_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_THEME_ICONS
} from './lucide-downloads-icons-editor'

export {
  emitInlineStrokeSvg,
  emitDownloadsQueueRowIcoBootstrapJs,
  emitDownloadsTopbarClusterHtml
} from './lucide-downloads-icons-emit'
