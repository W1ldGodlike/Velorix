import { execFile } from 'child_process'

import type { FfmpegHwEncodersProbeResult } from '../shared/ffmpeg-hw-encoder-probe'
import {
  parseFfmpegEncodersListOutput,
  parseFfmpegHwaccelsOutput
} from '../shared/ffmpeg-hw-encoder-probe'
import { probeNvidiaSmiGpuInfo } from './nvidia-smi-gpu-info-probe'

const EXEC_OPTS = {
  timeout: 15_000,
  windowsHide: true,
  maxBuffer: 8 * 1024 * 1024
} as const

/** Запуск `ffmpeg -encoders` и `-hwaccels`, разбор whitelist HW-кодеков (без shell). */
export function probeFfmpegHwEncoders(ffmpegPath: string): Promise<FfmpegHwEncodersProbeResult> {
  const nvidiaGpuPromise = probeNvidiaSmiGpuInfo()
  return new Promise((resolve) => {
    execFile(ffmpegPath, ['-hide_banner', '-encoders'], EXEC_OPTS, (err, stdout, stderr) => {
      if (err) {
        const msg = (stderr && String(stderr).trim()) || err.message || String(err)
        resolve({ ok: false, error: msg })
        return
      }
      const snapshot = parseFfmpegEncodersListOutput(String(stdout ?? ''))
      execFile(ffmpegPath, ['-hide_banner', '-hwaccels'], EXEC_OPTS, (err2, stdout2, stderr2) => {
        const merged = `${String(stdout2 ?? '')}\n${String(stderr2 ?? '')}`
        const hwaccels = err2 ? [] : parseFfmpegHwaccelsOutput(merged)
        void nvidiaGpuPromise.then((nvidiaGpu) => {
          resolve({ ok: true, snapshot, hwaccels, nvidiaGpu })
        })
      })
    })
  })
}
