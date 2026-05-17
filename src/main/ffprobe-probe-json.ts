import { execFile } from 'child_process'

import { logExternalProcessLine } from './external-process-log'

export function runFfprobeJson(ffprobePath: string, mediaPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    logExternalProcessLine('ffprobe', 'lifecycle', 'started')
    execFile(
      ffprobePath,
      [
        '-hide_banner',
        '-v',
        'error',
        '-print_format',
        'json',
        '-show_format',
        '-show_streams',
        '-show_chapters',
        mediaPath
      ],
      { timeout: 60_000, windowsHide: true, maxBuffer: 20 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (stdout.trim().length > 0) {
          logExternalProcessLine('ffprobe', 'stdout', `json bytes=${Buffer.byteLength(stdout)}`)
        }
        if (stderr.trim().length > 0) {
          for (const line of stderr.split(/\r?\n/)) {
            logExternalProcessLine('ffprobe', 'stderr', line)
          }
        }
        if (error) {
          logExternalProcessLine('ffprobe', 'lifecycle', `error ${error.message}`)
          reject(new Error(stderr.trim() || error.message))
          return
        }
        logExternalProcessLine('ffprobe', 'lifecycle', 'closed exitCode=0')
        resolve(stdout)
      }
    )
  })
}
