/**
 * Первая итерация авто-bootstrap движков §3 (приоритет Windows).
 *
 * Серверная часть: скачивает yt-dlp и архив FFmpeg, опционально сверяет SHA256 по JSON,
 * раскладывает `ffmpeg.exe`/`ffprobe.exe` в `userData/bin`. На других ОС загрузчик пока явно отклоняется.
 * Таймаут HTTP: `FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS` (см. `docs/RELEASE.md`).
 */

import { createHash } from 'node:crypto'
import {
  mkdirSync,
  readdirSync,
  copyFileSync,
  rmSync,
  createWriteStream,
  createReadStream,
  statSync,
  existsSync
} from 'fs'
import { dirname, join } from 'path'

import extract from 'extract-zip'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import type { AppPaths } from './app-paths'
import { ENGINE_IDS, type EnginePathOverrides } from './engine-service'
import { ENGINE_SOURCES_WINDOWS } from './engine-sources'
import type { TrustedHashesFile } from './trusted-hashes-store'
import {
  trustedHashForBundledFfmpegExeWin,
  trustedHashForBundledFfprobeExeWin,
  trustedHashForFfmpegZipWin,
  trustedHashForYtDlpWin
} from './trusted-hashes-store'
import type { EngineDownloadProgress } from '../shared/engine-download-contract'

export type {
  EngineDownloadPhase,
  EngineDownloadProgress
} from '../shared/engine-download-contract'

function userAgent(): string {
  return 'FluxAlloy/0.1.0 (engine downloader; Electron)'
}

async function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    createReadStream(filePath)
      .on('error', reject)
      .on('data', (chunk: string | Buffer) => {
        hash.update(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
      })
      .on('end', () => resolve(hash.digest('hex')))
  })
}

async function assertSha256Optional(filePath: string, expected: string | undefined): Promise<void> {
  if (expected === undefined || expected.trim() === '') {
    return
  }
  const hex = await sha256File(filePath)
  if (hex.toLowerCase() !== expected.trim().toLowerCase()) {
    throw new Error(`SHA256 не совпал для ${filePath}`)
  }
}

/** Таймаут загрузки движков (мс), общий с `prepare-engines-win.mjs` (`FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS`). */
function engineDownloadFetchTimeoutMs(): number {
  const raw = process.env['FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS']
  const n = raw != null ? Number.parseInt(String(raw).trim(), 10) : Number.NaN
  return Number.isFinite(n) && n > 0 ? n : 600_000
}

async function downloadToFile(
  url: string,
  destPath: string,
  onFraction: (f: number) => void
): Promise<void> {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': userAgent(), Accept: '*/*' },
    signal: AbortSignal.timeout(engineDownloadFetchTimeoutMs())
  })
  if (!response.ok) {
    throw new Error(`Загрузка не удалась: HTTP ${response.status} ${response.statusText}`)
  }
  const total = Number(response.headers.get('content-length') ?? 0)

  mkdirSync(dirname(destPath), { recursive: true })

  const rawBody = response.body
  if (!rawBody) {
    throw new Error('Пустой ответ сервера')
  }

  const webStream = rawBody as import('stream/web').ReadableStream<Uint8Array>
  const nodeReadable = Readable.fromWeb(webStream)
  const file = createWriteStream(destPath)

  let received = 0
  if (total > 0) {
    nodeReadable.on('data', (chunk: Buffer | string) => {
      received += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk)
      const pct = Math.min(99, Math.floor((received / total) * 100))
      onFraction(pct)
    })
  } else {
    onFraction(-1)
  }

  await pipeline(nodeReadable, file)
  if (total > 0) {
    onFraction(100)
  }
}

function findCaseInsensitiveExe(rootDir: string, fileName: string): string | null {
  const target = fileName.toLowerCase()
  function walk(dir: string): string | null {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        const nested = walk(full)
        if (nested) {
          return nested
        }
      } else if (entry.name.toLowerCase() === target) {
        return full
      }
    }
    return null
  }
  return walk(rootDir)
}

/**
 * Автоматическая подтяжка движков в `userData/bin` под Windows согласно §3 ТЗ.
 *
 * macOS/Linux оставлены заглушкой: матрица URL и упаковка отличаются, их лучше добавить
 * отдельным шагом вместе с CI и тестовой платформой.
 */
export async function downloadEnginesWindows(
  paths: AppPaths,
  trusted: TrustedHashesFile,
  onProgress: (p: EngineDownloadProgress) => void
): Promise<void> {
  if (process.platform !== 'win32') {
    throw new Error('Автозагрузка движков пока реализована только для Windows (см. ТЗ §3)')
  }

  mkdirSync(paths.userBin, { recursive: true })

  const ytdlpTarget = join(paths.userBin, 'yt-dlp.exe')
  const ytdlpHash = trustedHashForYtDlpWin(trusted)

  onProgress({
    phase: 'yt-dlp',
    message: 'Скачивание yt-dlp (GitHub)…',
    percent: 0
  })

  await downloadToFile(ENGINE_SOURCES_WINDOWS.ytDlpExeUrl, ytdlpTarget, (pct) =>
    onProgress({
      phase: 'yt-dlp',
      message: 'Скачивание yt-dlp (GitHub)…',
      percent: pct < 0 ? -1 : pct
    })
  )

  await assertSha256Optional(ytdlpTarget, ytdlpHash)

  const cacheRoot = join(paths.userBin, '.cache')
  mkdirSync(cacheRoot, { recursive: true })
  const zipTemp = join(cacheRoot, 'ffmpeg-download.zip')
  const extractDir = join(cacheRoot, `ffmpeg-${Date.now().toString(36)}`)
  mkdirSync(extractDir, { recursive: true })

  let ffmpegDownloaded = false
  let lastFfmpegError: unknown = null
  for (let i = 0; i < ENGINE_SOURCES_WINDOWS.ffmpegZipSources.length; i++) {
    const source = ENGINE_SOURCES_WINDOWS.ffmpegZipSources[i]
    if (!source) {
      continue
    }
    const sourceLabel = `${source.label} ${i + 1}/${ENGINE_SOURCES_WINDOWS.ffmpegZipSources.length}`
    onProgress({
      phase: 'ffmpeg-zip',
      message: `Скачивание FFmpeg (${sourceLabel})…`,
      percent: 0
    })
    try {
      await downloadToFile(source.url, zipTemp, (pct) =>
        onProgress({
          phase: 'ffmpeg-zip',
          message: `Скачивание FFmpeg (${sourceLabel})…`,
          percent: pct < 0 ? -1 : pct
        })
      )
      const zipHash = trustedHashForFfmpegZipWin(trusted, source.id)
      await assertSha256Optional(zipTemp, zipHash)
      ffmpegDownloaded = true
      break
    } catch (err) {
      lastFfmpegError = err
      try {
        rmSync(zipTemp, { force: true })
      } catch {
        /* ignore lock / AV delays */
      }
      if (i + 1 < ENGINE_SOURCES_WINDOWS.ffmpegZipSources.length) {
        onProgress({
          phase: 'ffmpeg-zip',
          message: `Источник FFmpeg ${source.label} не сработал, пробую резервный…`,
          percent: -1
        })
      }
    }
  }

  if (!ffmpegDownloaded) {
    const msg = lastFfmpegError instanceof Error ? lastFfmpegError.message : String(lastFfmpegError)
    throw new Error(`Не удалось скачать FFmpeg ни из одного источника: ${msg}`)
  }

  onProgress({ phase: 'extract', message: 'Распаковка FFmpeg…', percent: -1 })
  await extract(zipTemp, { dir: extractDir })

  const ffmpegFound = findCaseInsensitiveExe(extractDir, 'ffmpeg.exe')
  const ffprobeFound = findCaseInsensitiveExe(extractDir, 'ffprobe.exe')

  if (!ffmpegFound || !ffprobeFound) {
    rmSync(extractDir, { recursive: true, force: true })
    throw new Error('В архиве FFmpeg не найдены ffmpeg.exe / ffprobe.exe')
  }

  const ffmpegUser = join(paths.userBin, 'ffmpeg.exe')
  const ffprobeUser = join(paths.userBin, 'ffprobe.exe')
  copyFileSync(ffmpegFound, ffmpegUser)
  copyFileSync(ffprobeFound, ffprobeUser)

  await assertSha256Optional(ffmpegUser, trustedHashForBundledFfmpegExeWin(trusted))
  await assertSha256Optional(ffprobeUser, trustedHashForBundledFfprobeExeWin(trusted))

  rmSync(extractDir, { recursive: true, force: true })
  try {
    rmSync(zipTemp, { force: true })
  } catch {
    /* ignore lock / AV delays */
  }

  onProgress({ phase: 'done', message: 'Загрузка движков завершена', percent: 100 })
}

function fileExistsNonEmpty(candidate: string): boolean {
  try {
    if (!existsSync(candidate)) {
      return false
    }
    const st = statSync(candidate)
    return st.isFile() && st.size > 0
  } catch {
    return false
  }
}

/** `true`, если хотя бы один из трёх движков недоступен с учётом override, bundled и userData/bin. */
export function isAnyEngineMissing(paths: AppPaths, overrides?: EnginePathOverrides): boolean {
  const suffix = process.platform === 'win32' ? '.exe' : ''
  return ENGINE_IDS.some((id) => {
    const manual = overrides?.[id]
    if (typeof manual === 'string' && manual.trim() !== '' && fileExistsNonEmpty(manual.trim())) {
      return false
    }
    const fileName = `${id}${suffix}`
    const bundled = join(paths.bundledBin, fileName)
    const user = join(paths.userBin, fileName)
    return !fileExistsNonEmpty(bundled) && !fileExistsNonEmpty(user)
  })
}
