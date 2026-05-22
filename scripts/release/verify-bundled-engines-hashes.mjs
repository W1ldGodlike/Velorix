/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Верификация bundled `bin/` для §19: Windows `*.exe`; macOS/Linux — `ffmpeg`, `ffprobe`, `yt-dlp`.
 *
 * Режим строгого релиза: `VELORIX_ENGINES_STRICT=1` — обязательны непустые хеши
 * `windows-x64["yt-dlp.exe"]`, `["ffmpeg.exe"]`, `["ffprobe.exe"]` и совпадение с диском.
 * Без strict пустые поля = проверка пропускается (dev), но файлы после prepare должны существовать.
 * Флаги: `--help`.
 */
import { readFile, stat } from 'node:fs/promises'
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
const trustedHashesPath = join(rootDir, 'Data', 'trusted_hashes.json')

const EXE_KEYS = BUNDLED_EXE_FILES

function log(message) {
  console.log(`[engines:verify] ${message}`)
}

function isWindows() {
  return process.platform === 'win32'
}

function isUnixBundledPlatform() {
  return process.platform === 'darwin' || process.platform === 'linux'
}

async function fileNonEmpty(path) {
  try {
    const s = await stat(path)
    return s.isFile() && s.size > 0
  } catch {
    return false
  }
}

function shouldLogEngineVersions() {
  const ga = process.env.GITHUB_ACTIONS
  const flag = process.env.VELORIX_LOG_ENGINE_VERSIONS
  return (
    ga === 'true' ||
    flag === '1' ||
    (typeof flag === 'string' && flag.trim().toLowerCase() === 'true')
  )
}

async function logCiEngineHeadlines(files, tryVersion) {
  if (!shouldLogEngineVersions()) {
    return
  }
  for (const { file } of files) {
    const full = join(binDir, file)
    const r = await tryVersion(full, file)
    if (r.ok) {
      log(`CI version ${file}: ${r.line}`)
    } else {
      log(`CI version ${file}: ошибка запуска — ${r.error}`)
    }
  }
}

function printHelp() {
  console.log(`verify-bundled-engines-hashes — проверка bin/ (Windows *.exe; macOS/Linux ffmpeg, ffprobe, yt-dlp).

Комплексно (verify + SHA в лог + версии): npm run engines:doctor  (см. docs/RELEASE.md)

Переменные:
  VELORIX_ENGINES_STRICT=1     обязательны непустые exe-хеши в windows-x64 (только Windows)
  VELORIX_LOG_ENGINE_VERSIONS=1   печать первой строки версии каждого движка
  GITHUB_ACTIONS=true (в CI)    то же, что лог версий`)
}

async function verifyWindowsBundled(strict, trusted) {
  const wx =
    trusted['windows-x64'] && typeof trusted['windows-x64'] === 'object'
      ? trusted['windows-x64']
      : {}

  for (const { file, jsonKey } of EXE_KEYS) {
    const full = join(binDir, file)
    const ok = await fileNonEmpty(full)
    if (!ok) {
      throw new Error(`Отсутствует или пустой файл: ${full} (сначала npm run engines:prepare:win)`)
    }
    const expected = typeof wx[jsonKey] === 'string' ? wx[jsonKey].trim() : ''
    if (strict && expected === '') {
      throw new Error(
        `VELORIX_ENGINES_STRICT: в trusted_hashes.json -> windows-x64["${jsonKey}"] нужен непустой SHA256`
      )
    }
    if (expected !== '') {
      const actual = await sha256File(full)
      if (actual.toLowerCase() !== expected.toLowerCase()) {
        throw new Error(`SHA256 не совпал для ${file}: ожидалось ${expected}, получено ${actual}`)
      }
      log(`${file}: SHA256 ok`)
    } else {
      log(`${file}: присутствует, SHA256 в JSON не задан — пропуск`)
    }
  }

  await logCiEngineHeadlines(EXE_KEYS, tryFirstVersionLineFromWinEngineExe)
  log(strict ? 'strict: все exe-хеши совпали' : 'Windows bundled: готово (non-strict)')
}

async function verifyUnixBundled() {
  const prepareHint =
    process.platform === 'darwin' ? 'engines:prepare:mac' : 'engines:prepare:linux'

  for (const { file } of BUNDLED_UNIX_BIN_FILES) {
    const full = join(binDir, file)
    const ok = await fileNonEmpty(full)
    if (!ok) {
      throw new Error(
        `Отсутствует или пустой файл: ${full} (см. npm run ${prepareHint} на ${process.platform === 'darwin' ? 'macOS' : 'Linux'}-хосте)`
      )
    }
    log(`${file}: присутствует (SHA256 unix — по желанию в trusted_hashes, пока пропуск)`)
  }

  await logCiEngineHeadlines(BUNDLED_UNIX_BIN_FILES, tryFirstVersionLineFromEngineBinary)
  log('Unix bundled: готово (presence + version)')
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  const strict =
    process.env.VELORIX_ENGINES_STRICT === '1' || process.env.VELORIX_ENGINES_STRICT === 'true'

  let trusted = {}
  try {
    trusted = JSON.parse(await readFile(trustedHashesPath, 'utf-8'))
  } catch (e) {
    throw new Error(
      `Не удалось прочитать ${trustedHashesPath}: ${e instanceof Error ? e.message : String(e)}`
    )
  }

  if (isWindows()) {
    await verifyWindowsBundled(strict, trusted)
    return
  }

  if (isUnixBundledPlatform()) {
    if (strict) {
      log('VELORIX_ENGINES_STRICT: только windows-x64 exe-хеши — unix SHA пока не enforced')
    }
    await verifyUnixBundled()
    return
  }

  log(`Платформа ${process.platform}: verify пропущен (ожидается win32, darwin или linux)`)
}

main().catch((error) => {
  console.error(
    `[engines:verify] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
