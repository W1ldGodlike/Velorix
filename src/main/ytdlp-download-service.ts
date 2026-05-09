import { spawn } from 'child_process'
import { mkdirSync } from 'fs'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'
import { buildYtdlpSpawnArgvTokens } from './ytdlp-extra-args'
import {
  resolveSafeYtdlpOutputPattern,
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options'

function abortErr(): Error {
  const e = new Error('Отменено')
  e.name = 'AbortError'
  return e
}

export interface YtdlpRunCallbacks {
  onStdoutLine?: (line: string) => void
  onStderrLine?: (line: string) => void
}

/** Поля прогресса из строк stderr yt-dlp с префиксом «[download]» (режим `--newline`). */
export interface YtdlpDownloadProgressParts {
  percent: string | null
  speed: string | null
  eta: string | null
}

/**
 * Разбор строки прогресса yt-dlp для колонки таблицы §6.1.
 * Не shell и не исполнение — только эвристика по тексту stderr.
 */
export function parseYtdlpDownloadProgressLine(line: string): YtdlpDownloadProgressParts | null {
  const t = line.trimEnd()
  if (!t.includes('[download]')) {
    return null
  }
  // «Destination: …» без процентов — не колонка прогресса
  if (/destination:/i.test(t) && !/\d+(?:\.\d+)?%/.test(t)) {
    return null
  }

  const pctMatch = t.match(/(\d+(?:\.\d+)?)%/)
  const percent = pctMatch ? `${pctMatch[1]}%` : null

  let speed: string | null = null
  let eta: string | null = null

  const etaMatch = t.match(/\bETA\s+(\S+)/i)
  if (etaMatch) {
    eta = etaMatch[1]
  }

  const atEtaMatch = t.match(/\bat\s+(.+?)\s+ETA\s+/i)
  if (atEtaMatch) {
    speed = atEtaMatch[1].trim().replace(/\s+/g, ' ')
  } else {
    const atTailMatch = t.match(/\bin\s+[\d:.]+\s+at\s+(.+?)\s*$/i)
    if (atTailMatch) {
      speed = atTailMatch[1].trim().replace(/\s+/g, ' ')
    }
  }

  if (!percent && !speed) {
    return null
  }

  return { percent, speed, eta }
}

/** Компактная подпись для ячейки: «42.1% · 1.2MiB/s · ETA 00:15». */
export function formatYtdlpProgressCell(parts: YtdlpDownloadProgressParts): string {
  const bits: string[] = []
  if (parts.percent) {
    bits.push(parts.percent)
  }
  const spd = parts.speed?.trim() ?? ''
  if (spd.length > 0 && !/^unknown(\s+speed)?$/i.test(spd)) {
    bits.push(spd)
  }
  const et = parts.eta?.trim() ?? ''
  if (et.length > 0 && !/^unknown$/i.test(et)) {
    bits.push(`ETA ${et}`)
  }
  return bits.join(' · ')
}

/**
 * Одна загрузка через yt-dlp без shell: только массив аргументов.
 * Режим плейлиста и аудио задаются только флагами снимка §6.2 (`downloadPlaylist`, `audioOnly`).
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
    'filenameTemplate' | 'formatExtraArgs' | 'downloadPlaylist' | 'audioOnly' | 'extraArgs'
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
  const fmtArgs = audioOnly ? [] : (cli?.formatExtraArgs ?? [])
  const extraArgs = cli?.extraArgs ?? []
  const args = buildYtdlpSpawnArgvTokens({
    downloadPlaylist,
    audioOnly,
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

    const onAbort = (): void => {
      try {
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

    function pipeLines(stream: NodeJS.ReadableStream | null, sink?: (line: string) => void): void {
      if (!stream || !sink) {
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
            sink(t)
          }
        }
      })
      stream.on('end', () => {
        const t = buf.trimEnd()
        if (t.length > 0) {
          sink(t)
        }
      })
    }

    pipeLines(child.stdout, callbacks.onStdoutLine)
    pipeLines(child.stderr, callbacks.onStderrLine)

    child.on('error', (err) => {
      signal.removeEventListener('abort', onAbort)
      reject(err)
    })

    child.on('close', (exitCode, killSignal) => {
      signal.removeEventListener('abort', onAbort)
      if (signal.aborted) {
        reject(abortErr())
        return
      }
      resolve({ exitCode, signal: killSignal })
    })
  })
}
