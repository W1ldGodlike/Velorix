/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §19: после `electron-builder --linux --dir` проверяем `dist/linux-unpacked/`.
 * Движки в `resources/bin` — опционально (CI-каркас без ручного bin/).
 *
 * `VELORIX_SKIP_PACK_VERIFY=1` — мягкий пропуск.
 * Не-Linux: exit 0 с пояснением (скрипт для ubuntu CI и локальной сборки на Linux).
 */
import { stat } from 'node:fs/promises'

import { REPO_ROOT } from '../lib/repo-root.mjs'
import {
  collectLinuxUnpackedLayoutFailures,
  linuxUnpackedLayoutRoot,
  listLinuxUnpackedOptionalEngineWarnings
} from '../lib/verify-linux-unpacked-layout-lib.mjs'

const unpackedRoot = linuxUnpackedLayoutRoot(REPO_ROOT)

function log(message) {
  console.log(`[pack:verify-linux] ${message}`)
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
  console.log(`verify-linux-unpacked-layout — проверка dist/linux-unpacked после pack:linux:dir

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

  if (process.platform !== 'linux') {
    log('не Linux — пропуск (ожидается после npm run pack:linux:dir на Linux)')
    return
  }

  const deps = { fileNonEmpty, dirExists }
  const failures = await collectLinuxUnpackedLayoutFailures(unpackedRoot, deps)
  if (failures.length > 0) {
    throw new Error(failures.join('\n'))
  }

  const warnings = await listLinuxUnpackedOptionalEngineWarnings(unpackedRoot, deps)
  for (const w of warnings) {
    log(w)
  }

  log('OK: app executable, resources/bin, VELORIX_NEON_THEME.md, Data/trusted_hashes.json, Help/')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
