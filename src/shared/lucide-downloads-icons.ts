/**
 * Единые lucide-подобные SVG-примитивы (shared stroke data для renderer React).
 */

export type { StrokePrim } from './lucide-downloads-icons-types'
export { SVG_NS, escapeXmlAttr } from './lucide-downloads-icons-types'

export { QUEUE_ROW_ACTION_ICONS, type QueueRowActionIconKey } from './lucide-downloads-icons-queue'

export {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  WORKSPACE_TAB_ICONS,
  type DownloadsTopbarClusterIconKey
} from './lucide-downloads-icons-clusters'

export {
  EDITOR_TRANSPORT_ICONS,
  EDITOR_TIMELINE_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS
} from './lucide-downloads-icons-editor'

export { emitInlineStrokeSvg } from './lucide-downloads-icons-emit'
