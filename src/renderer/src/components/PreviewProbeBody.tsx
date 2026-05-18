import type { JSX } from 'react'

import { uiText } from '../locales/ui-text'
import { PreviewProbeBodyContextMenu } from './PreviewProbeBodyContextMenu'
import { PreviewProbeBodyOverview } from './PreviewProbeBodyOverview'
import { PreviewProbeBodySections } from './PreviewProbeBodySections'
import type { PreviewProbeBodyProps } from './preview-probe-body-props'
import { usePreviewProbeBody } from './use-preview-probe-body'

export function PreviewProbeBody(props: PreviewProbeBodyProps): JSX.Element {
  const ctx = usePreviewProbeBody(props)

  return (
    <>
      <div
        className="app-preview-probe-stack"
        role="region"
        aria-label={uiText('probePanelAriaLabel')}
        aria-describedby="probePanelOverviewHint"
        aria-busy={ctx.probeRefreshing}
      >
        <p id="probePanelOverviewHint" className="app-visually-hidden">
          {uiText('probePanelOverviewHint')}
        </p>
        <PreviewProbeBodyOverview
          ctx={ctx}
          {...(props.onOpenKnowledgeArticle
            ? { onOpenKnowledgeArticle: props.onOpenKnowledgeArticle }
            : {})}
        />
        <PreviewProbeBodySections ctx={ctx} />
      </div>
      <PreviewProbeBodyContextMenu ctx={ctx} />
    </>
  )
}
