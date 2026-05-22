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

/** §3 — macOS/Linux `bin/` без `.exe` (ручная укладка или CI). */
export const BUNDLED_UNIX_BIN_FILES = [
  { file: 'yt-dlp', jsonKey: 'yt-dlp' },
  { file: 'ffmpeg', jsonKey: 'ffmpeg' },
  { file: 'ffprobe', jsonKey: 'ffprobe' }
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
