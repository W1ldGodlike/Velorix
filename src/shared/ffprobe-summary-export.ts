import type { MediaProbeSuccess, MediaProbeTrackRow } from './ffprobe-contract'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

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

function trackKindRu(kind: MediaProbeTrackRow['kind']): string {
  switch (kind) {
    case 'video':
      return 'Видео'
    case 'audio':
      return 'Аудио'
    case 'subtitle':
      return 'Субтитры'
    case 'attachment':
      return 'Вложение'
    case 'data':
      return 'Данные'
    default:
      return 'Прочее'
  }
}

function formatProbeDurationLine(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec)) {
    return 'длительность ?'
  }
  if (sec < 60) {
    return `${sec.toFixed(1)} с`
  }
  const s = Math.floor(sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')} (${Math.round(sec)} с)`
  }
  return `${m}:${String(r).padStart(2, '0')} (${Math.round(sec)} с)`
}

function formatBitrateLine(kbps: number | null): string | null {
  if (kbps === null || !Number.isFinite(kbps)) {
    return null
  }
  if (kbps >= 10_000) {
    return `${(kbps / 1000).toFixed(2)} Mb/s`
  }
  return `${Math.round(kbps)} kb/s`
}

function formatChapterDurationSec(endSec: number, startSec: number): string {
  const dur = endSec - startSec
  return Number.isFinite(dur) && dur >= 0 ? `${dur.toFixed(2)} с` : '—'
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** §9 — человекочитаемая сводка для сохранения в .txt (UTF-8 в main). */
export function formatProbeSummaryPlainText(info: MediaProbeSuccess): string {
  const bitrateLabel = formatBitrateLine(info.bitrateKbps)
  const lines: string[] = [
    'FluxAlloy — сводка ffprobe',
    '========================',
    '',
    `Длительность: ${formatProbeDurationLine(info.durationSec)}`,
    info.video
      ? `Видео: ${info.video.width}×${info.video.height}, кодек ${info.video.codec}`
      : 'Видео: нет',
    info.audioCodec ? `Аудио: кодек ${info.audioCodec}` : 'Аудио: нет',
    info.formatName ? `Формат: ${info.formatName}` : 'Формат: ?',
    info.formatLongName && info.formatLongName !== info.formatName
      ? `Описание формата: ${info.formatLongName}`
      : null,
    bitrateLabel ? `Битрейт (оценка): ${bitrateLabel}` : null,
    '',
    `Дорожек: ${info.tracks.length}`,
    ''
  ].filter((x): x is string => x !== null)

  if (info.tracks.length > 0) {
    lines.push(
      '#\tТип\tКодек\tPix_fmt\tSAR\tDAR\tЦв.простран.\tPrimaries\tTransfer\tДиапазон\tБитрейт\tDisposition\tЯзык\tЗаголовок\tСведения',
      '-'.repeat(120)
    )
    for (const row of info.tracks) {
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
      lines.push(
        `${row.index}\t${trackKindRu(row.kind)}\t${row.codec}\t${pix}\t${sar}\t${dar}\t${cs}\t${cprim}\t${ctr}\t${crng}\t${br}\t${disp}\t${lang.replace(/\t/g, ' ')}\t${title.replace(/\t/g, ' ')}\t${row.detail.replace(/\r?\n/g, ' ')}`
      )
    }
  }

  if (info.chapters.length > 0) {
    lines.push('', `Главы: ${info.chapters.length}`, '')
    lines.push('id\tНачало\tКонец\tДлит.\tЗаголовок', '-'.repeat(64))
    for (const ch of info.chapters) {
      lines.push(
        `${ch.index}\t${formatProbeChapterTimecode(ch.startSec)}\t${formatProbeChapterTimecode(ch.endSec)}\t${formatChapterDurationSec(ch.endSec, ch.startSec)}\t${(ch.title ?? '').replace(/\t/g, ' ')}`
      )
    }
  }

  lines.push('', '— FluxAlloy §9')
  return lines.join('\n')
}

/** §9 — простой HTML-документ со таблицей дорожек (сохранение через main). */
export function formatProbeSummaryHtmlDocument(info: MediaProbeSuccess): string {
  const bitrateLabel = formatBitrateLine(info.bitrateKbps)
  const rows = info.tracks
    .map(
      (row) =>
        `<tr><td>${row.index}</td><td>${escapeHtml(trackKindRu(row.kind))}</td><td class="mono">${escapeHtml(row.codec)}</td><td class="mono">${escapeHtml(row.pixelFormat ?? '—')}</td><td class="mono">${escapeHtml(row.sampleAspectRatio ?? '—')}</td><td class="mono">${escapeHtml(row.displayAspectRatio ?? '—')}</td><td class="mono">${escapeHtml(row.colorSpace ?? '—')}</td><td class="mono">${escapeHtml(row.colorPrimaries ?? '—')}</td><td class="mono">${escapeHtml(row.colorTransfer ?? '—')}</td><td class="mono">${escapeHtml(row.colorRange ?? '—')}</td><td class="mono">${escapeHtml(formatBitrateLine(row.streamBitrateKbps) ?? '—')}</td><td>${escapeHtml(row.dispositionSummary.trim() !== '' ? row.dispositionSummary : '—')}</td><td>${escapeHtml(row.language ?? '—')}</td><td>${escapeHtml(row.titleTag ?? '—')}</td><td>${escapeHtml(row.detail)}</td></tr>`
    )
    .join('\n')

  const chapterRows = info.chapters
    .map((ch) => {
      return `<tr><td>${ch.index}</td><td class="mono">${escapeHtml(formatProbeChapterTimecode(ch.startSec))}</td><td class="mono">${escapeHtml(formatProbeChapterTimecode(ch.endSec))}</td><td class="mono">${escapeHtml(formatChapterDurationSec(ch.endSec, ch.startSec))}</td><td>${escapeHtml(ch.title ?? '—')}</td></tr>`
    })
    .join('\n')

  const chaptersSection =
    info.chapters.length > 0
      ? `<h2>Главы (${info.chapters.length})</h2>
  <table>
    <thead><tr><th>id</th><th>Начало</th><th>Конец</th><th>Длительность</th><th>Заголовок</th></tr></thead>
    <tbody>
${chapterRows}
    </tbody>
  </table>`
      : ''

  const metaParts = [
    `<li>Длительность: ${escapeHtml(formatProbeDurationLine(info.durationSec))}</li>`,
    info.video
      ? `<li>Видео: ${info.video.width}×${info.video.height}, ${escapeHtml(info.video.codec)}</li>`
      : '<li>Видео: нет</li>',
    info.audioCodec ? `<li>Аудио: ${escapeHtml(info.audioCodec)}</li>` : '<li>Аудио: нет</li>',
    info.formatName ? `<li>Формат: ${escapeHtml(info.formatName)}</li>` : '',
    info.formatLongName && info.formatLongName !== info.formatName
      ? `<li>${escapeHtml(info.formatLongName)}</li>`
      : '',
    bitrateLabel ? `<li>Битрейт: ${escapeHtml(bitrateLabel)}</li>` : ''
  ].filter(Boolean)

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>FluxAlloy — сводка ffprobe</title>
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
  <h1>Сводка ffprobe</h1>
  <ul>
${metaParts.join('\n')}
  </ul>
  <h2>Дорожки (${info.tracks.length})</h2>
  <table>
    <thead><tr><th>#</th><th>Тип</th><th>Кодек</th><th>Pix_fmt</th><th>SAR</th><th>DAR</th><th>Цв.простран.</th><th>Primaries</th><th>Transfer</th><th>Диапазон</th><th>Битрейт</th><th>Disposition</th><th>Язык</th><th>Заголовок</th><th>Сведения</th></tr></thead>
    <tbody>
${rows || '<tr><td colspan="15">Нет дорожек</td></tr>'}
    </tbody>
  </table>
${chaptersSection}
  <footer>FluxAlloy §9</footer>
</body>
</html>
`
}
