import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { resolveAppTempDirectory } from '../../core/app-data-root-paths'
import { shell } from 'electron'

import { resolveAppPaths } from '../../core/app-paths'
import { resolveYtdlpOutputDirectory } from '../ytdlp/ytdlp-download-output'
import type {
  DiagnosticsFolderEntry,
  DiagnosticsFolderId
} from '../../../shared/diagnostics-contract'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../../shared/main-application-locale'

export type { DiagnosticsFolderEntry } from '../../../shared/diagnostics-contract'

/**
 * §17/§18 — белый список диагностических каталогов, которые приложение готово открыть в проводнике.
 *
 * Renderer (или меню) указывает только идентификатор; фактический абсолютный путь резолвится здесь,
 * чтобы у IPC не было способа попросить открыть произвольную папку. `logs` — заготовка под §18:
 * каталог гарантированно создаётся при первом обращении, чтобы пункт меню «Открыть папку логов»
 * не оставался мёртвым пока полноценное логирование не подключено.
 */
function resolveLogsDirectory(userData: string): string {
  return join(userData, 'logs')
}

/**
 * Каталог логов гарантированно создаётся при первом запросе, чтобы пункт «Открыть» не открывал пустоту.
 * Полноценная ротация и запись логов появятся в §18; пока это просто видимая папка в userData.
 */
function ensureLogsDirectoryExists(userData: string): string {
  const dir = resolveLogsDirectory(userData)
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  } catch {
    /* отсутствие прав на создание — не должно ронять меню; «Открыть» вернёт ошибку из shell.openPath */
  }
  return dir
}

function resolveDiagnosticsFolderPath(id: DiagnosticsFolderId): string {
  const paths = resolveAppPaths()
  switch (id) {
    case 'userData':
      return paths.userData
    case 'resources':
      return paths.resources
    case 'bundledBin':
      return paths.bundledBin
    case 'userBin':
      return paths.userBin
    case 'logs':
      return ensureLogsDirectoryExists(paths.userData)
    case 'ytdlpDownloads':
      return resolveYtdlpOutputDirectory(paths.userData)
    case 'systemTemp':
      return resolveAppTempDirectory(paths.userData)
  }
}

function diagnosticsFolderStrings(
  locale: AppUiLocale
): ReturnType<typeof getMainApplicationStrings> {
  return getMainApplicationStrings(locale)
}

function diagnosticsFolderLabel(id: DiagnosticsFolderId, locale: AppUiLocale): string {
  const s = diagnosticsFolderStrings(locale)
  switch (id) {
    case 'userData':
      return s.diagFolderUserData
    case 'resources':
      return s.diagFolderResources
    case 'bundledBin':
      return s.diagFolderBundledBin
    case 'userBin':
      return s.diagFolderUserBin
    case 'logs':
      return s.diagFolderLogs
    case 'ytdlpDownloads':
      return s.diagFolderYtdlpDownloads
    case 'systemTemp':
      return s.diagFolderSystemTemp
  }
}

function diagnosticsFolderHint(id: DiagnosticsFolderId, locale: AppUiLocale): string {
  const s = diagnosticsFolderStrings(locale)
  switch (id) {
    case 'userData':
      return s.diagFolderHintUserData
    case 'resources':
      return s.diagFolderHintResources
    case 'bundledBin':
      return s.diagFolderHintBundledBin
    case 'userBin':
      return s.diagFolderHintUserBin
    case 'logs':
      return s.diagFolderHintLogs
    case 'ytdlpDownloads':
      return s.diagFolderHintYtdlpDownloads
    case 'systemTemp':
      return s.diagFolderHintSystemTemp
  }
}

const DIAGNOSTICS_FOLDER_ORDER: DiagnosticsFolderId[] = [
  'userData',
  'logs',
  'ytdlpDownloads',
  'systemTemp',
  'userBin',
  'bundledBin',
  'resources'
]

/** Снимок диагностических каталогов для построения меню «Инструменты». */
export function listDiagnosticsFolders(locale: AppUiLocale): DiagnosticsFolderEntry[] {
  return DIAGNOSTICS_FOLDER_ORDER.map((id) => {
    const path = resolveDiagnosticsFolderPath(id)
    return {
      id,
      label: diagnosticsFolderLabel(id, locale),
      hint: diagnosticsFolderHint(id, locale),
      path,
      exists: existsSync(path)
    }
  })
}

export function isDiagnosticsFolderId(raw: unknown): raw is DiagnosticsFolderId {
  return (
    raw === 'userData' ||
    raw === 'resources' ||
    raw === 'bundledBin' ||
    raw === 'userBin' ||
    raw === 'logs' ||
    raw === 'ytdlpDownloads' ||
    raw === 'systemTemp'
  )
}

/**
 * Открыть один из диагностических каталогов в проводнике.
 *
 * `shell.openPath` возвращает пустую строку при успехе и текст ошибки иначе — конвертируем
 * это в `{ ok: true } | { ok: false; error }`, как принято в остальных IPC FluxAlloy.
 */
export async function openDiagnosticsFolder(
  id: DiagnosticsFolderId
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const target = resolveDiagnosticsFolderPath(id)
  const result = await shell.openPath(target)
  if (result.length === 0) {
    return { ok: true, path: target }
  }
  return { ok: false, error: result }
}
