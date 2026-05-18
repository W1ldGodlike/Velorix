import type { MediaProbeSuccess, MediaProbeTrackRow } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  ffprobeSummaryFill,
  ffprobeSummaryStrings,
  formatFfprobeBitrateLabelFromKbps
} from './ffprobe-summary-export-locale'
import { formatProbeChapterTimecode } from './ffprobe-timecode'
import {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerBitRateExportLine,
  formatFfprobeContainerDiagnosticsExportLine
} from './ffprobe-container-format'
import { collectFfprobeFormatScalarTagExportLines } from './ffprobe-format-tag-registry'

export type { FfprobeSummaryLocale } from './ffprobe-summary-export-locale'

/** Общий stem для имён файлов экспорта ffprobe; без пути — префикс `fluxalloy`. */
function stemFromMediaPath(mediaPath: string | undefined): string {
  if (!mediaPath || mediaPath.trim().length === 0) {
    return 'fluxalloy'
  }
  const name = mediaPath.replace(/^.*[/\\]/, '').trim()
  const cut = name.replace(/\.[^./\\]+$/, '')
  const base = cut.length > 0 ? cut : name
  return base.length > 0 ? base : 'media'
}

export function defaultFfprobeJsonFileName(mediaPath: string | undefined): string {
  if (!mediaPath || mediaPath.trim().length === 0) {
    return 'fluxalloy-ffprobe.json'
  }
  return `${stemFromMediaPath(mediaPath)}-ffprobe.json`
}

export function defaultFfprobeSummaryTxtFileName(mediaPath: string | undefined): string {
  if (!mediaPath || mediaPath.trim().length === 0) {
    return 'fluxalloy-ffprobe-summary.txt'
  }
  return `${stemFromMediaPath(mediaPath)}-ffprobe-summary.txt`
}

export function defaultFfprobeSummaryHtmlFileName(mediaPath: string | undefined): string {
  if (!mediaPath || mediaPath.trim().length === 0) {
    return 'fluxalloy-ffprobe-summary.html'
  }
  return `${stemFromMediaPath(mediaPath)}-ffprobe-summary.html`
}

function trackKindLabel(
  kind: MediaProbeTrackRow['kind'],
  b: ReturnType<typeof ffprobeSummaryStrings>
): string {
  switch (kind) {
    case 'video':
      return b.trackKindVideo
    case 'audio':
      return b.trackKindAudio
    case 'subtitle':
      return b.trackKindSubtitle
    case 'attachment':
      return b.trackKindAttachment
    case 'data':
      return b.trackKindData
    default:
      return b.trackKindOther
  }
}

function formatProbeDurationLine(
  sec: number | null,
  b: ReturnType<typeof ffprobeSummaryStrings>
): string {
  if (sec === null || !Number.isFinite(sec)) {
    return b.durationUnknown
  }
  if (sec < 60) {
    return `${sec.toFixed(1)}${b.numSecSuffix}`
  }
  const s = Math.floor(sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const clock =
    h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
      : `${m}:${String(r).padStart(2, '0')}`
  return `${clock} (${Math.round(sec)}${b.numSecSuffix})`
}

/** §9 — приблизительный FPS для текстовой/HTML сводки. */
function formatVideoFpsApproxForSummary(
  fps: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (fps === null || !Number.isFinite(fps) || fps <= 0 || fps >= 1000) {
    return null
  }
  const core = fps >= 100 ? fps.toFixed(0) : Number.isInteger(fps) ? String(fps) : fps.toFixed(3)
  const b = ffprobeSummaryStrings(locale)
  return ffprobeSummaryFill(b.fpsApproxValueTemplate, { value: core })
}

function formatChapterDurationSec(
  endSec: number,
  startSec: number,
  b: ReturnType<typeof ffprobeSummaryStrings>
): string {
  const dur = endSec - startSec
  return Number.isFinite(dur) && dur >= 0 ? `${dur.toFixed(2)}${b.numSecSuffix}` : b.dash
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** §9 — человекочитаемая сводка для сохранения в .txt (UTF-8 в main). */
export function formatProbeSummaryPlainText(
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale = 'ru'
): string {
  const b = ffprobeSummaryStrings(locale)
  const bitrateLabel = formatFfprobeBitrateLabelFromKbps(info.bitrateKbps, locale)
  const containerBitrateInDiagnostics =
    formatFfprobeContainerBitRateExportLine(info.bitrateKbps, locale) !== null
  const fpsSummary =
    info.video !== null ? formatVideoFpsApproxForSummary(info.videoFpsApprox, locale) : null
  const lines: string[] = [
    b.plainDocTitle,
    b.plainDivider,
    '',
    `${b.durationPrefix}: ${formatProbeDurationLine(info.durationSec, b)}`,
    info.video
      ? `${b.videoLabel}: ${info.video.width}×${info.video.height}${b.videoCodecInfix}${info.video.codec}`
      : b.videoNone,
    fpsSummary ? `${b.fpsApproxPrefix}${fpsSummary}` : null,
    info.audioCodec ? `${b.audioCodecPrefix}${info.audioCodec}` : b.audioNone,
    info.formatName ? `${b.formatPrefix}${info.formatName}` : b.formatUnknown,
    info.formatLongName && info.formatLongName !== info.formatName
      ? `${b.formatLongPrefix}${info.formatLongName}`
      : null,
    bitrateLabel && !containerBitrateInDiagnostics ? `${b.bitrateEstPrefix}${bitrateLabel}` : null,
    formatFfprobeContainerBrandExportLine(
      info.containerMajorBrand,
      info.containerCompatibleBrands,
      locale
    ),
    formatFfprobeContainerCreationTimeExportLine(info.containerCreationTime, locale),
    ...collectFfprobeFormatScalarTagExportLines(info, locale),
    formatFfprobeContainerDiagnosticsExportLine(info, locale),
    '',
    ffprobeSummaryFill(b.streamsCountTemplate, { count: info.tracks.length }),
    ''
  ].filter((x): x is string => x !== null)

  if (info.tracks.length > 0) {
    lines.push(b.txtTrackTableHeader, '-'.repeat(120))
    for (const row of info.tracks) {
      const lang = row.language ?? ''
      const title = row.titleTag ?? ''
      const br = formatFfprobeBitrateLabelFromKbps(row.streamBitrateKbps, locale) ?? ''
      const disp = row.dispositionSummary.replace(/\t/g, ' ')
      const pix = (row.pixelFormat ?? '').replace(/\t/g, ' ')
      const sar = (row.sampleAspectRatio ?? '').replace(/\t/g, ' ')
      const dar = (row.displayAspectRatio ?? '').replace(/\t/g, ' ')
      const cs = (row.colorSpace ?? '').replace(/\t/g, ' ')
      const cprim = (row.colorPrimaries ?? '').replace(/\t/g, ' ')
      const ctr = (row.colorTransfer ?? '').replace(/\t/g, ' ')
      const crng = (row.colorRange ?? '').replace(/\t/g, ' ')
      lines.push(
        `${row.index}\t${trackKindLabel(row.kind, b)}\t${row.codec}\t${pix}\t${sar}\t${dar}\t${cs}\t${cprim}\t${ctr}\t${crng}\t${br}\t${disp}\t${lang.replace(/\t/g, ' ')}\t${title.replace(/\t/g, ' ')}\t${row.detail.replace(/\r?\n/g, ' ')}`
      )
    }
  }

  if (info.chapters.length > 0) {
    lines.push('', ffprobeSummaryFill(b.chaptersCountTemplate, { count: info.chapters.length }), '')
    lines.push(b.chapterTableHeaderTxt, '-'.repeat(64))
    for (const ch of info.chapters) {
      lines.push(
        `${ch.index}\t${formatProbeChapterTimecode(ch.startSec)}\t${formatProbeChapterTimecode(ch.endSec)}\t${formatChapterDurationSec(ch.endSec, ch.startSec, b)}\t${(ch.title ?? '').replace(/\t/g, ' ')}`
      )
    }
  }

  lines.push('', b.plainFooter)
  return lines.join('\n')
}

/** §9 — простой HTML-документ со таблицей дорожек (сохранение через main). */
export function formatProbeSummaryHtmlDocument(
  info: MediaProbeSuccess,
  locale: FfprobeSummaryLocale = 'ru'
): string {
  const b = ffprobeSummaryStrings(locale)
  const bitrateLabel = formatFfprobeBitrateLabelFromKbps(info.bitrateKbps, locale)
  const containerBitrateInDiagnostics =
    formatFfprobeContainerBitRateExportLine(info.bitrateKbps, locale) !== null
  const rows = info.tracks
    .map(
      (row) =>
        `<tr><td>${row.index}</td><td>${escapeHtml(trackKindLabel(row.kind, b))}</td><td class="mono">${escapeHtml(row.codec)}</td><td class="mono">${escapeHtml(row.pixelFormat ?? b.dash)}</td><td class="mono">${escapeHtml(row.sampleAspectRatio ?? b.dash)}</td><td class="mono">${escapeHtml(row.displayAspectRatio ?? b.dash)}</td><td class="mono">${escapeHtml(row.colorSpace ?? b.dash)}</td><td class="mono">${escapeHtml(row.colorPrimaries ?? b.dash)}</td><td class="mono">${escapeHtml(row.colorTransfer ?? b.dash)}</td><td class="mono">${escapeHtml(row.colorRange ?? b.dash)}</td><td class="mono">${escapeHtml(formatFfprobeBitrateLabelFromKbps(row.streamBitrateKbps, locale) ?? b.dash)}</td><td>${escapeHtml(row.dispositionSummary.trim() !== '' ? row.dispositionSummary : b.dash)}</td><td>${escapeHtml(row.language ?? b.dash)}</td><td>${escapeHtml(row.titleTag ?? b.dash)}</td><td>${escapeHtml(row.detail)}</td></tr>`
    )
    .join('\n')

  const chapterRows = info.chapters
    .map((ch) => {
      return `<tr><td>${ch.index}</td><td class="mono">${escapeHtml(formatProbeChapterTimecode(ch.startSec))}</td><td class="mono">${escapeHtml(formatProbeChapterTimecode(ch.endSec))}</td><td class="mono">${escapeHtml(formatChapterDurationSec(ch.endSec, ch.startSec, b))}</td><td>${escapeHtml(ch.title ?? b.dash)}</td></tr>`
    })
    .join('\n')

  const chaptersSection =
    info.chapters.length > 0
      ? `<h2>${ffprobeSummaryFill(b.htmlChaptersH2Template, { count: info.chapters.length })}</h2>
  <table>
    ${b.htmlChapterTheadRow}
    <tbody>
${chapterRows}
    </tbody>
  </table>`
      : ''

  const fpsSummary =
    info.video !== null ? formatVideoFpsApproxForSummary(info.videoFpsApprox, locale) : null
  const metaParts = [
    `<li>${b.durationPrefix}: ${escapeHtml(formatProbeDurationLine(info.durationSec, b))}</li>`,
    info.video
      ? `<li>${b.videoLabel}: ${info.video.width}×${info.video.height}, ${escapeHtml(info.video.codec)}</li>`
      : `<li>${b.videoNone}</li>`,
    fpsSummary ? `<li>${b.fpsApproxPrefix}${escapeHtml(fpsSummary)}</li>` : '',
    info.audioCodec
      ? `<li>${b.audioCodecPrefix}${escapeHtml(info.audioCodec)}</li>`
      : `<li>${b.audioNone}</li>`,
    info.formatName ? `<li>${b.formatPrefix}${escapeHtml(info.formatName)}</li>` : '',
    info.formatLongName && info.formatLongName !== info.formatName
      ? `<li>${b.formatLongPrefix}${escapeHtml(info.formatLongName)}</li>`
      : '',
    (() => {
      const brand = formatFfprobeContainerBrandExportLine(
        info.containerMajorBrand,
        info.containerCompatibleBrands,
        locale
      )
      return brand ? `<li>${escapeHtml(brand)}</li>` : ''
    })(),
    (() => {
      const ct = formatFfprobeContainerCreationTimeExportLine(info.containerCreationTime, locale)
      return ct ? `<li>${escapeHtml(ct)}</li>` : ''
    })(),
    ...collectFfprobeFormatScalarTagExportLines(info, locale).map(
      (line) => `<li>${escapeHtml(line)}</li>`
    ),
    (() => {
      const diag = formatFfprobeContainerDiagnosticsExportLine(info, locale)
      return diag ? `<li>${escapeHtml(diag)}</li>` : ''
    })(),
    bitrateLabel && !containerBitrateInDiagnostics
      ? `<li>${b.bitratePlainPrefix}${escapeHtml(bitrateLabel)}</li>`
      : ''
  ].filter(Boolean)

  return `<!DOCTYPE html>
<html lang="${b.htmlLang}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(b.htmlTitle)}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1rem 1.25rem; color: #111; }
    h1 { font-size: 1.1rem; }
    ul { margin: 0.5rem 0 1rem 1rem; }
    table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }
    th, td { border: 1px solid #ccc; padding: 0.35rem 0.5rem; text-align: left; vertical-align: top; }
    th { background: #f0f0f0; }
    .mono { font-family: ui-monospace, monospace; }
    footer { margin-top: 1rem; font-size: 0.75rem; color: #555; }
  </style>
</head>
<body>
  <h1>${escapeHtml(b.htmlH1)}</h1>
  <ul>
${metaParts.join('\n')}
  </ul>
  <h2>${escapeHtml(ffprobeSummaryFill(b.htmlTracksH2Template, { count: info.tracks.length }))}</h2>
  <table>
    ${b.htmlTrackTheadRow}
    <tbody>
${rows || b.htmlNoTracksRow}
    </tbody>
  </table>
${chaptersSection}
  <footer>${escapeHtml(b.htmlFooter)}</footer>
</body>
</html>
`
}
