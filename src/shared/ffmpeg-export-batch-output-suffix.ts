/** §7.3 — шаблон имени выходного файла пакетного экспорта (без расширения контейнера). */

export const DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX = '{stem}-export'

const MAX_TEMPLATE_LEN = 120

export type FfmpegExportBatchOutputSuffixParseResult =
  | { ok: true; template: string }
  | { ok: false; error: string }

export function parseFfmpegExportBatchOutputSuffixTemplate(
  raw: unknown
): FfmpegExportBatchOutputSuffixParseResult {
  if (raw === undefined || raw === null) {
    return { ok: true, template: DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX }
  }
  if (typeof raw !== 'string') {
    return { ok: false, error: 'suffix_not_string' }
  }
  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    return { ok: false, error: 'suffix_empty' }
  }
  if (trimmed.length > MAX_TEMPLATE_LEN) {
    return { ok: false, error: 'suffix_too_long' }
  }
  if (/[/\\]/.test(trimmed) || trimmed.includes('..')) {
    return { ok: false, error: 'suffix_path_chars' }
  }
  if (!/^[\w{}\-_.]+$/.test(trimmed)) {
    return { ok: false, error: 'suffix_invalid_chars' }
  }
  if (!trimmed.includes('{stem}') && !trimmed.includes('{name}')) {
    return { ok: false, error: 'suffix_need_stem_or_name' }
  }
  return { ok: true, template: trimmed }
}

export function buildFfmpegExportBatchOutputBasename(
  inputAbsolutePath: string,
  template: string
): string {
  const file = inputAbsolutePath.replace(/\\/g, '/').split('/').pop() ?? 'output'
  const stem = file.replace(/\.[^.]+$/, '')
  const extMatch = /\.([^.]+)$/.exec(file)
  const ext = extMatch?.[1] ?? ''
  return template
    .replace(/\{stem\}/g, stem)
    .replace(/\{name\}/g, file)
    .replace(/\{ext\}/g, ext)
}
