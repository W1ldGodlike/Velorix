import { existsSync } from 'fs'
import { execFile } from 'child_process'
import { basename, join } from 'path'

import type { AppPaths } from './app-paths'

export type EngineId = 'ffmpeg' | 'ffprobe' | 'yt-dlp'
export type EngineState = 'missing' | 'checking' | 'ready' | 'error'

export interface EngineStatus {
  id: EngineId
  state: EngineState
  displayName: string
  executableName: string
  path: string | null
  version: string | null
  message: string | null
}

export interface EnginesStatusSnapshot {
  checkedAt: string
  engines: Record<EngineId, EngineStatus>
}

const engineDisplayNames: Record<EngineId, string> = {
  ffmpeg: 'ffmpeg',
  ffprobe: 'ffprobe',
  'yt-dlp': 'yt-dlp'
}

function executableName(id: EngineId): string {
  const suffix = process.platform === 'win32' ? '.exe' : ''
  return `${id}${suffix}`
}

function firstExistingPath(paths: string[]): string | null {
  return paths.find((candidate) => existsSync(candidate)) ?? null
}

function candidatePaths(paths: AppPaths, id: EngineId): string[] {
  const exe = executableName(id)

  // Сначала bundled `bin` из сборки, затем пользовательский `userData/bin`.
  // Позже сюда добавятся ручные override-пути из настроек, но порядок останется централизованным.
  return [join(paths.bundledBin, exe), join(paths.userBin, exe)]
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

async function checkEngine(paths: AppPaths, id: EngineId): Promise<EngineStatus> {
  const exe = executableName(id)
  const foundPath = firstExistingPath(candidatePaths(paths, id))

  if (!foundPath) {
    return {
      id,
      state: 'missing',
      displayName: engineDisplayNames[id],
      executableName: exe,
      path: null,
      version: null,
      message: `Не найден ${exe} в bundled/user bin`
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
export async function getEnginesStatus(paths: AppPaths): Promise<EnginesStatusSnapshot> {
  const ids: EngineId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
  const statuses = await Promise.all(ids.map((id) => checkEngine(paths, id)))

  return {
    checkedAt: new Date().toISOString(),
    engines: Object.fromEntries(statuses.map((status) => [status.id, status])) as Record<
      EngineId,
      EngineStatus
    >
  }
}
