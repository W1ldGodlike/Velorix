import { spawn } from 'child_process'

/**
 * Один кадр в PNG/JPEG через ffmpeg без shell §7.6.
 * `-ss` до `-i`: быстрый seek; для превью достаточно.
 */
export function runFfmpegSnapshotFrame(params: {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  timeSec: number
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = Number.isFinite(params.timeSec) ? Math.max(0, params.timeSec) : 0
  const lower = params.outputPath.toLowerCase()
  const jpeg = lower.endsWith('.jpg') || lower.endsWith('.jpeg')

  const args: string[] = [
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    String(t),
    '-i',
    params.inputPath,
    '-frames:v',
    '1'
  ]
  if (jpeg) {
    args.push('-q:v', '2')
  }
  args.push('-y', params.outputPath)

  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe']
    })

    let stderrTail = ''

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail += chunk
      if (stderrTail.length > 8000) {
        stderrTail = stderrTail.slice(-8000)
      }
    })

    child.on('error', (err) => {
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ ok: true })
        return
      }
      const hint = stderrTail.trim()
      resolve({
        ok: false,
        error: hint.length > 0 ? hint.slice(0, 400) : `ffmpeg завершился с кодом ${code ?? '?'}`
      })
    })
  })
}
