/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Печать SHA256 для bundled `bin/` (§19): Windows `*.exe`; macOS/Linux — без `.exe`.
 * Флаги: `--json` — фрагмент для trusted_hashes; `--versions`; `--help`.
 */
import { stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  BUNDLED_EXE_FILES,
  BUNDLED_UNIX_BIN_FILES,
  sha256File,
  tryFirstVersionLineFromWinEngineExe
} from './engines-bundled-sha256.mjs'
import { tryFirstVersionLineFromEngineBinary } from './engines-exe-version-line.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const binDir = join(rootDir, 'bin')

const WIN_FILES = BUNDLED_EXE_FILES.map(({ file }) => ({ key: file, name: file }))
const UNIX_FILES = BUNDLED_UNIX_BIN_FILES.map(({ file }) => ({ key: file, name: file }))

function log(message) {
  console.log(`[engines:report-hashes] ${message}`)
}

function isWindows() {
  return process.platform === 'win32'
}

function isUnixBundledPlatform() {
  return process.platform === 'darwin' || process.platform === 'linux'
}

async function printVersionLines(files, tryVersion) {
  for (const { name } of files) {
    const full = join(binDir, name)
    const r = await tryVersion(full, name)
    if (r.ok) {
      log(`version ${name}: ${r.line}`)
    } else {
      log(`version ${name}: ошибка — ${r.error}`)
    }
  }
}

async function reportRows(files, prepareHint) {
  const rows = []
  for (const { key, name } of files) {
    const full = join(binDir, name)
    try {
      const s = await stat(full)
      if (!s.isFile() || s.size === 0) {
        throw new Error('empty or missing')
      }
    } catch {
      throw new Error(`Нет файла ${full} — ${prepareHint}`)
    }
    const hex = await sha256File(full)
    rows.push({ key, name, hex })
  }
  return rows
}

function printHelp() {
  console.log(`report-bundled-engines-hashes — SHA256 для bin/ (Windows *.exe; macOS/Linux без .exe).

Обычно вместе с verify: npm run engines:doctor  (verify + этот скрипт + --versions)

Флаги:
  --json       JSON-фрагмент (windows-x64 exe или unix keys)
  --versions   первая строка --version / -version
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

  let files = WIN_FILES
  let jsonSection = 'windows-x64'
  let prepareHint = 'сначала npm run engines:prepare:win'

  if (!isWindows()) {
    if (!isUnixBundledPlatform()) {
      log(`Платформа ${process.platform}: report пропущен`)
      return
    }
    files = UNIX_FILES
    jsonSection = process.platform === 'darwin' ? 'darwin-universal' : 'linux-x64'
    prepareHint = `положите бинарники в bin/, npm run engines:prepare:${process.platform === 'darwin' ? 'mac' : 'linux'}`
  }

  const rows = await reportRows(files, prepareHint)

  if (jsonOut) {
    const obj = {}
    for (const { key, hex } of rows) {
      obj[key] = hex
    }
    console.log(`/* ${jsonSection} */`)
    console.log(JSON.stringify(obj, null, 2))
  } else if (!versionsOut) {
    for (const { name, hex } of rows) {
      console.log(`${name}\t${hex}`)
    }
  }

  if (versionsOut) {
    const tryVersion = isWindows()
      ? tryFirstVersionLineFromWinEngineExe
      : tryFirstVersionLineFromEngineBinary
    await printVersionLines(files, tryVersion)
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
