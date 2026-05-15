import { execFile } from 'child_process'

import type { FfmpegHwEncodersProbeResult } from '../shared/ffmpeg-hw-encoder-probe'
import { parseFfmpegEncodersListOutput } from '../shared/ffmpeg-hw-encoder-probe'

/** Запуск `ffmpeg -hide_banner -encoders` и разбор whitelist HW-кодеков (без shell). */
export function probeFfmpegHwEncoders(ffmpegPath: string): Promise<FfmpegHwEncodersProbeResult> {
  return new Promise((resolve) => {
    execFile(
      ffmpegPath,
      ['-hide_banner', '-encoders'],
      {
        timeout: 15_000,
        windowsHide: true,
        maxBuffer: 8 * 1024 * 1024
      },
      (err, stdout, stderr) => {
        if (err) {
          const msg = (stderr && String(stderr).trim()) || err.message || String(err)
          resolve({ ok: false, error: msg })
          return
        }
        resolve({
          ok: true,
          snapshot: parseFfmpegEncodersListOutput(String(stdout ?? ''))
        })
      }
    )
  })
}
