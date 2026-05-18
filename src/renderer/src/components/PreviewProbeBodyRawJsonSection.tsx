import type { JSX } from 'react'

import { formatProbeJsonForDisplay } from './media-probe-panel-helpers'
import { uiText } from '../locales/ui-text'
import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodyRawJsonSection({
  ctx
}: {
  ctx: PreviewProbeBodyCtx
}): JSX.Element | null {
  const {
    probeInfo,
    probeRefreshing,
    sectionOpen,
    persistOrLocalSectionToggle,
    probeRawJsonRegionId,
    handleCopyProbeJson,
    handleSaveProbeJson
  } = ctx

  if (probeInfo.rawJson.length === 0) {
    return null
  }

  return (
    <details
      className="app-probe-details"
      aria-label={uiText('probeSectionRawJson')}
      aria-describedby="probeRawJsonHint probePanelOverviewHint"
      aria-busy={probeRefreshing}
      open={sectionOpen('rawJson')}
      onToggle={(e) => {
        persistOrLocalSectionToggle('rawJson', e.currentTarget.open)
      }}
    >
      <summary
        className="app-probe-summary"
        aria-controls={probeRawJsonRegionId}
        aria-describedby="probeRawJsonHint probePanelOverviewHint"
      >
        {uiText('probeSectionRawJson')}
      </summary>
      <div
        id={probeRawJsonRegionId}
        aria-describedby="probeRawJsonHint probePanelOverviewHint"
      >
        <p id="probeRawJsonHint" className="app-probe-toolbar-hint">
          {uiText('probeRawJsonHint')}
        </p>
        <div
          className="app-probe-json-toolbar"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('probeRawJsonToolbarAria')}
          aria-describedby="probeRawJsonHint probePanelOverviewHint"
          aria-busy={probeRefreshing}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="probeRawJsonHint"
            title={uiText('probeCopyJsonButton')}
            onClick={() => {
              void handleCopyProbeJson()
            }}
          >
            {uiText('probeCopyJsonButton')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="probeRawJsonHint"
            title={uiText('probeSaveJsonButton')}
            onClick={() => {
              void handleSaveProbeJson()
            }}
          >
            {uiText('probeSaveJsonButton')}
          </button>
        </div>
        <pre
          className="app-probe-json-pre"
          aria-label={uiText('probeRawJsonPreAria')}
          aria-describedby="probeRawJsonHint"
          aria-busy={probeRefreshing}
        >
          {formatProbeJsonForDisplay(probeInfo.rawJson)}
        </pre>
      </div>
    </details>
  )
}
