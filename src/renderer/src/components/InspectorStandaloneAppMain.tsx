import type { JSX } from 'react'

import { PreviewProbeBody } from './MediaProbePanel'
import { uiText } from '../locales/ui-text'
import type { InspectorStandaloneAppModel } from '../use-inspector-standalone-app'

export function InspectorStandaloneAppMain(props: InspectorStandaloneAppModel): JSX.Element {
  const {
    mediaPath,
    probePending,
    displayedProbeInfo,
    displayedProbeError,
    probeUiPanels,
    persistProbeSection,
    handleDrop
  } = props

  return (
    <main
      className="app-main inspector-standalone-main"
      aria-label={uiText('inspectorStandaloneMainAria')}
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
      {!mediaPath ? (
        <div
          role="region"
          aria-label={uiText('inspectorStandaloneEmptyRegionAria')}
          aria-busy={probePending}
        >
          <p className="inspector-standalone-hint">{uiText('inspectorStandaloneEmptyHint')}</p>
        </div>
      ) : null}
      {displayedProbeError ? (
        <p className="app-preview-probe-error" role="alert">
          {displayedProbeError}
        </p>
      ) : null}
      {displayedProbeInfo ? (
        <div
          className="app-preview-probe inspector-standalone-probe"
          aria-live="polite"
          role="region"
          aria-label={uiText('inspectorStandaloneProbeStackAria')}
          aria-busy={probePending && mediaPath !== null}
        >
          <PreviewProbeBody
            probeInfo={displayedProbeInfo}
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
          className="inspector-standalone-path"
          title={mediaPath}
          aria-label={uiText('inspectorStandalonePathFooterAria')}
          aria-busy={probePending}
        >
          {mediaPath}
        </footer>
      ) : null}
    </main>
  )
}
