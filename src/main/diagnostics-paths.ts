import { existsSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { shell } from 'electron'

import { resolveAppPaths } from './app-paths'
import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'
import type { DiagnosticsFolderEntry, DiagnosticsFolderId } from '../shared/diagnostics-contract'

export type { DiagnosticsFolderEntry, DiagnosticsFolderId } from '../shared/diagnostics-contract'

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
      return tmpdir()
  }
}

const DIAGNOSTICS_FOLDER_LABELS: Record<DiagnosticsFolderId, string> = {
  userData: 'Папка настроек (userData)',
  resources: 'Папка ресурсов приложения',
  bundledBin: 'Папка bin в поставке',
  userBin: 'Папка bin в userData',
  logs: 'Папка логов',
  ytdlpDownloads: 'Каталог загрузок yt-dlp',
  systemTemp: 'Системная временная папка'
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
export function listDiagnosticsFolders(): DiagnosticsFolderEntry[] {
  return DIAGNOSTICS_FOLDER_ORDER.map((id) => {
    const path = resolveDiagnosticsFolderPath(id)
    return {
      id,
      label: DIAGNOSTICS_FOLDER_LABELS[id],
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
