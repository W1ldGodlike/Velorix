/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Верификация bundled `bin/*.exe` для §19: наличие файлов и (опционально) SHA256 из `Data/trusted_hashes.json`.
 *
 * Режим строгого релиза: `FLUXALLOY_ENGINES_STRICT=1` — обязательны непустые хеши
 * `windows-x64["yt-dlp.exe"]`, `["ffmpeg.exe"]`, `["ffprobe.exe"]` и совпадение с диском.
 * Без strict пустые поля = проверка пропускается (dev), но файлы после prepare должны существовать.
 * Флаги: `--help`.
 */
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { tryFirstVersionLineFromWinEngineExe } from './engines-exe-version-line.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const binDir = join(rootDir, 'bin')
const trustedHashesPath = join(rootDir, 'Data', 'trusted_hashes.json')

const EXE_KEYS = [
  { file: 'yt-dlp.exe', jsonKey: 'yt-dlp.exe' },
  { file: 'ffmpeg.exe', jsonKey: 'ffmpeg.exe' },
  { file: 'ffprobe.exe', jsonKey: 'ffprobe.exe' }
]

function log(message) {
  console.log(`[engines:verify] ${message}`)
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
  const flag = process.env.FLUXALLOY_LOG_ENGINE_VERSIONS
  return (
    ga === 'true' ||
    flag === '1' ||
    (typeof flag === 'string' && flag.trim().toLowerCase() === 'true')
  )
}

/** В CI или при `FLUXALLOY_LOG_ENGINE_VERSIONS` — первая строка `--version`/`-version` в лог. */
async function logCiEngineHeadlines() {
  if (!shouldLogEngineVersions()) {
    return
  }
  for (const { file } of EXE_KEYS) {
    const full = join(binDir, file)
    const r = await tryFirstVersionLineFromWinEngineExe(full, file)
    if (r.ok) {
      log(`CI version ${file}: ${r.line}`)
    } else {
      log(`CI version ${file}: ошибка запуска — ${r.error}`)
    }
  }
}

function printHelp() {
  console.log(`verify-bundled-engines-hashes — проверка bin/*.exe и опционально SHA256 (Data/trusted_hashes.json).

Комплексно (verify + SHA в лог + версии): npm run engines:doctor  (см. docs/RELEASE.md)

Переменные:
  FLUXALLOY_ENGINES_STRICT=1     обязательны непустые exe-хеши в windows-x64
  FLUXALLOY_LOG_ENGINE_VERSIONS=1   печать первой строки версии каждого exe
  GITHUB_ACTIONS=true (в CI)    то же, что лог версий`)
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  if (!isWindows()) {
    log('Windows-only verify skipped on this platform')
    return
  }

  const strict =
    process.env.FLUXALLOY_ENGINES_STRICT === '1' || process.env.FLUXALLOY_ENGINES_STRICT === 'true'

  let trusted = {}
  try {
    trusted = JSON.parse(await readFile(trustedHashesPath, 'utf-8'))
  } catch (e) {
    throw new Error(
      `Не удалось прочитать ${trustedHashesPath}: ${e instanceof Error ? e.message : String(e)}`
    )
  }

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
        `FLUXALLOY_ENGINES_STRICT: в trusted_hashes.json -> windows-x64["${jsonKey}"] нужен непустой SHA256`
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

  await logCiEngineHeadlines()

  log(strict ? 'strict: все exe-хеши совпали' : 'готово (non-strict)')
}

main().catch((error) => {
  console.error(
    `[engines:verify] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
