/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §19: после `electron-builder --dir` проверяем, что в `dist/win-unpacked/` попали
 * основной exe, `resources/bin/*.exe` (bundled engines) и ключевые extraResources.
 * Без shell, только stat — граница безопасности не нарушается.
 *
 * `VELORIX_SKIP_PACK_VERIFY=1` — мягкий пропуск (временный обход / нестандартный runner).
 * Не-Windows: exit 0 с пояснением (скрипт ожидается в CI Windows и локально на Win).
 */
import { stat } from 'node:fs/promises'

import { REPO_ROOT } from '../lib/repo-root.mjs'
import {
  collectWinUnpackedLayoutFailures,
  winUnpackedLayoutRoot
} from '../lib/verify-win-unpacked-layout-lib.mjs'

const unpackedRoot = winUnpackedLayoutRoot(REPO_ROOT)

function log(message) {
  console.log(`[pack:verify] ${message}`)
}

function skipRequested() {
  const v = process.env.VELORIX_SKIP_PACK_VERIFY
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

async function fileNonEmpty(path) {
  try {
    const s = await stat(path)
    return s.isFile() && s.size > 0
  } catch {
    return false
  }
}

async function dirExists(path) {
  try {
    const s = await stat(path)
    return s.isDirectory()
  } catch {
    return false
  }
}

function printHelp() {
  console.log(`verify-win-unpacked-layout — проверка dist/win-unpacked после pack:dir

Переменные:
  VELORIX_SKIP_PACK_VERIFY=1   пропуск проверки

Флаги: --help`)
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  if (skipRequested()) {
    log('VELORIX_SKIP_PACK_VERIFY — пропуск')
    return
  }

  if (process.platform !== 'win32') {
    log('не Windows — пропуск (ожидается после npm run pack:dir на Windows)')
    return
  }

  const failures = await collectWinUnpackedLayoutFailures(unpackedRoot, {
    fileNonEmpty,
    dirExists
  })
  if (failures.length > 0) {
    throw new Error(failures.join('\n'))
  }

  log('OK: Velorix.exe, resources/bin engines, VELORIX_TZ.md, Data/trusted_hashes.json, Help/')
}

main().catch((error) => {
  console.error(
    `[pack:verify] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
