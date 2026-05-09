import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

/**
 * Доверенные SHA256 под §3 ТЗ — JSON рядом с приложением обновляется без пересборки.
 *
 * Пустая строка / отсутствие ключа = проверка пропускается (удобно на этапе разработки,
 * пока версии билдов меняются). Для воспроизводимости релиза заполнить хеши обязательно.
 */
export interface TrustedHashesWindows {
  'yt-dlp.exe'?: string
  /** Хеш архива с gyan.dev перед распаковкой. */
  'ffmpeg-release-essentials.zip'?: string
}

export interface TrustedHashesFile {
  schema?: number

  /** Ключ платформы-архитектуры совпадает с договорённостью в чек-листе §3/§19. */
  'windows-x64'?: TrustedHashesWindows

  /** Совместимость со старым плоским форматом; приоритет ниже секции платформы. */
  YtDlpSha256?: string
  FfmpegSha256?: string
  YtDlpVersion?: string
  FfmpegVersion?: string
}

/** Путь к JSON в корне сборки/`extraResources`; в dev — `Data/` репозитория. */
export function resolveTrustedHashesPath(): string {
  const packaged = join(process.resourcesPath, 'Data', 'trusted_hashes.json')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  return join(app.getAppPath(), 'Data', 'trusted_hashes.json')
}

export function loadTrustedHashes(path: string): TrustedHashesFile {
  try {
    if (!existsSync(path)) {
      return {}
    }
    return JSON.parse(readFileSync(path, 'utf-8')) as TrustedHashesFile
  } catch {
    return {}
  }
}

export function trustedHashForYtDlpWin(file: TrustedHashesFile): string | undefined {
  const w = file['windows-x64']
  const nested = w?.['yt-dlp.exe']
  if (typeof nested === 'string' && nested.trim() !== '') {
    return nested.trim()
  }
  const legacy = file.YtDlpSha256
  if (typeof legacy === 'string' && legacy.trim() !== '') {
    return legacy.trim()
  }
  return undefined
}

export function trustedHashForFfmpegZipWin(file: TrustedHashesFile): string | undefined {
  const w = file['windows-x64']
  const nested = w?.['ffmpeg-release-essentials.zip']
  if (typeof nested === 'string' && nested.trim() !== '') {
    return nested.trim()
  }
  const legacy = file.FfmpegSha256
  if (typeof legacy === 'string' && legacy.trim() !== '') {
    return legacy.trim()
  }
  return undefined
}
