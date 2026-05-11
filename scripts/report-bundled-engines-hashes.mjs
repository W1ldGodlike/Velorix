/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Печать SHA256 для `bin/*.exe` (§19): удобно заполнить `Data/trusted_hashes.json` после `engines:prepare:win`.
 * Флаги: `--json` — фрагмент для вставки в `windows-x64` (только exe-ключи).
 */
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const binDir = join(rootDir, 'bin')

const FILES = [
  { key: 'yt-dlp.exe', name: 'yt-dlp.exe' },
  { key: 'ffmpeg.exe', name: 'ffmpeg.exe' },
  { key: 'ffprobe.exe', name: 'ffprobe.exe' }
]

function log(message) {
  console.log(`[engines:report-hashes] ${message}`)
}

function isWindows() {
  return process.platform === 'win32'
}

async function sha256File(path) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash('sha256')
    createReadStream(path)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => resolveHash(hash.digest('hex')))
  })
}

async function main() {
  const jsonOut = process.argv.includes('--json')

  if (!isWindows()) {
    log('Windows-only: на других ОС bin/*.exe не считаем')
    return
  }

  const rows = []
  for (const { key, name } of FILES) {
    const full = join(binDir, name)
    try {
      const s = await stat(full)
      if (!s.isFile() || s.size === 0) {
        throw new Error('empty or missing')
      }
    } catch {
      throw new Error(`Нет файла ${full} — сначала npm run engines:prepare:win`)
    }
    const hex = await sha256File(full)
    rows.push({ key, name, hex })
  }

  if (jsonOut) {
    const obj = {}
    for (const { key, hex } of rows) {
      obj[key] = hex
    }
    console.log(JSON.stringify(obj, null, 2))
    return
  }

  for (const { name, hex } of rows) {
    console.log(`${name}\t${hex}`)
  }
  log('Для JSON-фрагмента под windows-x64: npm run engines:report-hashes -- --json')
}

main().catch((error) => {
  console.error(
    `[engines:report-hashes] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
