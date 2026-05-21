/**
 * SHA256 и версия Windows exe в bin/ — общий код для verify и report.
 */
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'

import { tryFirstVersionLineFromWinEngineExe } from './engines-exe-version-line.mjs'

export const BUNDLED_EXE_FILES = [
  { file: 'yt-dlp.exe', jsonKey: 'yt-dlp.exe' },
  { file: 'ffmpeg.exe', jsonKey: 'ffmpeg.exe' },
  { file: 'ffprobe.exe', jsonKey: 'ffprobe.exe' }
]

/** @param {string} path */
export function sha256File(path) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash('sha256')
    createReadStream(path)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => resolveHash(hash.digest('hex')))
  })
}

export { tryFirstVersionLineFromWinEngineExe }
