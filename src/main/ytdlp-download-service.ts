import { type ChildProcess, execFileSync, spawn } from 'child_process'
import { mkdirSync } from 'fs'
import { join } from 'path'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'
import { logExternalProcessLine } from './external-process-log'
import { appendProcessStreamBuffer } from './process-stream-buffer'
import type { AppUiLocale } from '../shared/app-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { isNativeMainYtdlpKillProcessTreeSupported } from './platform'
import { isYtdlpOsPauseSupported } from './ytdlp-os-pause-support'
import { buildYtdlpSpawnArgvTokens } from './ytdlp-extra-args'
import { downloadsRunnerAbortMessage } from '../shared/downloads-flux-log-locale'
import {
  resolveSafeYtdlpOutputPattern,
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options'
import { getDownloadsWindowIpcStrings } from '../shared/downloads-window-ipc-locale'

function abortErr(locale: AppUiLocale): Error {
  const e = new Error(downloadsRunnerAbortMessage(locale))
  e.name = 'AbortError'
  return e
}

/** Активный `spawn` yt-dlp: не больше одного; пауза — SIGSTOP/SIGCONT только вне Windows. */
let activeYtdlpChild: ChildProcess | null = null
let activeYtdlpPaused = false

export { isYtdlpOsPauseSupported } from './ytdlp-os-pause-support'

/**
 * yt-dlp часто порождает ffmpeg/фрагментаторы; на Windows `child.kill()` без дерева оставляет детей,
 * из‑за чего загрузка в логе «продолжается» и файл докачивается после «отмены».
 * `taskkill` вызываем синхронно: асинхронный `execFile` успевал вернуться до фактического завершения дерева.
 */
function resolveWindowsTaskkillExe(): string {
  const windir = process.env['SystemRoot'] ?? process.env['windir'] ?? 'C:\\Windows'
  return join(windir, 'System32', 'taskkill.exe')
}

function killYtdlpSpawnTreeOrForce(child: ChildProcess): void {
  const pid = child.pid
  try {
    if (isNativeMainYtdlpKillProcessTreeSupported() && typeof pid === 'number' && pid > 0) {
      const argv = ['/PID', String(pid), '/T', '/F']
      const opts = { windowsHide: true as const, stdio: 'ignore' as const }
      try {
        execFileSync(resolveWindowsTaskkillExe(), argv, opts)
      } catch {
        try {
          execFileSync('taskkill', argv, opts)
        } catch {
          /* процесс уже завершён или нет прав */
        }
      }
    }
  } catch {
    /* ignore */
  }
  try {
    child.kill('SIGKILL')
  } catch {
    /* ignore */
  }
}

/** IPC «удалить активную строку»: если abort не убрал процесс, добиваем дерево (в т.ч. Windows). */
export function forceKillActiveYtdlpForDownloadsCancel(): void {
  const ch = activeYtdlpChild
  if (!ch || ch.killed) {
    return
  }
  killYtdlpSpawnTreeOrForce(ch)
}

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
export function pauseActiveYtdlpProcess(
  locale: AppUiLocale = 'ru'
): { ok: true } | { ok: false; error: string } {
  const P = getDownloadsWindowIpcStrings(locale)
  if (!isYtdlpOsPauseSupported()) {
    return {
      ok: false,
      error: P.pauseOsUnsupported
    }
  }
  const ch = activeYtdlpChild
  if (!ch || ch.killed) {
    return { ok: false, error: P.noActiveYtdlpDownload }
  }
  if (activeYtdlpPaused) {
    return { ok: false, error: P.ytdlpAlreadyPaused }
  }
  try {
    ch.kill('SIGSTOP')
    activeYtdlpPaused = true
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export function resumeActiveYtdlpProcess(
  locale: AppUiLocale = 'ru'
): { ok: true } | { ok: false; error: string } {
  const P = getDownloadsWindowIpcStrings(locale)
  if (!isYtdlpOsPauseSupported()) {
    return {
      ok: false,
      error: P.pauseOsUnsupported
    }
  }
  const ch = activeYtdlpChild
  if (!ch || ch.killed) {
    return { ok: false, error: P.noActiveYtdlpDownload }
  }
  if (!activeYtdlpPaused) {
    return { ok: false, error: P.ytdlpNotPaused }
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
    | 'cookiesArgvBrowserProfile'
    | 'impersonateTarget'
    | 'rateLimit'
    | 'retries'
    | 'fragmentRetries'
    | 'extraArgs'
  >,
  locale: AppUiLocale = 'ru'
): Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }> {
  const S = getMainApplicationStrings(locale)
  const ytDlp = resolveEngineExecutablePath(paths, 'yt-dlp', engineOverrides)
  if (!ytDlp) {
    return Promise.reject(new Error(S.ytdlpEngineNotFound))
  }

  mkdirSync(outputDir, { recursive: true })

  const tmpl = cli?.filenameTemplate?.trim() || YTDLP_DEFAULT_FILENAME_TEMPLATE
  const outPattern = resolveSafeYtdlpOutputPattern(outputDir, tmpl)
  if (!outPattern) {
    return Promise.reject(new Error(S.ytdlpInvalidFilenameTemplate))
  }

  const downloadPlaylist = cli?.downloadPlaylist === true
  const audioOnly = cli?.audioOnly === true
  const subtitlePreset = cli?.subtitlePreset ?? 'none'
  const subLangs = cli?.subLangs ?? ''
  const cookiesFile = cli?.cookiesArgvFile ?? null
  const cookiesBrowser = cli?.cookiesArgvBrowser ?? null
  const cookiesBrowserProfile = cli?.cookiesArgvBrowserProfile ?? null
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
    cookiesBrowserProfile,
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
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1'
      },
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
        killYtdlpSpawnTreeOrForce(child)
      } catch {
        /* ignore */
      }
    }

    if (signal.aborted) {
      onAbort()
      reject(abortErr(locale))
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
        buf = appendProcessStreamBuffer(buf, chunk)
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
        reject(abortErr(locale))
        return
      }
      resolve({ exitCode, signal: killSignal })
    })
  })
}
