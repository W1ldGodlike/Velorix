import type { JSX } from 'react'

import { formatProbeChapterTimecode } from '../../../shared/ffprobe-timecode'
import {
  formatProbeChapterDurationSec,
  keyboardProbeMenuPosition,
  PROBE_CHAPTERS_TABLE_HEADER_IDS,
  clampProbeTableMenuPosition
} from './media-probe-panel-helpers'
import { uiText, uiTextVars } from '../locales/ui-text'
import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodyChaptersSection({
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
    probeChaptersRegionId,
    setProbeTableMenu
  } = ctx

  if (probeInfo.chapters.length === 0) {
    return null
  }

  return (
    <details
      className="app-probe-details"
      aria-label={uiTextVars('probeSectionChaptersTemplate', {
        count: probeInfo.chapters.length
      })}
      aria-describedby="probePanelOverviewHint"
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
        aria-describedby="probePanelOverviewHint"
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
                <td className="app-probe-table-mono" headers={PROBE_CHAPTERS_TABLE_HEADER_IDS.end}>
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
  )
}
