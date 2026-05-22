import { execFile } from 'child_process'

import { parseFfmpegHeifDecoderAvailable } from '../../../shared/ffmpeg-heif-decoder-probe'

const EXEC_OPTS = {
  timeout: 15_000,
  windowsHide: true,
  maxBuffer: 4 * 1024 * 1024
} as const

let cachedFfmpegPath: string | null = null
let cachedHeifDecoder = false

/** §7.5 — кэш на путь ffmpeg в процессе (без shell). */
export function probeFfmpegHeifDecoderAvailable(ffmpegPath: string): Promise<boolean> {
  if (cachedFfmpegPath === ffmpegPath) {
    return Promise.resolve(cachedHeifDecoder)
  }
  return new Promise((resolve) => {
    execFile(ffmpegPath, ['-hide_banner', '-decoders'], EXEC_OPTS, (err, stdout, stderr) => {
      const merged = `${String(stdout ?? '')}\n${String(stderr ?? '')}`
      const available = !err && parseFfmpegHeifDecoderAvailable(merged)
      cachedFfmpegPath = ffmpegPath
      cachedHeifDecoder = available
      resolve(available)
    })
  })
}
