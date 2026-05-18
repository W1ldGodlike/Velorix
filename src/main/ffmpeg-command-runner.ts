import { spawn } from 'child_process'

import { logExternalProcessLine } from './external-process-log'

export function runFfmpegCommand(params: {
  ffmpegPath: string
  args: string[]
  logTag: string
}): Promise<{ ok: true; stderr: string } | { ok: false; error: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, params.args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe']
    })
    logExternalProcessLine(params.logTag, 'lifecycle', 'started')

    let stderrTail = ''

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail += chunk
      if (stderrTail.length > 12000) {
        stderrTail = stderrTail.slice(-12000)
      }
    })

    child.on('error', (err) => {
      logExternalProcessLine(params.logTag, 'lifecycle', `error ${err.message}`)
      resolve({ ok: false, error: err.message, stderr: stderrTail.trim() })
    })

    child.on('close', (code) => {
      logExternalProcessLine(params.logTag, 'lifecycle', `closed exitCode=${code ?? '?'}`)
      const stderr = stderrTail.trim()
      if (code === 0) {
        resolve({ ok: true, stderr })
        return
      }
      const hint = stderr.length > 0 ? stderr.slice(0, 400) : `exit ${code ?? '?'}`
      resolve({ ok: false, error: hint, stderr })
    })
  })
}
