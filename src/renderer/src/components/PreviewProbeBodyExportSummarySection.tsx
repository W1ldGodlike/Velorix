import type { JSX } from 'react'

import { uiText } from '../locales/ui-text'
import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodyExportSummarySection({
  ctx
}: {
  ctx: PreviewProbeBodyCtx
}): JSX.Element {
  const {
    probeRefreshing,
    sectionOpen,
    persistOrLocalSectionToggle,
    probeExportSummaryRegionId,
    handleSaveSummaryTxt,
    handleSaveSummaryHtml
  } = ctx

  return (
    <details
      className="app-probe-details"
      aria-label={uiText('probeSectionExportSummary')}
      aria-describedby="probeExportSummaryHint probePanelOverviewHint"
      aria-busy={probeRefreshing}
      open={sectionOpen('exportSummary')}
      onToggle={(e) => {
        persistOrLocalSectionToggle('exportSummary', e.currentTarget.open)
      }}
    >
      <summary
        className="app-probe-summary"
        aria-controls={probeExportSummaryRegionId}
        aria-describedby="probeExportSummaryHint probePanelOverviewHint"
      >
        {uiText('probeSectionExportSummary')}
      </summary>
      <div
        id={probeExportSummaryRegionId}
        aria-describedby="probeExportSummaryHint probePanelOverviewHint"
        aria-busy={probeRefreshing}
      >
        <p id="probeExportSummaryHint" className="app-probe-toolbar-hint">
          {uiText('probeSectionExportSummaryHint')}
        </p>
        <div
          className="app-probe-json-toolbar"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('probeExportSummaryToolbarAria')}
          aria-describedby="probeExportSummaryHint probePanelOverviewHint"
          aria-busy={probeRefreshing}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="probeExportSummaryHint"
            title={uiText('probeSaveSummaryTxtButton')}
            onClick={() => {
              void handleSaveSummaryTxt()
            }}
          >
            {uiText('probeSaveSummaryTxtButton')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="probeExportSummaryHint"
            title={uiText('probeSaveSummaryHtmlButton')}
            onClick={() => {
              void handleSaveSummaryHtml()
            }}
          >
            {uiText('probeSaveSummaryHtmlButton')}
          </button>
        </div>
      </div>
    </details>
  )
}
