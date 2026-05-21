import { spawn } from 'child_process'

import {
  formatExternalProcessExitCode,
  logExternalProcessLine
} from '../../core/external-process-log'
import type { FfmpegSnapshotFormatId } from '../../../shared/ffmpeg-snapshot-contract'
import { parseFfmpegSnapshotFormatId } from '../../../shared/ffmpeg-snapshot-format-parse'

export function parseFfmpegSnapshotFormat(raw: unknown): FfmpegSnapshotFormatId {
  return parseFfmpegSnapshotFormatId(raw)
}

export function ensureFfmpegSnapshotExtension(
  path: string,
  fallback: FfmpegSnapshotFormatId
): string {
  const trimmed = path.trim()
  if (/\.(png|jpe?g)$/i.test(trimmed)) {
    return trimmed
  }
  return `${trimmed}.${parseFfmpegSnapshotFormat(fallback)}`
}

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
  const webp = lower.endsWith('.webp')

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
  } else if (webp) {
    args.push('-quality', '82')
  }
  args.push('-y', params.outputPath)

  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe']
    })
    logExternalProcessLine('ffmpeg-snapshot', 'lifecycle', 'started')

    let stderrTail = ''

    function noteStderr(line: string): void {
      const t = line.trimEnd()
      if (t.length === 0) {
        return
      }
      logExternalProcessLine('ffmpeg-snapshot', 'stderr', t)
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
      logExternalProcessLine('ffmpeg-snapshot', 'lifecycle', `error ${err.message}`)
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      logExternalProcessLine(
        'ffmpeg-snapshot',
        'lifecycle',
        `closed exitCode=${formatExternalProcessExitCode(code)}`
      )
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
