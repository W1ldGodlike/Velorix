import type { JSX } from 'react'

import { PreviewProbeBody } from './PreviewProbeBody'
import { uiText } from '../locales/ui-text'
import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import type { ProbeInspectorUiState } from '../inspector-workspace-probe-ui'
import type { PreviewProbeSectionKey } from './media-probe-panel-helpers'

export type InspectorWorkspaceMainProps = {
  mediaPath: string | null
  probePending: boolean
  displayedProbeInfo: MediaProbeSuccess | null
  displayedProbeError: string | null
  probeUiPanels: ProbeInspectorUiState
  persistProbeSection: (key: PreviewProbeSectionKey, open: boolean) => void
  handleDrop: (files: FileList | null) => Promise<void>
  onOpenKnowledgeArticle?: (slug: string) => void
}

export function InspectorWorkspaceMain(props: InspectorWorkspaceMainProps): JSX.Element {
  const {
    mediaPath,
    probePending,
    displayedProbeInfo,
    displayedProbeError,
    probeUiPanels,
    persistProbeSection,
    handleDrop,
    onOpenKnowledgeArticle
  } = props

  return (
    <section
      className="app-main inspector-workspace-main app-inspector-workspace-main"
      aria-label={uiText('inspectorWorkspaceMainAria')}
      aria-describedby={mediaPath ? undefined : 'inspector-workspace-empty-hint'}
      aria-busy={probePending}
      onDragOver={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onDrop={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void handleDrop(event.dataTransfer.files)
      }}
    >
      <p
        id="inspector-workspace-empty-hint"
        className={mediaPath ? 'app-visually-hidden' : 'inspector-workspace-hint'}
      >
        {uiText('inspectorWorkspaceEmptyHint')}
      </p>
      {!mediaPath ? (
        <div
          role="region"
          aria-label={uiText('inspectorWorkspaceEmptyRegionAria')}
          aria-describedby="inspector-workspace-empty-hint"
          aria-busy={probePending}
        />
      ) : null}
      {mediaPath && !displayedProbeInfo ? (
        <p id="inspector-workspace-probe-hint" className="app-visually-hidden">
          {uiText('probePanelOverviewHint')}
        </p>
      ) : null}
      {displayedProbeError ? (
        <p
          className="app-preview-probe-error"
          role="alert"
          aria-describedby="inspector-workspace-probe-hint inspector-workspace-empty-hint"
        >
          {displayedProbeError}
        </p>
      ) : null}
      {displayedProbeInfo ? (
        <div
          className="app-preview-probe inspector-workspace-probe"
          aria-live="polite"
          role="region"
          aria-label={uiText('inspectorWorkspaceProbeStackAria')}
          aria-describedby="probePanelOverviewHint"
          aria-busy={probePending && mediaPath !== null}
        >
          <PreviewProbeBody
            probeInfo={displayedProbeInfo}
            {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
            probeRefreshing={probePending && mediaPath !== null}
            probeSectionOpen={{
              exportSummary: probeUiPanels.probeExportSummary,
              tracks: probeUiPanels.probeTracks,
              chapters: probeUiPanels.probeChapters,
              rawJson: probeUiPanels.probeRawJson
            }}
            onProbeSectionToggle={persistProbeSection}
            {...(typeof mediaPath === 'string' && mediaPath.length > 0
              ? { mediaPathForDefaultSave: mediaPath }
              : {})}
          />
        </div>
      ) : null}
      {mediaPath ? (
        <footer
          className="inspector-workspace-path"
          title={mediaPath}
          aria-label={uiText('inspectorWorkspacePathFooterAria')}
          aria-describedby="inspector-workspace-empty-hint"
          aria-busy={probePending}
        >
          {mediaPath}
        </footer>
      ) : null}
    </section>
  )
}
