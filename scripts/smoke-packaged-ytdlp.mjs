/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §6/§19 — smoke bundled yt-dlp после `pack:dir` или из dev `bin/`:
 * `--version`, затем offline `--list-extractors`.
 *
 * `FLUXALLOY_SKIP_YTDLP_SMOKE=1` — пропуск.
 * `FLUXALLOY_YTDLP_SMOKE_EXTRACTORS=0` — только `--version`.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { firstVersionLineFromWinEngineExe } from './engines-exe-version-line.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'
import { WIN_ENGINE_EXE_OPTS } from './lib/win-exec-file-opts.mjs'
const execFileAsync = promisify(execFile)
const rootDir = REPO_ROOT

function log(message) {
  console.log(`[ytdlp:smoke] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_YTDLP_SMOKE
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function extractorsDisabled() {
  const v = process.env.FLUXALLOY_YTDLP_SMOKE_EXTRACTORS
  return v === '0' || (typeof v === 'string' && v.trim().toLowerCase() === 'false')
}

function printHelp() {
  console.log(`smoke-packaged-ytdlp — version + offline extractors list

Переменные:
  FLUXALLOY_SKIP_YTDLP_SMOKE=1          пропуск
  FLUXALLOY_YTDLP_SMOKE_EXTRACTORS=0    только --version
  FLUXALLOY_YTDLP_PATH                  явный путь

Флаги: --help`)
}

/**
 * @param {string} ytdlpPath
 */
async function runListExtractors(ytdlpPath) {
  const { stdout } = await execFileAsync(ytdlpPath, ['--list-extractors'], WIN_ENGINE_EXE_OPTS)
  return stdout
}

async function run() {
  const {
    isMinimalYtdlpExtractorsOutput,
    listPackagedYtdlpCandidatePaths,
    pickFirstExistingEngine
  } = await import('./smoke-packaged-ytdlp-lib.mjs')

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_YTDLP_SMOKE — пропуск')
    return
  }

  if (process.platform !== 'win32') {
    log('не Windows — пропуск (ожидается bundled yt-dlp.exe после pack:dir на Win)')
    return
  }

  const ytdlpPath = await pickFirstExistingEngine(listPackagedYtdlpCandidatePaths(rootDir))
  if (ytdlpPath === null) {
    throw new Error(
      'yt-dlp не найден. Выполните npm run engines:prepare:win и/или npm run pack:dir, либо задайте FLUXALLOY_YTDLP_PATH.'
    )
  }

  const versionLine = await firstVersionLineFromWinEngineExe(ytdlpPath, 'yt-dlp.exe')
  if (versionLine.length === 0) {
    throw new Error(`Пустой вывод yt-dlp --version (${ytdlpPath})`)
  }
  log(`version: ${versionLine} (${ytdlpPath})`)

  if (extractorsDisabled()) {
    log('FLUXALLOY_YTDLP_SMOKE_EXTRACTORS=0 — только version')
    return
  }

  log('--list-extractors…')
  const listing = await runListExtractors(ytdlpPath)
  if (!isMinimalYtdlpExtractorsOutput(listing)) {
    throw new Error('yt-dlp --list-extractors вернул слишком короткий список')
  }
  const count = listing
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('[')).length
  log(`OK: ${count} extractor name(s)`)
}

if (process.argv.includes('--help')) {
  printHelp()
} else {
  run().catch((error) => {
    console.error(
      `[ytdlp:smoke] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
    )
    process.exitCode = 1
  })
}
