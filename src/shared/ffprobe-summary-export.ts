import type { MediaProbeSuccess, MediaProbeTrackRow } from './ffprobe-contract'

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
    lines.push('#\tТип\tКодек\tСведения', '-'.repeat(64))
    for (const row of info.tracks) {
      lines.push(
        `${row.index}\t${trackKindRu(row.kind)}\t${row.codec}\t${row.detail.replace(/\r?\n/g, ' ')}`
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
        `<tr><td>${row.index}</td><td>${escapeHtml(trackKindRu(row.kind))}</td><td class="mono">${escapeHtml(row.codec)}</td><td>${escapeHtml(row.detail)}</td></tr>`
    )
    .join('\n')

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
    <thead><tr><th>#</th><th>Тип</th><th>Кодек</th><th>Сведения</th></tr></thead>
    <tbody>
${rows || '<tr><td colspan="4">Нет дорожек</td></tr>'}
    </tbody>
  </table>
  <footer>FluxAlloy §9</footer>
</body>
</html>
`
}
