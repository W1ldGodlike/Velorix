import type { JSX } from 'react'

import {
  formatProbeBitrateLine,
  keyboardProbeMenuPosition,
  PROBE_TRACKS_TABLE_HEADER_IDS,
  probeTrackKindLabel,
  clampProbeTableMenuPosition
} from './media-probe-panel-helpers'
import { uiText, uiTextVars } from '../locales/ui-text'
import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodyTracksSection({
  ctx
}: {
  ctx: PreviewProbeBodyCtx
}): JSX.Element | null {
  const {
    probeInfo,
    probeRefreshing,
    sectionOpen,
    persistOrLocalSectionToggle,
    dash,
    probeTracksRegionId,
    setProbeTableMenu
  } = ctx

  if (probeInfo.tracks.length === 0) {
    return null
  }

  return (
    <details
      className="app-probe-details"
      aria-label={uiTextVars('probeSectionTracksTemplate', {
        count: probeInfo.tracks.length
      })}
      aria-describedby="probePanelOverviewHint"
      aria-busy={probeRefreshing}
      open={sectionOpen('tracks')}
      onToggle={(e) => {
        persistOrLocalSectionToggle('tracks', e.currentTarget.open)
      }}
    >
      <summary
        className="app-probe-summary"
        aria-controls={probeTracksRegionId}
        aria-describedby="probePanelOverviewHint"
      >
        {uiTextVars('probeSectionTracksTemplate', { count: probeInfo.tracks.length })}
      </summary>
      <div
        id={probeTracksRegionId}
        className="app-probe-table-wrap"
        role="group"
        aria-label={uiText('probeTracksTableWrapGroupAria')}
        aria-describedby="probePanelOverviewHint"
        aria-busy={probeRefreshing}
      >
        <table className="app-probe-table" aria-busy={probeRefreshing}>
          <caption className="app-visually-hidden">{uiText('probeTracksCaption')}</caption>
          <thead>
            <tr>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.index}>
                {uiText('probeThIndex')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.kind}>
                {uiText('probeThType')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.codec}>
                {uiText('probeThCodec')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.pixelFormat}>
                {uiText('probeThPixFmt')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.sar}>
                {uiText('probeThSar')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.dar}>
                {uiText('probeThDar')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.colorSpace}>
                {uiText('probeThColorSpace')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.primaries}>
                {uiText('probeThPrimaries')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.transfer}>
                {uiText('probeThTransfer')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.range}>
                {uiText('probeThRange')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.bitrate}>
                {uiText('probeThBitrate')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.disposition}>
                {uiText('probeThDisposition')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.language}>
                {uiText('probeThLanguage')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.title}>
                {uiText('probeThTrackTitle')}
              </th>
              <th scope="col" id={PROBE_TRACKS_TABLE_HEADER_IDS.details}>
                {uiText('probeThDetails')}
              </th>
            </tr>
          </thead>
          <tbody>
            {probeInfo.tracks.map((row) => (
              <tr
                key={`track-${row.index}`}
                tabIndex={0}
                title={uiText('probeTrackRowMenuHint')}
                onContextMenu={(e) => {
                  e.preventDefault()
                  const p = clampProbeTableMenuPosition(e.clientX, e.clientY)
                  setProbeTableMenu({ variant: 'track', x: p.x, y: p.y, row })
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' ||
                    e.key === 'ContextMenu' ||
                    (e.shiftKey && e.key === 'F10')
                  ) {
                    e.preventDefault()
                    const p = keyboardProbeMenuPosition(e.currentTarget)
                    setProbeTableMenu({ variant: 'track', x: p.x, y: p.y, row })
                  }
                }}
              >
                <td headers={PROBE_TRACKS_TABLE_HEADER_IDS.index}>{row.index}</td>
                <td headers={PROBE_TRACKS_TABLE_HEADER_IDS.kind}>
                  {probeTrackKindLabel(row.kind)}
                </td>
                <td className="app-probe-table-mono" headers={PROBE_TRACKS_TABLE_HEADER_IDS.codec}>
                  {row.codec}
                </td>
                <td
                  className="app-probe-table-mono"
                  headers={PROBE_TRACKS_TABLE_HEADER_IDS.pixelFormat}
                >
                  {row.pixelFormat ?? dash}
                </td>
                <td className="app-probe-table-mono" headers={PROBE_TRACKS_TABLE_HEADER_IDS.sar}>
                  {row.sampleAspectRatio ?? dash}
                </td>
                <td className="app-probe-table-mono" headers={PROBE_TRACKS_TABLE_HEADER_IDS.dar}>
                  {row.displayAspectRatio ?? dash}
                </td>
                <td
                  className="app-probe-table-mono"
                  headers={PROBE_TRACKS_TABLE_HEADER_IDS.colorSpace}
                >
                  {row.colorSpace ?? dash}
                </td>
                <td
                  className="app-probe-table-mono"
                  headers={PROBE_TRACKS_TABLE_HEADER_IDS.primaries}
                >
                  {row.colorPrimaries ?? dash}
                </td>
                <td
                  className="app-probe-table-mono"
                  headers={PROBE_TRACKS_TABLE_HEADER_IDS.transfer}
                >
                  {row.colorTransfer ?? dash}
                </td>
                <td className="app-probe-table-mono" headers={PROBE_TRACKS_TABLE_HEADER_IDS.range}>
                  {row.colorRange ?? dash}
                </td>
                <td
                  headers={PROBE_TRACKS_TABLE_HEADER_IDS.bitrate}
                  title={formatProbeBitrateLine(row.streamBitrateKbps) ?? undefined}
                >
                  {formatProbeBitrateLine(row.streamBitrateKbps) ?? dash}
                </td>
                <td
                  headers={PROBE_TRACKS_TABLE_HEADER_IDS.disposition}
                  title={row.dispositionSummary.trim() !== '' ? row.dispositionSummary : undefined}
                >
                  {row.dispositionSummary.trim() !== '' ? row.dispositionSummary : dash}
                </td>
                <td headers={PROBE_TRACKS_TABLE_HEADER_IDS.language}>{row.language ?? dash}</td>
                <td headers={PROBE_TRACKS_TABLE_HEADER_IDS.title}>{row.titleTag ?? dash}</td>
                <td headers={PROBE_TRACKS_TABLE_HEADER_IDS.details}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
