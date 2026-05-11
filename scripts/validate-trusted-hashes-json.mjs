/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Проверка структуры `Data/trusted_hashes.json` (§3/§19): валидный JSON, корневой объект,
 * секция `windows-x64` — только объект со строковыми значениями (пустая строка допустима),
 * известные legacy-поля и `schema`, предупреждения по неизвестным ключам.
 *
 * `FLUXALLOY_TRUSTED_HASHES_STRICT_UNKNOWN=1` — неизвестные ключи в корне или в windows-x64 → exit 1.
 * `FLUXALLOY_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1` — непустые значения в windows-x64 и в YtDlpSha256/FfmpegSha256 должны быть 64-символьным hex.
 */
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const trustedPath = join(rootDir, 'Data', 'trusted_hashes.json')

const KNOWN_ROOT = new Set([
  'schema',
  'windows-x64',
  'YtDlpSha256',
  'FfmpegSha256',
  'YtDlpVersion',
  'FfmpegVersion'
])

const KNOWN_WX = new Set([
  'yt-dlp.exe',
  'ffmpeg.exe',
  'ffprobe.exe',
  'ffmpeg-master-latest-win64-gpl.zip',
  'ffmpeg-release-essentials.zip'
])

const LEGACY_STRING_KEYS = ['YtDlpSha256', 'FfmpegSha256', 'YtDlpVersion', 'FfmpegVersion']

function strictUnknown() {
  const v = process.env['FLUXALLOY_TRUSTED_HASHES_STRICT_UNKNOWN']
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function requireSha256Hex() {
  const v = process.env['FLUXALLOY_TRUSTED_HASHES_REQUIRE_SHA256_HEX']
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function isSha256Hex(s) {
  return /^[a-fA-F0-9]{64}$/.test(String(s).trim())
}

function printHelp() {
  console.log(`validate-trusted-hashes-json — структурная проверка Data/trusted_hashes.json

Переменные:
  FLUXALLOY_TRUSTED_HASHES_STRICT_UNKNOWN=1       ошибка при неизвестных ключах (по умолчанию — только предупреждение в stderr)
  FLUXALLOY_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1  непустые хеши — ровно 64 hex (windows-x64 + YtDlpSha256/FfmpegSha256)

Флаги: --help`)
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  let raw
  try {
    raw = await readFile(trustedPath, 'utf-8')
  } catch (e) {
    console.error(`[trusted-hashes] не удалось прочитать файл: ${trustedPath}`)
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
    return
  }

  let data
  try {
    data = JSON.parse(raw)
  } catch (e) {
    console.error('[trusted-hashes] невалидный JSON')
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
    return
  }

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    console.error('[trusted-hashes] корень должен быть объектом')
    process.exitCode = 1
    return
  }

  if (data.schema !== undefined && data.schema !== null) {
    if (typeof data.schema !== 'number' || !Number.isFinite(data.schema)) {
      console.error('[trusted-hashes] поле schema должно быть конечным числом, если задано')
      process.exitCode = 1
      return
    }
  }

  for (const k of LEGACY_STRING_KEYS) {
    if (data[k] !== undefined && data[k] !== null && typeof data[k] !== 'string') {
      console.error(`[trusted-hashes] поле ${k} должно быть строкой, если задано`)
      process.exitCode = 1
      return
    }
  }

  for (const k of ['YtDlpSha256', 'FfmpegSha256']) {
    const v = data[k]
    if (
      requireSha256Hex() &&
      typeof v === 'string' &&
      v.trim() !== '' &&
      !isSha256Hex(v)
    ) {
      console.error(
        `[trusted-hashes] поле ${k}: непустое значение должно быть 64-символьным hex SHA256`
      )
      process.exitCode = 1
      return
    }
  }

  let unknownCount = 0
  for (const k of Object.keys(data)) {
    if (!KNOWN_ROOT.has(k)) {
      const msg = `[trusted-hashes] неизвестный корневой ключ: "${k}"`
      if (strictUnknown()) {
        console.error(msg)
        unknownCount += 1
      } else {
        console.warn(msg)
      }
    }
  }

  const wx = data['windows-x64']
  if (wx !== undefined && wx !== null) {
    if (typeof wx !== 'object' || Array.isArray(wx)) {
      console.error('[trusted-hashes] поле windows-x64 должно быть объектом')
      process.exitCode = 1
      return
    }
    for (const [k, v] of Object.entries(wx)) {
      if (typeof v !== 'string') {
        console.error(`[trusted-hashes] windows-x64["${k}"] должен быть строкой`)
        process.exitCode = 1
        return
      }
      if (!KNOWN_WX.has(k)) {
        const msg = `[trusted-hashes] неизвестный ключ windows-x64["${k}"]`
        if (strictUnknown()) {
          console.error(msg)
          unknownCount += 1
        } else {
          console.warn(msg)
        }
      }
      if (requireSha256Hex() && v.trim() !== '' && !isSha256Hex(v)) {
        console.error(
          `[trusted-hashes] windows-x64["${k}"]: непустое значение должно быть 64-символьным hex SHA256`
        )
        process.exitCode = 1
        return
      }
    }
  }

  if (strictUnknown() && unknownCount > 0) {
    process.exitCode = 1
    return
  }

  console.log('[trusted-hashes] OK')
}

main().catch((e) => {
  console.error(e instanceof Error ? e.stack || e.message : String(e))
  process.exitCode = 1
})
