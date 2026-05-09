import { existsSync } from 'fs'
import { execFile } from 'child_process'
import { basename, join, normalize, resolve } from 'path'

import type { AppPaths } from './app-paths'

export type EngineId = 'ffmpeg' | 'ffprobe' | 'yt-dlp'
export type EngineState = 'missing' | 'checking' | 'ready' | 'error'

/** Явные пути из настроек: полный путь к исполняемому файлу (имеет приоритет над bundled/user bin). */
export type EnginePathOverrides = Partial<Record<EngineId, string>>

/** Patch для IPC: `null` или пустая строка сбрасывают override для ключа. */
export type EnginePathOverridesPatch = Partial<Record<EngineId, string | null>>

export interface EngineStatus {
  /** Стабильный ID для IPC/UI; не зависит от расширения `.exe` на Windows. */
  id: EngineId
  /** Состояние для UI: renderer не должен гадать по тексту ошибки или пути. */
  state: EngineState
  /** Человекочитаемое имя для статуса/настроек; отдельно от имени файла. */
  displayName: string
  /** Реальное имя файла под текущую ОС (`ffmpeg.exe` на Windows, `ffmpeg` на Unix). */
  executableName: string
  /** Найденный путь, если бинарник существует хотя бы в одном из известных `bin`. */
  path: string | null
  /** Первая строка `--version`; позже пригодится для сравнения обновлений. */
  version: string | null
  /** Краткая причина `missing/error`, которую можно безопасно показать пользователю. */
  message: string | null
}

export interface EnginesStatusSnapshot {
  /** Время проверки: важно, когда UI позже будет обновлять статус по кнопке/таймеру. */
  checkedAt: string
  /** Статусы всех обязательных движков, индексированные по стабильному EngineId. */
  engines: Record<EngineId, EngineStatus>
}

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

  // bundled `bin`, затем `userData/bin`; ручной путь (если задан) проверяется первым.
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

function readVersion(executablePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Внешние процессы запускаем только через execFile/args array: без shell и без конкатенации команд.
    const child = execFile(
      executablePath,
      ['--version'],
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
  overrides?: EnginePathOverrides
): Promise<EngineStatus> {
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
      message: `Не найден ${exe} (override/bundled/user bin)`
    }
  }

  try {
    const version = await readVersion(foundPath)

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
      message: error instanceof Error ? error.message : 'Не удалось запустить движок'
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
  overrides?: EnginePathOverrides
): Promise<EnginesStatusSnapshot> {
  const ids: EngineId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
  // TODO(§3): после загрузчика хешей добавить сюда состояние `checking`/progress для длительных проверок.
  const statuses = await Promise.all(ids.map((id) => checkEngine(paths, id, overrides)))

  return {
    checkedAt: new Date().toISOString(),
    engines: Object.fromEntries(statuses.map((status) => [status.id, status])) as Record<
      EngineId,
      EngineStatus
    >
  }
}
