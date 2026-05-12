/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §19: после `electron-builder --dir` проверяем, что в `dist/win-unpacked/` попали
 * основной exe, `resources/bin/*.exe` (bundled engines) и ключевые extraResources.
 * Без shell, только stat — граница безопасности не нарушается.
 *
 * `FLUXALLOY_SKIP_PACK_VERIFY=1` — мягкий пропуск (временный обход / нестандартный runner).
 * Не-Windows: exit 0 с пояснением (скрипт ожидается в CI Windows и локально на Win).
 */
import { stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const unpackedRoot = join(rootDir, 'dist', 'win-unpacked')

const BUNDLED_ENGINE_FILES = ['yt-dlp.exe', 'ffmpeg.exe', 'ffprobe.exe']

function log(message) {
  console.log(`[pack:verify] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_PACK_VERIFY
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
  FLUXALLOY_SKIP_PACK_VERIFY=1   пропуск проверки

Флаги: --help`)
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_PACK_VERIFY — пропуск')
    return
  }

  if (process.platform !== 'win32') {
    log('не Windows — пропуск (ожидается после npm run pack:dir на Windows)')
    return
  }

  const appExe = join(unpackedRoot, 'FluxAlloy.exe')
  if (!(await fileNonEmpty(appExe))) {
    throw new Error(
      `Нет или пустой ${appExe}. Сначала: npm run build && npm run pack:dir (или npm run check:release).`
    )
  }

  const bundledBin = join(unpackedRoot, 'resources', 'bin')
  if (!(await dirExists(bundledBin))) {
    throw new Error(`Нет каталога ${bundledBin} (extraResources bin → resources/bin).`)
  }

  for (const name of BUNDLED_ENGINE_FILES) {
    const full = join(bundledBin, name)
    if (!(await fileNonEmpty(full))) {
      throw new Error(
        `Нет или пустой bundled engine ${full}. Перед pack:dir выполните npm run engines:prepare:win.`
      )
    }
  }

  const tzPath = join(unpackedRoot, 'resources', 'FLUXALLOY_TZ.md')
  if (!(await fileNonEmpty(tzPath))) {
    throw new Error(`Нет или пустой ${tzPath} (extraResources).`)
  }

  const trustedPath = join(unpackedRoot, 'resources', 'Data', 'trusted_hashes.json')
  if (!(await fileNonEmpty(trustedPath))) {
    throw new Error(`Нет или пустой ${trustedPath} (extraResources Data).`)
  }

  const helpDir = join(unpackedRoot, 'resources', 'Help')
  if (!(await dirExists(helpDir))) {
    throw new Error(`Нет каталога ${helpDir} (extraResources Help).`)
  }

  log('OK: FluxAlloy.exe, resources/bin engines, FLUXALLOY_TZ.md, Data/trusted_hashes.json, Help/')
}

main().catch((error) => {
  console.error(
    `[pack:verify] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
