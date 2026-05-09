import { spawn } from 'child_process'
import { mkdirSync } from 'fs'
import { join } from 'path'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'

function abortErr(): Error {
  const e = new Error('Отменено')
  e.name = 'AbortError'
  return e
}

export interface YtdlpRunCallbacks {
  onStdoutLine?: (line: string) => void
  onStderrLine?: (line: string) => void
}

/** Из строк прогресса yt-dlp извлекает процент, если есть. */
export function extractDownloadPercent(line: string): string | null {
  const m = line.match(/(\d+\.?\d*)%/)
  return m ? `${m[1]}%` : null
}

/**
 * Одна загрузка через yt-dlp без shell: только массив аргументов.
 * Вывод и ошибки стримятся построчно для лога UI §6.4.
 */
export function runYtdlpOnce(
  paths: AppPaths,
  url: string,
  outputDir: string,
  signal: AbortSignal,
  callbacks: YtdlpRunCallbacks = {},
  engineOverrides?: EnginePathOverrides
): Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }> {
  const ytDlp = resolveEngineExecutablePath(paths, 'yt-dlp', engineOverrides)
  if (!ytDlp) {
    return Promise.reject(new Error('yt-dlp не найден — скачайте движки из главного окна'))
  }

  mkdirSync(outputDir, { recursive: true })

  const outPattern = join(outputDir, '%(title)s [%(id)s].%(ext)s')

  const args = ['--newline', '--no-playlist', '--no-color', '-o', outPattern, url]

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
