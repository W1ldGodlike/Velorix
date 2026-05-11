/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Проверка структуры `Data/trusted_hashes.json` (§3/§19): валидный JSON, корневой объект,
 * секция `windows-x64` — только объект со строковыми значениями (пустая строка допустима).
 */
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const trustedPath = join(rootDir, 'Data', 'trusted_hashes.json')

function printHelp() {
  console.log(`validate-trusted-hashes-json — структурная проверка Data/trusted_hashes.json

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
    }
  }

  console.log('[trusted-hashes] OK')
}

main().catch((e) => {
  console.error(e instanceof Error ? e.stack || e.message : String(e))
  process.exitCode = 1
})
