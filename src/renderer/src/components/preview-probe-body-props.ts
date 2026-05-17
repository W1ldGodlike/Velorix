import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import type { PreviewProbeSectionKey } from './media-probe-panel-helpers'

export type PreviewProbeBodyProps = {
  probeInfo: MediaProbeSuccess
  mediaPathForDefaultSave?: string
  probeSectionOpen?: Partial<Record<PreviewProbeSectionKey, boolean>>
  onProbeSectionToggle?: (key: PreviewProbeSectionKey, open: boolean) => void
  /** Текущее обновление ffprobe выбранного файла (инспектор / будущие встраивания). */
  probeRefreshing?: boolean
}
