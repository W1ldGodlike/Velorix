import { spawn } from 'child_process'

import {
  formatExternalProcessExitCode,
  logExternalProcessLine
} from '../../core/external-process-log'

export function runFfmpegVideoSprite(params: {
  ffmpegPath: string
  argv: string[]
  signal: AbortSignal
}): Promise<{ ok: true } | { ok: false; cancelled: true } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, params.argv, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe']
    })
    logExternalProcessLine('ffmpeg-video-sprite', 'lifecycle', 'started')

    let stderrTail = ''
    const onAbort = (): void => {
      child.kill()
    }
    if (params.signal.aborted) {
      onAbort()
    } else {
      params.signal.addEventListener('abort', onAbort, { once: true })
    }

    function noteStderr(line: string): void {
      const t = line.trimEnd()
      if (t.length === 0) {
        return
      }
      logExternalProcessLine('ffmpeg-video-sprite', 'stderr', t)
    }

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail += chunk
      for (const part of chunk.split(/\r|\n/)) {
        noteStderr(part)
      }
      if (stderrTail.length > 8000) {
        stderrTail = stderrTail.slice(-8000)
      }
    })

    child.on('error', (err) => {
      params.signal.removeEventListener('abort', onAbort)
      logExternalProcessLine('ffmpeg-video-sprite', 'lifecycle', `error ${err.message}`)
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      params.signal.removeEventListener('abort', onAbort)
      logExternalProcessLine(
        'ffmpeg-video-sprite',
        'lifecycle',
        `closed exitCode=${formatExternalProcessExitCode(code)}`
      )
      if (params.signal.aborted) {
        resolve({ ok: false, cancelled: true })
        return
      }
      if (code === 0) {
        resolve({ ok: true })
        return
      }
      const hint = stderrTail.trim()
      resolve({
        ok: false,
        error: hint.length > 0 ? hint.slice(0, 400) : `ffmpeg exited with code ${code ?? '?'}`
      })
    })
  })
}
