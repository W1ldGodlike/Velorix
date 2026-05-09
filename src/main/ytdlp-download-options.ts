import { join, normalize, relative, resolve, sep } from 'path'

import type { AppSettings } from './settings-store'

/** Шаблон по умолчанию совпадает с тем, что раньше был захардкожен в `runYtdlpOnce`. */
export const YTDLP_DEFAULT_FILENAME_TEMPLATE = '%(title)s [%(id)s].%(ext)s'

/**
 * Упрощённый выбор «качества» без произвольного `-f` от пользователя (иначе легко сломать
 * кавычками и порядком аргументов); только белый список пар§вметров §6.2.
 */
export type YtdlpFormatPresetId = 'default' | 'merge_bv_ba' | 'best_single'

export interface YtdlpRunOptionsSnapshot {
  filenameTemplate: string
  formatPreset: YtdlpFormatPresetId
  /** Дополнительные аргументы yt-dlp перед `-o` (уже разобранные токены, без shell). */
  formatExtraArgs: string[]
}

/** То, что видит окно загрузок: текущие значения и метки для `<select>`. */
export interface YtdlpDownloadOptionsPayload {
  filenameTemplate: string
  defaultFilenameTemplate: string
  formatPreset: YtdlpFormatPresetId
  formatPresetChoices: Array<{ id: YtdlpFormatPresetId; label: string }>
}

export interface YtdlpDownloadOptionsPatch {
  filenameTemplate?: string
  formatPreset?: YtdlpFormatPresetId
}

export function parseYtdlpFormatPreset(raw: unknown): YtdlpFormatPresetId {
  if (raw === 'merge_bv_ba' || raw === 'best_single' || raw === 'default') {
    return raw
  }
  return 'default'
}

/** Строковые поля из JSON без семантической проверки шаблона — см. validateFilenameTemplate. */
export function parseYtdlpFilenameTemplateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0) {
    return undefined
  }
  return t.length <= 480 ? t : t.slice(0, 480)
}

function hasParentDirSegment(template: string): boolean {
  return template.split(/[/\\]/).some((seg) => seg === '..')
}

function forbiddenTrajectory(template: string): boolean {
  if (hasParentDirSegment(template)) {
    return true
  }
  if (/[\r\n\0]/.test(template)) {
    return true
  }
  if (/^[a-zA-Z]:[\\/]/.test(template)) {
    return true
  }
  if (template.startsWith('/') || template.startsWith('\\')) {
    return true
  }
  return false
}

/** `-o` только под каталог вывода: путь не должен «выходить» из outputDir после resolve. */
export function resolveSafeYtdlpOutputPattern(outputDir: string, template: string): string | null {
  const t = template.trim()
  if (t.length === 0 || t.length > 480) {
    return null
  }
  if (forbiddenTrajectory(t)) {
    return null
  }
  if (!t.includes('%(ext)s')) {
    return null
  }
  const root = resolve(outputDir)
  const segments = t.split(/[/\\]/).filter((s) => s.length > 0)
  const joined = segments.length === 0 ? root : resolve(normalize(join(outputDir, ...segments)))
  const rel = relative(root, joined)
  if (rel.startsWith('..') || rel.includes(`..${sep}`)) {
    return null
  }
  return joined
}

export function validateFilenameTemplate(
  template: string
): { ok: true; value: string } | { ok: false; error: string } {
  const t = template.trim()
  if (t.length === 0) {
    return { ok: false, error: 'Шаблон имени не может быть пустым.' }
  }
  if (t.length > 480) {
    return { ok: false, error: 'Шаблон слишком длинный (макс. 480 символов).' }
  }
  if (forbiddenTrajectory(t)) {
    return {
      ok: false,
      error: 'Недопустимые символы или попытка выхода из каталога (.., абсолютный путь).'
    }
  }
  if (!t.includes('%(ext)s')) {
    return {
      ok: false,
      error: 'Шаблон должен содержать %(ext)s — иначе yt-dlp не сможет подставить расширение.'
    }
  }
  return { ok: true, value: t }
}

export function formatPresetToExtraArgs(id: YtdlpFormatPresetId): string[] {
  if (id === 'merge_bv_ba') {
    return ['-f', 'bv*+ba/b']
  }
  if (id === 'best_single') {
    return ['-f', 'best']
  }
  return []
}

export function buildYtdlpRunOptionsSnapshot(settings: AppSettings): YtdlpRunOptionsSnapshot {
  const preset = parseYtdlpFormatPreset(settings.ytdlpFormatPreset)
  const stored = settings.ytdlpFilenameTemplate
  let filenameTemplate = YTDLP_DEFAULT_FILENAME_TEMPLATE
  if (typeof stored === 'string') {
    const vt = validateFilenameTemplate(stored)
    if (vt.ok) {
      filenameTemplate = vt.value
    }
  }
  return {
    filenameTemplate,
    formatPreset: preset,
    formatExtraArgs: formatPresetToExtraArgs(preset)
  }
}

export function payloadFromSnapshot(snap: YtdlpRunOptionsSnapshot): YtdlpDownloadOptionsPayload {
  return {
    filenameTemplate: snap.filenameTemplate,
    defaultFilenameTemplate: YTDLP_DEFAULT_FILENAME_TEMPLATE,
    formatPreset: snap.formatPreset,
    formatPresetChoices: [
      { id: 'default', label: 'По умолчанию (yt-dlp)' },
      { id: 'merge_bv_ba', label: 'Лучшее видео + аудио (слить)' },
      { id: 'best_single', label: 'Лучший один файл (-f best)' }
    ]
  }
}
