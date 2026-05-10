import { type ChildProcess, spawn } from 'child_process'
import { mkdirSync } from 'fs'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'
import { logExternalProcessLine } from './external-process-log'
import { isYtdlpOsPauseSupported } from './ytdlp-os-pause-support'
import { buildYtdlpSpawnArgvTokens } from './ytdlp-extra-args'
import {
  resolveSafeYtdlpOutputPattern,
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options'

// Чистые парсеры stdout/stderr вынесены в отдельный модуль (без electron),
// чтобы покрываться юнит-тестами вне Electron-runtime. Здесь — только реэкспорт
// для совместимости старых импортов; новые места могут импортировать напрямую.
export {
  classifyYtdlpQueueFailureKind,
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  parseYtdlpDownloadProgressLine,
  parseYtdlpInfoFormatSnippet,
  parseYtdlpInfoQueueSizeHint,
  parseYtdlpQueueFormatHint,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure,
  type YtdlpDownloadProgressParts,
  type YtdlpQueueFailureKind
} from './ytdlp-progress-parser'

function abortErr(): Error {
  const e = new Error('Отменено')
  e.name = 'AbortError'
  return e
}

/** Активный `spawn` yt-dlp: не больше одного; пауза — SIGSTOP/SIGCONT только вне Windows. */
let activeYtdlpChild: ChildProcess | null = null
let activeYtdlpPaused = false

export { isYtdlpOsPauseSupported } from './ytdlp-os-pause-support'

export function getActiveYtdlpPauseState(): {
  supported: boolean
  active: boolean
  paused: boolean
} {
  return {
    supported: isYtdlpOsPauseSupported(),
    active: activeYtdlpChild !== null,
    paused: activeYtdlpPaused
  }
}

/**
 * Пауза/возобновление на уровне ОС: Windows не поддерживает доставку SIGSTOP дочерним процессам как в POSIX.
 */
export function pauseActiveYtdlpProcess(): { ok: true } | { ok: false; error: string } {
  if (!isYtdlpOsPauseSupported()) {
    return {
      ok: false,
      error: 'Пауза процесса yt-dlp в этом ОС не поддерживается (нужны SIGSTOP/SIGCONT).'
    }
  }
  const ch = activeYtdlpChild
  if (!ch || ch.killed) {
    return { ok: false, error: 'Нет активной загрузки yt-dlp.' }
  }
  if (activeYtdlpPaused) {
    return { ok: false, error: 'Загрузка уже приостановлена.' }
  }
  try {
    ch.kill('SIGSTOP')
    activeYtdlpPaused = true
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export function resumeActiveYtdlpProcess(): { ok: true } | { ok: false; error: string } {
  if (!isYtdlpOsPauseSupported()) {
    return {
      ok: false,
      error: 'Пауза процесса yt-dlp в этом ОС не поддерживается (нужны SIGSTOP/SIGCONT).'
    }
  }
  const ch = activeYtdlpChild
  if (!ch || ch.killed) {
    return { ok: false, error: 'Нет активной загрузки yt-dlp.' }
  }
  if (!activeYtdlpPaused) {
    return { ok: false, error: 'Загрузка не на паузе.' }
  }
  try {
    ch.kill('SIGCONT')
    activeYtdlpPaused = false
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export interface YtdlpRunCallbacks {
  /** Вызывается после успешного создания child process; валидационные ошибки до spawn сюда не попадают. */
  onStarted?: () => void
  onStdoutLine?: (line: string) => void
  onStderrLine?: (line: string) => void
}

/**
 * Одна загрузка через yt-dlp без shell: только массив аргументов.
 * Режим плейлиста, аудио и субтитров задаются только полями снимка §6.2.
 * Вывод и ошибки стримятся построчно для лога UI §6.4.
 */
export function runYtdlpOnce(
  paths: AppPaths,
  url: string,
  outputDir: string,
  signal: AbortSignal,
  callbacks: YtdlpRunCallbacks = {},
  engineOverrides?: EnginePathOverrides,
  cli?: Pick<
    YtdlpRunOptionsSnapshot,
    | 'filenameTemplate'
    | 'formatExtraArgs'
    | 'downloadPlaylist'
    | 'audioOnly'
    | 'subtitlePreset'
    | 'subLangs'
    | 'cookiesArgvFile'
    | 'cookiesArgvBrowser'
    | 'impersonateTarget'
    | 'rateLimit'
    | 'retries'
    | 'fragmentRetries'
    | 'extraArgs'
  >
): Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }> {
  const ytDlp = resolveEngineExecutablePath(paths, 'yt-dlp', engineOverrides)
  if (!ytDlp) {
    return Promise.reject(new Error('yt-dlp не найден — скачайте движки из главного окна'))
  }

  mkdirSync(outputDir, { recursive: true })

  const tmpl = cli?.filenameTemplate?.trim() || YTDLP_DEFAULT_FILENAME_TEMPLATE
  const outPattern = resolveSafeYtdlpOutputPattern(outputDir, tmpl)
  if (!outPattern) {
    return Promise.reject(
      new Error(
        'Некорректный шаблон имени файла (-o): проверьте %(ext)s, отсутствие «..» и выход за каталог загрузки.'
      )
    )
  }

  const downloadPlaylist = cli?.downloadPlaylist === true
  const audioOnly = cli?.audioOnly === true
  const subtitlePreset = cli?.subtitlePreset ?? 'none'
  const subLangs = cli?.subLangs ?? ''
  const cookiesFile = cli?.cookiesArgvFile ?? null
  const cookiesBrowser = cli?.cookiesArgvBrowser ?? null
  const impersonateTarget = cli?.impersonateTarget ?? null
  const rateLimit = cli?.rateLimit ?? ''
  const retries = cli?.retries ?? null
  const fragmentRetries = cli?.fragmentRetries ?? null
  const fmtArgs = audioOnly ? [] : (cli?.formatExtraArgs ?? [])
  const extraArgs = cli?.extraArgs ?? []
  const args = buildYtdlpSpawnArgvTokens({
    downloadPlaylist,
    audioOnly,
    subtitlePreset,
    subLangs,
    cookiesFile,
    cookiesBrowser,
    impersonateTarget,
    rateLimit,
    retries,
    fragmentRetries,
    formatExtraArgs: fmtArgs,
    extraArgs,
    outputPattern: outPattern,
    url
  })

  return new Promise((resolve, reject) => {
    const child = spawn(ytDlp, args, {
      cwd: outputDir,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    logExternalProcessLine('yt-dlp', 'lifecycle', 'started')

    const clearActiveChild = (): void => {
      if (activeYtdlpChild === child) {
        activeYtdlpChild = null
        activeYtdlpPaused = false
      }
    }

    activeYtdlpChild = child
    activeYtdlpPaused = false

    const onAbort = (): void => {
      try {
        if (isYtdlpOsPauseSupported() && activeYtdlpPaused && activeYtdlpChild === child) {
          child.kill('SIGCONT')
          activeYtdlpPaused = false
        }
        child.kill()
      } catch {
        /* ignore */
      }
    }

    if (signal.aborted) {
      onAbort()
      reject(abortErr())
      return
    }

    signal.addEventListener('abort', onAbort, { once: true })
    callbacks.onStarted?.()

    function pipeLines(
      streamName: 'stdout' | 'stderr',
      stream: NodeJS.ReadableStream | null,
      sink?: (line: string) => void
    ): void {
      if (!stream) {
        return
      }
      let buf = ''
      stream.setEncoding('utf8')
      stream.on('data', (chunk: string) => {
        buf += chunk
        const parts = buf.split(/\r?\n/)
        buf = parts.pop() ?? ''
        for (const line of parts) {
          const t = line.trimEnd()
          if (t.length > 0) {
            logExternalProcessLine('yt-dlp', streamName, t)
            sink?.(t)
          }
        }
      })
      stream.on('end', () => {
        const t = buf.trimEnd()
        if (t.length > 0) {
          logExternalProcessLine('yt-dlp', streamName, t)
          sink?.(t)
        }
      })
    }

    pipeLines('stdout', child.stdout, callbacks.onStdoutLine)
    pipeLines('stderr', child.stderr, callbacks.onStderrLine)

    child.on('error', (err) => {
      clearActiveChild()
      signal.removeEventListener('abort', onAbort)
      reject(err)
    })

    child.on('close', (exitCode, killSignal) => {
      clearActiveChild()
      signal.removeEventListener('abort', onAbort)
      logExternalProcessLine(
        'yt-dlp',
        'lifecycle',
        `closed exitCode=${exitCode ?? '?'} signal=${killSignal ?? '-'}`
      )
      if (signal.aborted) {
        reject(abortErr())
        return
      }
      resolve({ exitCode, signal: killSignal })
    })
  })
}
