/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §7/§19 — smoke bundled ffmpeg после `pack:dir` или из dev `bin/`:
 * `-version`, затем offline `-encoders`.
 *
 * `FLUXALLOY_SKIP_FFMPEG_SMOKE=1` — пропуск.
 * `FLUXALLOY_FFMPEG_SMOKE_ENCODERS=0` — только `-version`.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { firstVersionLineFromWinEngineExe } from './engines-exe-version-line.mjs'
import { REPO_ROOT } from './lib/repo-root.mjs'
import { WIN_ENGINE_EXE_OPTS_LARGE } from './lib/win-exec-file-opts.mjs'
import {
  isMinimalFfmpegEncodersOutput,
  listPackagedFfmpegCandidatePaths,
  pickFirstExistingEngine
} from './smoke-packaged-ffmpeg-lib.mjs'

const execFileAsync = promisify(execFile)
const rootDir = REPO_ROOT

function log(message) {
  console.log(`[ffmpeg:smoke] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_FFMPEG_SMOKE
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function encodersDisabled() {
  const v = process.env.FLUXALLOY_FFMPEG_SMOKE_ENCODERS
  return v === '0' || (typeof v === 'string' && v.trim().toLowerCase() === 'false')
}

function printHelp() {
  console.log(`smoke-packaged-ffmpeg — version + offline encoders list

Переменные:
  FLUXALLOY_SKIP_FFMPEG_SMOKE=1       пропуск
  FLUXALLOY_FFMPEG_SMOKE_ENCODERS=0   только -version
  FLUXALLOY_FFMPEG_PATH               явный путь

Флаги: --help`)
}

/**
 * @param {string} ffmpegPath
 */
async function runEncodersList(ffmpegPath) {
  const { stdout } = await execFileAsync(
    ffmpegPath,
    ['-hide_banner', '-encoders'],
    WIN_ENGINE_EXE_OPTS_LARGE
  )
  return stdout
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_FFMPEG_SMOKE — пропуск')
    return
  }

  if (process.platform !== 'win32') {
    log('не Windows — пропуск (ожидается bundled ffmpeg.exe после pack:dir на Win)')
    return
  }

  const ffmpegPath = await pickFirstExistingEngine(listPackagedFfmpegCandidatePaths(rootDir))
  if (ffmpegPath === null) {
    throw new Error(
      'ffmpeg не найден. Выполните npm run engines:prepare:win и/или npm run pack:dir, либо задайте FLUXALLOY_FFMPEG_PATH.'
    )
  }

  const versionLine = await firstVersionLineFromWinEngineExe(ffmpegPath, 'ffmpeg.exe')
  if (versionLine.length === 0) {
    throw new Error(`Пустой вывод ffmpeg -version (${ffmpegPath})`)
  }
  log(`version: ${versionLine} (${ffmpegPath})`)

  if (encodersDisabled()) {
    log('FLUXALLOY_FFMPEG_SMOKE_ENCODERS=0 — только version')
    return
  }

  log('-encoders…')
  const listing = await runEncodersList(ffmpegPath)
  if (!isMinimalFfmpegEncodersOutput(listing)) {
    throw new Error('ffmpeg -encoders вернул слишком короткий список')
  }
  log('OK: encoders list')
}

main().catch((error) => {
  console.error(
    `[ffmpeg:smoke] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
