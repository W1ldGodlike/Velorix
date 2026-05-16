import { useEffect, useId, useRef, useState } from 'react'
import type { JSX } from 'react'
import { createPortal } from 'react-dom'

import type {
  MediaProbeChapterRow,
  MediaProbeSuccess,
  MediaProbeTrackRow
} from '../../../shared/ffprobe-contract'
import {
  defaultFfprobeJsonFileName,
  defaultFfprobeSummaryHtmlFileName,
  defaultFfprobeSummaryTxtFileName,
  formatProbeSummaryHtmlDocument,
  formatProbeSummaryPlainText
} from '../../../shared/ffprobe-summary-export'
import { formatProbeChapterTimecode } from '../../../shared/ffprobe-timecode'
import { FFPROBE_DOC_ALL } from '../../../shared/external-doc-urls'
import { getUiLocale, uiText, uiTextVars } from '../locales/ui-text'

type ProbeTableContextMenu =
  | null
  | { variant: 'track'; x: number; y: number; row: MediaProbeTrackRow }
  | { variant: 'chapter'; x: number; y: number; row: MediaProbeChapterRow }

function clampProbeTableMenuPosition(clientX: number, clientY: number): { x: number; y: number } {
  const margin = 8
  const estW = 260
  const estH = Math.min(420, Math.max(180, window.innerHeight - margin * 2))
  const x = Math.min(Math.max(margin, clientX), Math.max(margin, window.innerWidth - estW - margin))
  const y = Math.min(
    Math.max(margin, clientY),
    Math.max(margin, window.innerHeight - estH - margin)
  )
  return { x, y }
}

function keyboardProbeMenuPosition(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return clampProbeTableMenuPosition(rect.left + 24, rect.top + 24)
}

const PROBE_TRACKS_TABLE_HEADER_IDS = {
  index: 'probe-tracks-th-index',
  kind: 'probe-tracks-th-kind',
  codec: 'probe-tracks-th-codec',
  pixelFormat: 'probe-tracks-th-pixfmt',
  sar: 'probe-tracks-th-sar',
  dar: 'probe-tracks-th-dar',
  colorSpace: 'probe-tracks-th-colorspace',
  primaries: 'probe-tracks-th-primaries',
  transfer: 'probe-tracks-th-transfer',
  range: 'probe-tracks-th-range',
  bitrate: 'probe-tracks-th-bitrate',
  disposition: 'probe-tracks-th-disposition',
  language: 'probe-tracks-th-language',
  title: 'probe-tracks-th-title',
  details: 'probe-tracks-th-details'
} as const

const PROBE_CHAPTERS_TABLE_HEADER_IDS = {
  id: 'probe-chapters-th-id',
  start: 'probe-chapters-th-start',
  end: 'probe-chapters-th-end',
  duration: 'probe-chapters-th-duration',
  title: 'probe-chapters-th-title'
} as const

function formatBitrateLine(kbps: number | null): string | null {
  if (kbps === null || !Number.isFinite(kbps)) {
    return null
  }
  if (kbps >= 10_000) {
    return uiTextVars('probeBitrateMbpsTemplate', { value: (kbps / 1000).toFixed(2) })
  }
  return uiTextVars('probeBitrateKbpsTemplate', { value: String(Math.round(kbps)) })
}

function formatProbeJsonForDisplay(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw) as unknown, null, 2)
  } catch {
    return raw
  }
}

/** Ключи `details` под превью; в главном окне мапятся на `MainWindowUiPanelState` через `App.tsx`. */
export type PreviewProbeSectionKey = 'exportSummary' | 'tracks' | 'chapters' | 'rawJson'

const PREVIEW_PROBE_SECTION_DEFAULTS: Record<PreviewProbeSectionKey, boolean> = {
  exportSummary: false,
  tracks: false,
  chapters: false,
  rawJson: false
}

/** Таблица дорожек, главы и JSON §9 — используется в превью и в отдельном окне инспектора. */
export function PreviewProbeBody({
  probeInfo,
  mediaPathForDefaultSave,
  probeSectionOpen,
  onProbeSectionToggle,
  probeRefreshing = false
}: {
  probeInfo: MediaProbeSuccess
  mediaPathForDefaultSave?: string
  probeSectionOpen?: Partial<Record<PreviewProbeSectionKey, boolean>>
  onProbeSectionToggle?: (key: PreviewProbeSectionKey, open: boolean) => void
  /** Текущее обновление ffprobe выбранного файла (инспектор / будущие встраивания). */
  probeRefreshing?: boolean
}): JSX.Element {
  const persistedProbeSections = typeof onProbeSectionToggle === 'function'
  const [localProbeSections, setLocalProbeSections] = useState(PREVIEW_PROBE_SECTION_DEFAULTS)

  function sectionOpen(key: PreviewProbeSectionKey): boolean {
    if (persistedProbeSections) {
      const v = probeSectionOpen?.[key]
      return typeof v === 'boolean' ? v : PREVIEW_PROBE_SECTION_DEFAULTS[key]
    }
    return localProbeSections[key]
  }

  function persistOrLocalSectionToggle(key: PreviewProbeSectionKey, open: boolean): void {
    if (persistedProbeSections && onProbeSectionToggle) {
      onProbeSectionToggle(key, open)
    } else {
      setLocalProbeSections((prev) => ({ ...prev, [key]: open }))
    }
  }

  const dash = uiText('uiPlaceholderDash')

  function trackKindLabel(kind: MediaProbeTrackRow['kind']): string {
    switch (kind) {
      case 'video':
        return uiText('probeTrackKindVideo')
      case 'audio':
        return uiText('probeTrackKindAudio')
      case 'subtitle':
        return uiText('probeTrackKindSubtitle')
      case 'attachment':
        return uiText('probeTrackKindAttachment')
      case 'data':
        return uiText('probeTrackKindData')
      default:
        return uiText('probeTrackKindOther')
    }
  }

  function formatProbeDuration(sec: number | null): string {
    if (sec === null || !Number.isFinite(sec)) {
      return uiText('probeDurationUnknown')
    }
    if (sec < 60) {
      return uiTextVars('probeDurationSecShort', { sec: sec.toFixed(1) })
    }
    const s = Math.floor(sec)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const r = s % 60
    if (h > 0) {
      const clock = `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
      return uiTextVars('probeDurationClockApprox', { clock, total: Math.round(sec) })
    }
    const clock = `${m}:${String(r).padStart(2, '0')}`
    return uiTextVars('probeDurationClockApprox', { clock, total: Math.round(sec) })
  }

  function formatChapterDurationSec(endSec: number, startSec: number): string {
    const dur = endSec - startSec
    return Number.isFinite(dur) && dur >= 0
      ? uiTextVars('probeChapterDurationSecTemplate', { dur: dur.toFixed(2) })
      : dash
  }

  function formatProbeTrackRowTsv(row: MediaProbeTrackRow): string {
    const lang = row.language ?? ''
    const title = row.titleTag ?? ''
    const br = formatBitrateLine(row.streamBitrateKbps) ?? ''
    const disp = row.dispositionSummary.replace(/\t/g, ' ')
    const pix = (row.pixelFormat ?? '').replace(/\t/g, ' ')
    const sar = (row.sampleAspectRatio ?? '').replace(/\t/g, ' ')
    const dar = (row.displayAspectRatio ?? '').replace(/\t/g, ' ')
    const cs = (row.colorSpace ?? '').replace(/\t/g, ' ')
    const cprim = (row.colorPrimaries ?? '').replace(/\t/g, ' ')
    const ctr = (row.colorTransfer ?? '').replace(/\t/g, ' ')
    const crng = (row.colorRange ?? '').replace(/\t/g, ' ')
    return `${row.index}\t${trackKindLabel(row.kind)}\t${row.codec}\t${pix}\t${sar}\t${dar}\t${cs}\t${cprim}\t${ctr}\t${crng}\t${br}\t${disp}\t${lang}\t${title}\t${row.detail}`
  }

  function formatProbeChapterRowTsv(ch: MediaProbeChapterRow): string {
    const dur = formatChapterDurationSec(ch.endSec, ch.startSec)
    const title = ch.title ?? ''
    return `${ch.index}\t${formatProbeChapterTimecode(ch.startSec)}\t${formatProbeChapterTimecode(ch.endSec)}\t${dur}\t${title}`
  }

  const probeExportSummaryRegionId = useId()
  const probeTracksRegionId = useId()
  const probeChaptersRegionId = useId()
  const probeRawJsonRegionId = useId()

  const [probeToolbarTip, setProbeToolbarTip] = useState<string | null>(null)
  const [probeTableMenu, setProbeTableMenu] = useState<ProbeTableContextMenu>(null)
  const probeTableMenuRef = useRef<HTMLDivElement | null>(null)
  const bitrateLabel = formatBitrateLine(probeInfo.bitrateKbps)
  const formatTooltip =
    probeInfo.formatLongName && probeInfo.formatName !== probeInfo.formatLongName
      ? probeInfo.formatLongName
      : undefined

  async function handleCopyProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const r = await window.fluxalloy.clipboard.writeText(text)
    setProbeToolbarTip(r.ok ? uiText('probeClipboardCopied') : uiText('probeClipboardCopyFailed'))
    window.setTimeout(() => {
      setProbeToolbarTip(null)
    }, 2200)
  }

  async function handleSaveProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const defaultFileName = defaultFfprobeJsonFileName(mediaPathForDefaultSave)
    const r = await window.fluxalloy.saveTextWithDialog({
      title: uiText('probeSaveJsonDialogTitle'),
      defaultFileName,
      content: text
    })
    if (r.ok) {
      setProbeToolbarTip(uiTextVars('probeSavedPathTemplate', { path: r.path }))
    } else if ('cancelled' in r && r.cancelled) {
      // пользователь закрыл диалог — без сообщения
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => {
      setProbeToolbarTip(null)
    }, 2800)
  }

  async function handleSaveSummaryTxt(): Promise<void> {
    const text = formatProbeSummaryPlainText(probeInfo, getUiLocale())
    const r = await window.fluxalloy.saveTextWithDialog({
      title: uiText('probeSaveSummaryTxtDialogTitle'),
      defaultFileName: defaultFfprobeSummaryTxtFileName(mediaPathForDefaultSave),
      content: text
    })
    if (r.ok) {
      setProbeToolbarTip(uiTextVars('probeSavedPathTemplate', { path: r.path }))
    } else if ('cancelled' in r && r.cancelled) {
      /* noop */
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => setProbeToolbarTip(null), 2800)
  }

  async function handleSaveSummaryHtml(): Promise<void> {
    const html = formatProbeSummaryHtmlDocument(probeInfo, getUiLocale())
    const r = await window.fluxalloy.saveTextWithDialog({
      title: uiText('probeSaveSummaryHtmlDialogTitle'),
      defaultFileName: defaultFfprobeSummaryHtmlFileName(mediaPathForDefaultSave),
      content: html
    })
    if (r.ok) {
      setProbeToolbarTip(uiTextVars('probeSavedPathTemplate', { path: r.path }))
    } else if ('cancelled' in r && r.cancelled) {
      /* noop */
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => setProbeToolbarTip(null), 2800)
  }

  useEffect(() => {
    if (!probeTableMenu) {
      return
    }
    const close = (): void => setProbeTableMenu(null)
    window.setTimeout(() => {
      const first = probeTableMenuRef.current?.querySelector<HTMLButtonElement>('button')
      first?.focus()
    }, 0)
    const onPointerDown = (ev: PointerEvent): void => {
      const root = probeTableMenuRef.current
      if (root && ev.target instanceof Node && root.contains(ev.target)) {
        return
      }
      close()
    }
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKey, true)
    return (): void => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [probeTableMenu])

  async function copyProbeCellAndDismiss(text: string): Promise<void> {
    const r = await window.fluxalloy.clipboard.writeText(text)
    setProbeToolbarTip(r.ok ? uiText('probeClipboardCopied') : uiText('probeClipboardCopyFailed'))
    setProbeTableMenu(null)
    window.setTimeout(() => setProbeToolbarTip(null), 2200)
  }

  return (
    <>
      <div
        className="app-preview-probe-stack"
        role="region"
        aria-label={uiText('probePanelAriaLabel')}
        aria-describedby="probePanelOverviewHint"
        aria-busy={probeRefreshing}
      >
        <p id="probePanelOverviewHint" className="app-visually-hidden">
          {uiText('probePanelOverviewHint')}
        </p>
        <div
          className="app-preview-probe-summary-line"
          role="group"
          aria-label={uiText('probeSummaryReadoutGroupAria')}
          aria-busy={probeRefreshing}
        >
          <span title={formatTooltip}>
            {formatProbeDuration(probeInfo.durationSec)}
            {probeInfo.video
              ? ` · ${probeInfo.video.width}×${probeInfo.video.height} · ${probeInfo.video.codec}`
              : ''}
            {probeInfo.audioCodec
              ? uiTextVars('probeSummaryAudioFragmentTemplate', { codec: probeInfo.audioCodec })
              : ''}
            {probeInfo.formatName ? ` · ${probeInfo.formatName}` : ''}
            {bitrateLabel ? ` · ${bitrateLabel}` : ''}
          </span>
        </div>
        <nav
          className="app-doc-inline-links app-preview-probe-doc-links"
          aria-label={uiText('probeFfprobeDocNavAria')}
          aria-busy={probeRefreshing}
        >
          <a href={FFPROBE_DOC_ALL} target="_blank" rel="noreferrer">
            {uiText('probeFfprobeDocLink')}
          </a>
        </nav>
        {probeToolbarTip ? (
          <div
            className="app-probe-copy-tip app-probe-tip-global"
            role="status"
            aria-live="polite"
            aria-label={uiText('probeToolbarFeedbackAria')}
          >
            {probeToolbarTip}
          </div>
        ) : null}
        <details
          className="app-probe-details"
          aria-label={uiText('probeSectionExportSummary')}
          aria-busy={probeRefreshing}
          open={sectionOpen('exportSummary')}
          onToggle={(e) => {
            persistOrLocalSectionToggle('exportSummary', e.currentTarget.open)
          }}
        >
          <summary
            className="app-probe-summary"
            aria-controls={probeExportSummaryRegionId}
          >
            {uiText('probeSectionExportSummary')}
          </summary>
          <div id={probeExportSummaryRegionId}>
            <p id="probeExportSummaryHint" className="app-probe-toolbar-hint">
              {uiText('probeSectionExportSummaryHint')}
            </p>
            <div className="app-probe-json-toolbar" role="toolbar" aria-orientation="horizontal" aria-label={uiText('probeExportSummaryToolbarAria')} aria-busy={probeRefreshing}>
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
            aria-label={uiTextVars('probeSectionTracksTemplate', { count: probeInfo.tracks.length })}
            aria-busy={probeRefreshing}
            open={sectionOpen('tracks')}
            onToggle={(e) => {
              persistOrLocalSectionToggle('tracks', e.currentTarget.open)
            }}
          >
            <summary
              className="app-probe-summary"
              aria-controls={probeTracksRegionId}
            >
              {uiTextVars('probeSectionTracksTemplate', { count: probeInfo.tracks.length })}
            </summary>
            <div
              id={probeTracksRegionId}
              className="app-probe-table-wrap"
              role="group"
              aria-label={uiText('probeTracksTableWrapGroupAria')}
              aria-busy={probeRefreshing}
            >
              <table className="app-probe-table">
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
                      <td headers={PROBE_TRACKS_TABLE_HEADER_IDS.kind}>{trackKindLabel(row.kind)}</td>
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
                        title={formatBitrateLine(row.streamBitrateKbps) ?? undefined}
                      >
                        {formatBitrateLine(row.streamBitrateKbps) ?? dash}
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
            <summary
              className="app-probe-summary"
              aria-controls={probeChaptersRegionId}
            >
              {uiTextVars('probeSectionChaptersTemplate', { count: probeInfo.chapters.length })}
            </summary>
            <div
              id={probeChaptersRegionId}
              className="app-probe-table-wrap"
              role="group"
              aria-label={uiText('probeChaptersTableWrapGroupAria')}
              aria-busy={probeRefreshing}
            >
              <table className="app-probe-table">
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
                        {formatChapterDurationSec(ch.endSec, ch.startSec)}
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
              <div className="app-probe-json-toolbar" role="toolbar" aria-orientation="horizontal" aria-label={uiText('probeRawJsonToolbarAria')} aria-busy={probeRefreshing}>
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
              >
                {formatProbeJsonForDisplay(probeInfo.rawJson)}
              </pre>
            </div>
          </details>
        ) : null}
      </div>
      {probeTableMenu
        ? createPortal(
            <div
              ref={probeTableMenuRef}
              role="menu"
              aria-label={uiText('probeContextMenuAria')}
              className="app-probe-context-menu"
              style={{ left: probeTableMenu.x, top: probeTableMenu.y }}
            >
              {probeTableMenu.variant === 'track' ? (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(formatProbeTrackRowTsv(probeTableMenu.row))
                    }}
                  >
                    {uiText('probeCtxCopyRowTab')}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(probeTableMenu.row.codec)
                    }}
                  >
                    {uiText('probeCtxCopyCodec')}
                  </button>
                  {probeTableMenu.row.pixelFormat ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.pixelFormat ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyPixFmt')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.sampleAspectRatio ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.sampleAspectRatio ?? '')
                      }}
                    >
                      {uiText('probeCtxCopySar')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.displayAspectRatio ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.displayAspectRatio ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyDar')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorSpace ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorSpace ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyColorSpace')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorPrimaries ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorPrimaries ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyColorPrimaries')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorTransfer ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorTransfer ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyColorTransfer')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorRange ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorRange ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyColorRange')}
                    </button>
                  ) : null}
                  {formatBitrateLine(probeTableMenu.row.streamBitrateKbps) ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(
                          formatBitrateLine(probeTableMenu.row.streamBitrateKbps) ?? ''
                        )
                      }}
                    >
                      {uiText('probeCtxCopyBitrate')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.dispositionSummary.trim() !== '' ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.dispositionSummary)
                      }}
                    >
                      {uiText('probeCtxCopyDisposition')}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(probeTableMenu.row.detail)
                    }}
                  >
                    {uiText('probeCtxCopyDetail')}
                  </button>
                  {probeTableMenu.row.language ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.language ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyLanguage')}
                    </button>
                  ) : null}
                  {probeTableMenu.row.titleTag ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.titleTag ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyTrackTitle')}
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(formatProbeChapterRowTsv(probeTableMenu.row))
                    }}
                  >
                    {uiText('probeCtxCopyRowTab')}
                  </button>
                  {probeTableMenu.row.title ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.title ?? '')
                      }}
                    >
                      {uiText('probeCtxCopyChapterTitle')}
                    </button>
                  ) : null}
                </>
              )}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
