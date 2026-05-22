/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Общая логика §3/§19: первая строка вывода `--version` / `-version` для Windows exe в `bin/` или `userData/bin`.
 * Используется `verify-bundled-engines-hashes` и `report-bundled-engines-hashes`, чтобы не дублировать `execFile`.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const WIN_EXE_OPTS = {
  timeout: 12_000,
  windowsHide: true,
  maxBuffer: 512 * 1024
}

function versionArgsForBaseName(baseName) {
  const bn = baseName.toLowerCase()
  return bn === 'yt-dlp.exe' || bn === 'yt-dlp' ? ['--version'] : ['-version']
}

export async function firstVersionLineFromEngineBinary(exePath, baseName) {
  const { stdout } = await execFileAsync(exePath, versionArgsForBaseName(baseName), WIN_EXE_OPTS)
  return (
    stdout
      .split(/\r?\n/)
      .find((l) => l.trim())
      ?.trim() ?? ''
  )
}

export async function tryFirstVersionLineFromEngineBinary(exePath, baseName) {
  try {
    const line = await firstVersionLineFromEngineBinary(exePath, baseName)
    return { ok: true, line }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

/** @deprecated use firstVersionLineFromEngineBinary */
export async function firstVersionLineFromWinEngineExe(exePath, baseName) {
  return firstVersionLineFromEngineBinary(exePath, baseName)
}

/** @deprecated use tryFirstVersionLineFromEngineBinary */
export async function tryFirstVersionLineFromWinEngineExe(exePath, baseName) {
  return tryFirstVersionLineFromEngineBinary(exePath, baseName)
}
