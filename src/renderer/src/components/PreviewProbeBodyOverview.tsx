import type { JSX } from 'react'
import { FFPROBE_DOC_ALL } from '../../../shared/external-doc-urls'
import { formatFfprobeCreationTimeBrief } from '../../../shared/ffprobe-creation-time-brief'
import { collectFfprobeFormatScalarTagInspectorBriefs } from '../../../shared/ffprobe-format-tag-registry'
import { formatProbeDurationLabel } from './media-probe-panel-helpers'
import { uiText, uiTextVars } from '../locales/ui-text'

import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodyOverview({ ctx }: { ctx: PreviewProbeBodyCtx }): JSX.Element {
  const {
    probeInfo,
    probeRefreshing,
    formatTooltip,
    diagnosticsCompact,
    bitrateLabel,
    probeToolbarTip
  } = ctx

  return (
    <>
      <div
        className="app-preview-probe-summary-line"
        role="group"
        aria-label={uiText('probeSummaryReadoutGroupAria')}
        aria-describedby="probePanelOverviewHint"
        aria-busy={probeRefreshing}
      >
        <span title={formatTooltip}>
          {formatProbeDurationLabel(probeInfo.durationSec)}
          {probeInfo.video
            ? ` · ${probeInfo.video.width}×${probeInfo.video.height} · ${probeInfo.video.codec}`
            : ''}
          {probeInfo.audioCodec
            ? uiTextVars('probeSummaryAudioFragmentTemplate', { codec: probeInfo.audioCodec })
            : ''}
          {probeInfo.formatName ? ` · ${probeInfo.formatName}` : ''}
          {probeInfo.containerMajorBrand ? ` · ${probeInfo.containerMajorBrand}` : ''}
          {(() => {
            const created = formatFfprobeCreationTimeBrief(
              probeInfo.containerCreationTime !== null
                ? { creation_time: probeInfo.containerCreationTime }
                : undefined
            )
            return created ? ` · ${created}` : ''
          })()}
          {collectFfprobeFormatScalarTagInspectorBriefs(probeInfo).join('')}
          {diagnosticsCompact ? ` · ${diagnosticsCompact}` : ''}
          {bitrateLabel ? ` · ${bitrateLabel}` : ''}
        </span>
      </div>
      <nav
        className="app-doc-inline-links app-preview-probe-doc-links"
        aria-label={uiText('probeFfprobeDocNavAria')}
        aria-describedby="probePanelOverviewHint"
        aria-busy={probeRefreshing}
      >
        <a
          href={FFPROBE_DOC_ALL}
          target="_blank"
          rel="noreferrer"
          aria-describedby="probePanelOverviewHint"
        >
          {uiText('probeFfprobeDocLink')}
        </a>
      </nav>
      {probeToolbarTip ? (
        <div
          className="app-probe-copy-tip app-probe-tip-global"
          role="status"
          aria-live="polite"
          aria-label={uiText('probeToolbarFeedbackAria')}
          aria-describedby="probePanelOverviewHint"
          aria-busy={probeRefreshing}
        >
          {probeToolbarTip}
        </div>
      ) : null}
    </>
  )
}
