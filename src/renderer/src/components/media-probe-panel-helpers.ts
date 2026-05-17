import type { MediaProbeChapterRow, MediaProbeTrackRow } from '../../../shared/ffprobe-contract'
import { formatProbeChapterTimecode } from '../../../shared/ffprobe-timecode'
import { uiText, uiTextVars } from '../locales/ui-text'

export type ProbeTableContextMenu =
  | null
  | { variant: 'track'; x: number; y: number; row: MediaProbeTrackRow }
  | { variant: 'chapter'; x: number; y: number; row: MediaProbeChapterRow }

export function clampProbeTableMenuPosition(
  clientX: number,
  clientY: number
): { x: number; y: number } {
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

export function keyboardProbeMenuPosition(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return clampProbeTableMenuPosition(rect.left + 24, rect.top + 24)
}

export const PROBE_TRACKS_TABLE_HEADER_IDS = {
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

export const PROBE_CHAPTERS_TABLE_HEADER_IDS = {
  id: 'probe-chapters-th-id',
  start: 'probe-chapters-th-start',
  end: 'probe-chapters-th-end',
  duration: 'probe-chapters-th-duration',
  title: 'probe-chapters-th-title'
} as const

export function formatProbeBitrateLine(kbps: number | null): string | null {
  if (kbps === null || !Number.isFinite(kbps)) {
    return null
  }
  if (kbps >= 10_000) {
    return uiTextVars('probeBitrateMbpsTemplate', { value: (kbps / 1000).toFixed(2) })
  }
  return uiTextVars('probeBitrateKbpsTemplate', { value: String(Math.round(kbps)) })
}

export function formatProbeJsonForDisplay(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw) as unknown, null, 2)
  } catch {
    return raw
  }
}

/** Ключи `details` под превью; в главном окне мапятся на `MainWindowUiPanelState` через `App.tsx`. */
export type PreviewProbeSectionKey = 'exportSummary' | 'tracks' | 'chapters' | 'rawJson'

export const PREVIEW_PROBE_SECTION_DEFAULTS: Record<PreviewProbeSectionKey, boolean> = {
  exportSummary: false,
  tracks: false,
  chapters: false,
  rawJson: false
}

export function probeTrackKindLabel(kind: MediaProbeTrackRow['kind']): string {
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

export function formatProbeDurationLabel(sec: number | null): string {
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

export function formatProbeChapterDurationSec(
  endSec: number,
  startSec: number,
  dash: string
): string {
  const dur = endSec - startSec
  return Number.isFinite(dur) && dur >= 0
    ? uiTextVars('probeChapterDurationSecTemplate', { dur: dur.toFixed(2) })
    : dash
}

export function formatProbeTrackRowTsv(row: MediaProbeTrackRow): string {
  const lang = row.language ?? ''
  const title = row.titleTag ?? ''
  const br = formatProbeBitrateLine(row.streamBitrateKbps) ?? ''
  const disp = row.dispositionSummary.replace(/\t/g, ' ')
  const pix = (row.pixelFormat ?? '').replace(/\t/g, ' ')
  const sar = (row.sampleAspectRatio ?? '').replace(/\t/g, ' ')
  const dar = (row.displayAspectRatio ?? '').replace(/\t/g, ' ')
  const cs = (row.colorSpace ?? '').replace(/\t/g, ' ')
  const cprim = (row.colorPrimaries ?? '').replace(/\t/g, ' ')
  const ctr = (row.colorTransfer ?? '').replace(/\t/g, ' ')
  const crng = (row.colorRange ?? '').replace(/\t/g, ' ')
  return `${row.index}\t${probeTrackKindLabel(row.kind)}\t${row.codec}\t${pix}\t${sar}\t${dar}\t${cs}\t${cprim}\t${ctr}\t${crng}\t${br}\t${disp}\t${lang}\t${title}\t${row.detail}`
}

export function formatProbeChapterRowTsv(ch: MediaProbeChapterRow): string {
  const dur = formatProbeChapterDurationSec(ch.endSec, ch.startSec, uiText('uiPlaceholderDash'))
  const title = ch.title ?? ''
  return `${ch.index}\t${formatProbeChapterTimecode(ch.startSec)}\t${formatProbeChapterTimecode(ch.endSec)}\t${dur}\t${title}`
}
