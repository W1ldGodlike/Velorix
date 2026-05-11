/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Печать SHA256 для `bin/*.exe` (§19): удобно заполнить `Data/trusted_hashes.json` после `engines:prepare:win`.
 * Флаги: `--json` — фрагмент для вставки в `windows-x64` (только exe-ключи); `--versions` — первая строка `--version`/`-version` для каждого exe.
 */
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

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

async function printVersionLines() {
  for (const { name } of FILES) {
    const full = join(binDir, name)
    const args = name === 'yt-dlp.exe' ? ['--version'] : ['-version']
    try {
      const { stdout } = await execFileAsync(full, args, {
        timeout: 12_000,
        windowsHide: true,
        maxBuffer: 512 * 1024
      })
      const line = stdout.split(/\r?\n/).find((l) => l.trim())?.trim() ?? ''
      log(`version ${name}: ${line}`)
    } catch (e) {
      log(`version ${name}: ошибка — ${e instanceof Error ? e.message : String(e)}`)
    }
  }
}

async function main() {
  const argv = process.argv
  const jsonOut = argv.includes('--json')
  const versionsOut = argv.includes('--versions')

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
  } else if (!versionsOut) {
    for (const { name, hex } of rows) {
      console.log(`${name}\t${hex}`)
    }
  }

  if (versionsOut) {
    await printVersionLines()
  }

  if (!jsonOut && !versionsOut) {
    log('Для JSON: npm run engines:report-hashes -- --json; для версий: -- --versions')
  } else if (!versionsOut && jsonOut) {
    log('Добавить версии: npm run engines:report-hashes -- --json --versions')
  }
}

main().catch((error) => {
  console.error(
    `[engines:report-hashes] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
