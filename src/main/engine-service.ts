import { existsSync } from 'fs'
import { execFile } from 'child_process'
import { basename, join, normalize, resolve } from 'path'

import type { AppPaths } from './app-paths'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import {
  ENGINE_IDS,
  type EngineId,
  type EnginePathOverrides,
  type EngineStatus,
  type EnginesStatusSnapshot
} from '../shared/engine-contract'

export type {
  EngineId,
  EnginePathOverrides,
  EnginePathOverridesPatch,
  EngineState,
  EngineStatus,
  EnginesStatusSnapshot
} from '../shared/engine-contract'

export { ENGINE_IDS }

const engineDisplayNames: Record<EngineId, string> = {
  ffmpeg: 'ffmpeg',
  ffprobe: 'ffprobe',
  'yt-dlp': 'yt-dlp'
}

function executableName(id: EngineId): string {
  // yt-dlp тоже имеет `.exe` на Windows, поэтому правило единое для всех трёх движков.
  const suffix = process.platform === 'win32' ? '.exe' : ''
  return `${id}${suffix}`
}

function firstExistingPath(paths: string[]): string | null {
  // Проверяем только заранее собранный список путей: никакого поиска по PATH до явного решения в ТЗ/настройках.
  return paths.find((candidate) => existsSync(candidate)) ?? null
}

function candidatePaths(paths: AppPaths, id: EngineId, overrides?: EnginePathOverrides): string[] {
  const exe = executableName(id)
  const ordered: string[] = []

  const manual = overrides?.[id]
  if (typeof manual === 'string' && manual.trim() !== '') {
    ordered.push(resolve(normalize(manual.trim())))
  }

  // Bundled-first для релизов: ручной override -> resources/bin -> userData/bin fallback/update.
  ordered.push(join(paths.bundledBin, exe), join(paths.userBin, exe))
  return ordered
}

/** Путь к уже существующему исполняемому файлу движка (для запусков вроде ffprobe/ffmpeg). */
export function resolveEngineExecutablePath(
  paths: AppPaths,
  id: EngineId,
  overrides?: EnginePathOverrides
): string | null {
  return firstExistingPath(candidatePaths(paths, id, overrides))
}

function versionArgs(id: EngineId): string[] {
  return id === 'yt-dlp' ? ['--version'] : ['-version']
}

function readVersion(id: EngineId, executablePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Внешние процессы запускаем только через execFile/args array: без shell и без конкатенации команд.
    const child = execFile(
      executablePath,
      versionArgs(id),
      { timeout: 5000, windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr.trim() || error.message))
          return
        }

        const firstLine = stdout.split(/\r?\n/).find((line) => line.trim().length > 0)
        resolve(firstLine?.trim() ?? basename(executablePath))
      }
    )

    child.on('error', reject)
  })
}

async function checkEngine(
  paths: AppPaths,
  id: EngineId,
  overrides: EnginePathOverrides | undefined,
  locale: DownloadsWindowUiLocale
): Promise<EngineStatus> {
  const S = getMainApplicationStrings(locale)
  const exe = executableName(id)
  const foundPath = firstExistingPath(candidatePaths(paths, id, overrides))

  if (!foundPath) {
    // `missing` — нормальное состояние свежей установки до реализации загрузчика §3.
    // UI должен подсказывать действие, а не считать это аварией приложения.
    return {
      id,
      state: 'missing',
      displayName: engineDisplayNames[id],
      executableName: exe,
      path: null,
      version: null,
      message: S.engineStatusMissingTemplate.replace('{exe}', exe)
    }
  }

  try {
    const version = await readVersion(id, foundPath)

    return {
      id,
      state: 'ready',
      displayName: engineDisplayNames[id],
      executableName: exe,
      path: foundPath,
      version,
      message: null
    }
  } catch (error) {
    // Бинарник может существовать, но не запускаться: битый файл, неверная архитектура,
    // нет прав на выполнение или антивирус/SmartScreen вмешался в запуск.
    return {
      id,
      state: 'error',
      displayName: engineDisplayNames[id],
      executableName: exe,
      path: foundPath,
      version: null,
      message: error instanceof Error ? error.message : S.engineStatusRunFailedGeneric
    }
  }
}

/**
 * Снимок состояния движков для renderer.
 *
 * Сейчас это только локальная проверка наличия и `--version`. Скачивание, хеши и обновления
 * будут наращиваться поверх этих же статусов, чтобы UI не менял контракт при расширении §3.
 */
export async function getEnginesStatus(
  paths: AppPaths,
  overrides?: EnginePathOverrides,
  locale: DownloadsWindowUiLocale = 'ru'
): Promise<EnginesStatusSnapshot> {
  // TODO(§3): после загрузчика хешей добавить сюда состояние `checking`/progress для длительных проверок.
  const statuses = await Promise.all(
    ENGINE_IDS.map((id) => checkEngine(paths, id, overrides, locale))
  )

  return {
    checkedAt: new Date().toISOString(),
    engines: Object.fromEntries(statuses.map((status) => [status.id, status])) as Record<
      EngineId,
      EngineStatus
    >
  }
}
