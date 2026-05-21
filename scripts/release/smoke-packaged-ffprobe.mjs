/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §9/§19 — smoke bundled ffprobe после `pack:dir` или из dev `bin/`:
 * `-version`, затем JSON probe короткого lavfi-клипа (ffmpeg в том же каталоге).
 *
 * `FLUXALLOY_SKIP_FFPROBE_SMOKE=1` — пропуск.
 * `FLUXALLOY_FFPROBE_SMOKE_PROBE=0` — только `-version`, без генерации клипа.
 */
import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { firstVersionLineFromWinEngineExe } from './engines-exe-version-line.mjs'
import { REPO_ROOT } from '../lib/repo-root.mjs'
import { WIN_ENGINE_EXE_OPTS } from '../lib/win-exec-file-opts.mjs'
const execFileAsync = promisify(execFile)
const rootDir = REPO_ROOT

function log(message) {
  console.log(`[ffprobe:smoke] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_FFPROBE_SMOKE
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function probeDisabled() {
  const v = process.env.FLUXALLOY_FFPROBE_SMOKE_PROBE
  return v === '0' || (typeof v === 'string' && v.trim().toLowerCase() === 'false')
}

function printHelp() {
  console.log(`smoke-packaged-ffprobe — version + JSON probe bundled ffprobe

Переменные:
  FLUXALLOY_SKIP_FFPROBE_SMOKE=1     пропуск
  FLUXALLOY_FFPROBE_SMOKE_PROBE=0    только -version
  FLUXALLOY_FFPROBE_PATH / FLUXALLOY_FFMPEG_PATH  явные пути

Флаги: --help`)
}

/**
 * @param {string} ffmpegPath
 * @param {string} destPath
 */
async function synthesizeSmokeClip(ffmpegPath, destPath) {
  await execFileAsync(
    ffmpegPath,
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'testsrc2=size=160x90:rate=24:duration=0.25',
      '-f',
      'lavfi',
      '-i',
      'sine=frequency=1000:duration=0.25',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-shortest',
      destPath
    ],
    WIN_ENGINE_EXE_OPTS
  )
}

/**
 * @param {string} ffprobePath
 * @param {string} mediaPath
 */
async function runFfprobeJsonProbe(ffprobePath, mediaPath) {
  const { stdout } = await execFileAsync(
    ffprobePath,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-show_format',
      '-show_streams',
      '-of',
      'json',
      mediaPath
    ],
    WIN_ENGINE_EXE_OPTS
  )
  return JSON.parse(stdout)
}

async function run() {
  const {
    isMinimalFfprobeProbeJson,
    isPackagedFfprobeProbeJsonParsableForSmoke,
    listPackagedFfmpegCandidatePaths,
    listPackagedFfprobeCandidatePaths,
    pickFirstExistingEngine
  } = await import('../lib/smoke-packaged-ffprobe-lib.mjs')

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_FFPROBE_SMOKE — пропуск')
    return
  }

  if (process.platform !== 'win32') {
    log('не Windows — пропуск (ожидается bundled ffprobe.exe после pack:dir на Win)')
    return
  }

  const ffprobePath = await pickFirstExistingEngine(listPackagedFfprobeCandidatePaths(rootDir))
  if (ffprobePath === null) {
    throw new Error(
      'ffprobe не найден. Выполните npm run engines:prepare:win и/или npm run pack:dir, либо задайте FLUXALLOY_FFPROBE_PATH.'
    )
  }

  const versionLine = await firstVersionLineFromWinEngineExe(ffprobePath, 'ffprobe.exe')
  if (versionLine.length === 0) {
    throw new Error(`Пустой вывод ffprobe -version (${ffprobePath})`)
  }
  log(`version: ${versionLine} (${ffprobePath})`)

  if (probeDisabled()) {
    log('FLUXALLOY_FFPROBE_SMOKE_PROBE=0 — только version')
    return
  }

  const ffmpegPath = await pickFirstExistingEngine(listPackagedFfmpegCandidatePaths(rootDir))
  if (ffmpegPath === null) {
    throw new Error(
      'ffmpeg не найден для lavfi-клипа. Выполните npm run engines:prepare:win или задайте FLUXALLOY_FFMPEG_PATH.'
    )
  }

  const workDir = await mkdtemp(join(tmpdir(), 'fa-ffprobe-smoke-'))
  const clipPath = join(workDir, 'smoke.mp4')
  try {
    log('генерация lavfi-клипа…')
    await synthesizeSmokeClip(ffmpegPath, clipPath)
    log('ffprobe JSON probe…')
    const parsed = await runFfprobeJsonProbe(ffprobePath, clipPath)
    if (!isMinimalFfprobeProbeJson(parsed)) {
      throw new Error('ffprobe JSON не содержит format и streams')
    }
    if (!isPackagedFfprobeProbeJsonParsableForSmoke(parsed)) {
      throw new Error(
        'ffprobe JSON: container registry или stream detail (duration_ts, time_base, start_time)'
      )
    }
    const streams = /** @type {{ streams: unknown[] }} */ (parsed).streams
    log(`OK: probe ${streams.length} stream(s), format + stream detail smoke`)
  } finally {
    await rm(workDir, { recursive: true, force: true })
  }
}

if (process.argv.includes('--help')) {
  printHelp()
} else {
  run().catch((error) => {
    console.error(
      `[ffprobe:smoke] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
    )
    process.exitCode = 1
  })
}
