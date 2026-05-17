import type { JSX } from 'react'
import { formatProbeChapterTimecode } from '../../../shared/ffprobe-timecode'
import {
  formatProbeBitrateLine,
  formatProbeChapterDurationSec,
  keyboardProbeMenuPosition,
  PROBE_CHAPTERS_TABLE_HEADER_IDS,
  PROBE_TRACKS_TABLE_HEADER_IDS,
  probeTrackKindLabel,
  formatProbeJsonForDisplay,
  clampProbeTableMenuPosition
} from './media-probe-panel-helpers'
import { uiText, uiTextVars } from '../locales/ui-text'

import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodySections({ ctx }: { ctx: PreviewProbeBodyCtx }): JSX.Element {
  const {
    probeInfo,
    probeRefreshing,
    sectionOpen,
    persistOrLocalSectionToggle,
    dash,
    probeExportSummaryRegionId,
    probeTracksRegionId,
    probeChaptersRegionId,
    probeRawJsonRegionId,
    setProbeTableMenu,
    handleSaveSummaryTxt,
    handleSaveSummaryHtml,
    handleCopyProbeJson,
    handleSaveProbeJson
  } = ctx

  return (
    <>
      <details
        className="app-probe-details"
        aria-label={uiText('probeSectionExportSummary')}
        aria-busy={probeRefreshing}
        open={sectionOpen('exportSummary')}
        onToggle={(e) => {
          persistOrLocalSectionToggle('exportSummary', e.currentTarget.open)
        }}
      >
        <summary className="app-probe-summary" aria-controls={probeExportSummaryRegionId}>
          {uiText('probeSectionExportSummary')}
        </summary>
        <div id={probeExportSummaryRegionId} aria-busy={probeRefreshing}>
          <p id="probeExportSummaryHint" className="app-probe-toolbar-hint">
            {uiText('probeSectionExportSummaryHint')}
          </p>
          <div
            className="app-probe-json-toolbar"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('probeExportSummaryToolbarAria')}
            aria-busy={probeRefreshing}
          >
            <button
              type="button"
              className="app-btn app-btn-compact"
              aria-describedby="probeExportSummaryHint"
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
              onClick={() => {
                void handleSaveSummaryHtml()
              }}
            >
              {uiText('probeSaveSummaryHtmlButton')}
            </button>
          </div>
        </div>
      </details>
      {probeInfo.tracks.length > 0 ? (
        <details
          className="app-probe-details"
          aria-label={uiTextVars('probeSectionTracksTemplate', {
            count: probeInfo.tracks.length
          })}
          aria-busy={probeRefreshing}
          open={sectionOpen('tracks')}
          onToggle={(e) => {
            persistOrLocalSectionToggle('tracks', e.currentTarget.open)
          }}
        >
          <summary className="app-probe-summary" aria-controls={probeTracksRegionId}>
            {uiTextVars('probeSectionTracksTemplate', { count: probeInfo.tracks.length })}
          </summary>
          <div
            id={probeTracksRegionId}
            className="app-probe-table-wrap"
            role="group"
            aria-label={uiText('probeTracksTableWrapGroupAria')}
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
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_TRACKS_TABLE_HEADER_IDS.codec}
                    >
                      {row.codec}
                    </td>
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_TRACKS_TABLE_HEADER_IDS.pixelFormat}
                    >
                      {row.pixelFormat ?? dash}
                    </td>
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_TRACKS_TABLE_HEADER_IDS.sar}
                    >
                      {row.sampleAspectRatio ?? dash}
                    </td>
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_TRACKS_TABLE_HEADER_IDS.dar}
                    >
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
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_TRACKS_TABLE_HEADER_IDS.range}
                    >
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
                      title={
                        row.dispositionSummary.trim() !== '' ? row.dispositionSummary : undefined
                      }
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
      ) : null}
      {probeInfo.chapters.length > 0 ? (
        <details
          className="app-probe-details"
          aria-label={uiTextVars('probeSectionChaptersTemplate', {
            count: probeInfo.chapters.length
          })}
          aria-busy={probeRefreshing}
          open={sectionOpen('chapters')}
          onToggle={(e) => {
            persistOrLocalSectionToggle('chapters', e.currentTarget.open)
          }}
        >
          <summary className="app-probe-summary" aria-controls={probeChaptersRegionId}>
            {uiTextVars('probeSectionChaptersTemplate', { count: probeInfo.chapters.length })}
          </summary>
          <div
            id={probeChaptersRegionId}
            className="app-probe-table-wrap"
            role="group"
            aria-label={uiText('probeChaptersTableWrapGroupAria')}
            aria-busy={probeRefreshing}
          >
            <table className="app-probe-table" aria-busy={probeRefreshing}>
              <caption className="app-visually-hidden">{uiText('probeChaptersCaption')}</caption>
              <thead>
                <tr>
                  <th scope="col" id={PROBE_CHAPTERS_TABLE_HEADER_IDS.id}>
                    {uiText('probeThChapterId')}
                  </th>
                  <th scope="col" id={PROBE_CHAPTERS_TABLE_HEADER_IDS.start}>
                    {uiText('probeThChapterStart')}
                  </th>
                  <th scope="col" id={PROBE_CHAPTERS_TABLE_HEADER_IDS.end}>
                    {uiText('probeThChapterEnd')}
                  </th>
                  <th scope="col" id={PROBE_CHAPTERS_TABLE_HEADER_IDS.duration}>
                    {uiText('probeThChapterDuration')}
                  </th>
                  <th scope="col" id={PROBE_CHAPTERS_TABLE_HEADER_IDS.title}>
                    {uiText('probeThChapterTitle')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {probeInfo.chapters.map((ch) => (
                  <tr
                    key={`chapter-${ch.index}-${ch.startSec}`}
                    tabIndex={0}
                    title={uiText('probeChapterRowMenuHint')}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      const p = clampProbeTableMenuPosition(e.clientX, e.clientY)
                      setProbeTableMenu({ variant: 'chapter', x: p.x, y: p.y, row: ch })
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' ||
                        e.key === 'ContextMenu' ||
                        (e.shiftKey && e.key === 'F10')
                      ) {
                        e.preventDefault()
                        const p = keyboardProbeMenuPosition(e.currentTarget)
                        setProbeTableMenu({ variant: 'chapter', x: p.x, y: p.y, row: ch })
                      }
                    }}
                  >
                    <td headers={PROBE_CHAPTERS_TABLE_HEADER_IDS.id}>{ch.index}</td>
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_CHAPTERS_TABLE_HEADER_IDS.start}
                    >
                      {formatProbeChapterTimecode(ch.startSec)}
                    </td>
                    <td
                      className="app-probe-table-mono"
                      headers={PROBE_CHAPTERS_TABLE_HEADER_IDS.end}
                    >
                      {formatProbeChapterTimecode(ch.endSec)}
                    </td>
                    <td headers={PROBE_CHAPTERS_TABLE_HEADER_IDS.duration}>
                      {formatProbeChapterDurationSec(ch.endSec, ch.startSec, dash)}
                    </td>
                    <td headers={PROBE_CHAPTERS_TABLE_HEADER_IDS.title}>{ch.title ?? dash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
      {probeInfo.rawJson.length > 0 ? (
        <details
          className="app-probe-details"
          aria-label={uiText('probeSectionRawJson')}
          aria-busy={probeRefreshing}
          open={sectionOpen('rawJson')}
          onToggle={(e) => {
            persistOrLocalSectionToggle('rawJson', e.currentTarget.open)
          }}
        >
          <summary className="app-probe-summary" aria-controls={probeRawJsonRegionId}>
            {uiText('probeSectionRawJson')}
          </summary>
          <div id={probeRawJsonRegionId}>
            <p id="probeRawJsonHint" className="app-probe-toolbar-hint">
              {uiText('probeRawJsonHint')}
            </p>
            <div
              className="app-probe-json-toolbar"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('probeRawJsonToolbarAria')}
              aria-busy={probeRefreshing}
            >
              <button
                type="button"
                className="app-btn app-btn-compact"
                aria-describedby="probeRawJsonHint"
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
      ) : null}
    </>
  )
}
