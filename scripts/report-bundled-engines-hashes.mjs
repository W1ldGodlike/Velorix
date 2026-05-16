/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Печать SHA256 для `bin/*.exe` (§19): удобно заполнить `Data/trusted_hashes.json` после `engines:prepare:win`.
 * Флаги: `--json` — фрагмент для вставки в `windows-x64` (только exe-ключи); `--versions` — первая строка `--version`/`-version` для каждого exe; `--help`.
 */
import { stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  BUNDLED_EXE_FILES,
  sha256File,
  tryFirstVersionLineFromWinEngineExe
} from './engines-bundled-sha256.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const binDir = join(rootDir, 'bin')

const FILES = BUNDLED_EXE_FILES.map(({ file }) => ({ key: file, name: file }))

function log(message) {
  console.log(`[engines:report-hashes] ${message}`)
}

function isWindows() {
  return process.platform === 'win32'
}

async function printVersionLines() {
  for (const { name } of FILES) {
    const full = join(binDir, name)
    const r = await tryFirstVersionLineFromWinEngineExe(full, name)
    if (r.ok) {
      log(`version ${name}: ${r.line}`)
    } else {
      log(`version ${name}: ошибка — ${r.error}`)
    }
  }
}

function printHelp() {
  console.log(`report-bundled-engines-hashes — SHA256 для bin/*.exe (trusted_hashes).

Обычно вместе с verify: npm run engines:doctor  (verify + этот скрипт + --versions)

Флаги:
  --json       JSON-фрагмент windows-x64 (yt-dlp.exe, ffmpeg.exe, ffprobe.exe)
  --versions   первая строка --version / -version для каждого exe
  --help       это сообщение`)
}

async function main() {
  const argv = process.argv
  if (argv.includes('--help')) {
    printHelp()
    return
  }
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
