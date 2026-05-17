import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize, relative, resolve, sep } from 'path'

import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
/** Проверка перед сохранением пути и после диалога выбора файла §6.2. */
export function validateYtdlpCookiesFilePath(
  raw: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; path: string } | { ok: false; error: string } {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: false, error: V.cookiesPickerPathEmpty }
  }
  if (t.length > 4096) {
    return { ok: false, error: V.cookiesPickerPathTooLong }
  }
  const n = normalize(t)
  if (!isAbsolute(n)) {
    return { ok: false, error: V.cookiesPickerNeedAbsolute }
  }
  if (!existsSync(n)) {
    return { ok: false, error: V.cookiesPickerFileNotFound }
  }
  try {
    if (!statSync(n).isFile()) {
      return { ok: false, error: V.cookiesPickerNotAFile }
    }
  } catch {
    return { ok: false, error: V.cookiesPickerReadFailed }
  }
  return { ok: true, path: n }
}

/** Одна строка без пробелов — станет вторым токеном после `--sub-langs`. */
export function validateYtdlpSubLangs(
  raw: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; value: string } | { ok: false; error: string } {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: '' }
  }
  if (t.length > 160) {
    return { ok: false, error: V.subLangsTooLong }
  }
  if (!/^[a-zA-Z0-9.,*+\-_]+$/.test(t)) {
    return {
      ok: false,
      error: V.subLangsInvalidCharset
    }
  }
  return { ok: true, value: t }
}

export function validateYtdlpRateLimit(
  raw: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; value: string } | { ok: false; error: string } {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: '' }
  }
  if (t.length > 16) {
    return { ok: false, error: V.rateLimitTooLong }
  }
  if (!/^\d+(?:\.\d+)?[KMG]?$/i.test(t)) {
    return {
      ok: false,
      error: V.rateLimitInvalidFormat
    }
  }
  return { ok: true, value: t.toUpperCase() }
}

export function validateYtdlpRetriesLine(
  raw: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; value: number | null; line: string } | { ok: false; error: string } {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: null, line: '' }
  }
  if (!/^\d+$/.test(t)) {
    return { ok: false, error: V.retriesMustBeInteger99 }
  }
  const n = Number(t)
  if (!Number.isInteger(n) || n < 0 || n > 99) {
    return { ok: false, error: V.retriesMustBeInteger99 }
  }
  return { ok: true, value: n, line: String(n) }
}

export function validateYtdlpFragmentRetriesLine(
  raw: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; value: number | null; line: string } | { ok: false; error: string } {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const parsed = validateYtdlpRetriesLine(raw, uiLocale)
  if (parsed.ok) {
    return parsed
  }
  return { ok: false, error: V.fragmentRetriesMustBeInteger99 }
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
  template: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; value: string } | { ok: false; error: string } {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const t = template.trim()
  if (t.length === 0) {
    return { ok: false, error: V.filenameEmpty }
  }
  if (t.length > 480) {
    return { ok: false, error: V.filenameTooLong480 }
  }
  if (forbiddenTrajectory(t)) {
    return {
      ok: false,
      error: V.filenameForbiddenTrajectory
    }
  }
  if (!t.includes('%(ext)s')) {
    return {
      ok: false,
      error: V.filenameMustContainExt
    }
  }
  return { ok: true, value: t }
}
