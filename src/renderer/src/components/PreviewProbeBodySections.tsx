import type { JSX } from 'react'

import { PreviewProbeBodyChaptersSection } from './PreviewProbeBodyChaptersSection'
import { PreviewProbeBodyExportSummarySection } from './PreviewProbeBodyExportSummarySection'
import { PreviewProbeBodyRawJsonSection } from './PreviewProbeBodyRawJsonSection'
import { PreviewProbeBodyTracksSection } from './PreviewProbeBodyTracksSection'
import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodySections({ ctx }: { ctx: PreviewProbeBodyCtx }): JSX.Element {
  return (
    <>
      <PreviewProbeBodyExportSummarySection ctx={ctx} />
      <PreviewProbeBodyTracksSection ctx={ctx} />
      <PreviewProbeBodyChaptersSection ctx={ctx} />
      <PreviewProbeBodyRawJsonSection ctx={ctx} />
    </>
  )
}
