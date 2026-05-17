/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §19 — smoke packaged app после `pack:dir`:
 * `FluxAlloy.exe` + непустой `resources/app.asar`, затем headless probe через
 * `ELECTRON_RUN_AS_NODE` (без GUI).
 *
 * `FLUXALLOY_SKIP_APP_SMOKE=1` — пропуск.
 * `FLUXALLOY_APP_SMOKE_NODE=0` — только stat exe/asar.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { REPO_ROOT } from './lib/repo-root.mjs'
import { WIN_ENGINE_EXE_OPTS_APP } from './lib/win-exec-file-opts.mjs'
import {
  isMinimalPackagedAppElectronVersionOutput,
  isNonEmptyFile,
  listPackagedAppExeCandidatePaths,
  packagedAppAsarPath,
  pickFirstExistingEngine
} from './smoke-packaged-app-lib.mjs'

const execFileAsync = promisify(execFile)
const rootDir = REPO_ROOT

function log(message) {
  console.log(`[app:smoke] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_APP_SMOKE
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function nodeProbeDisabled() {
  const v = process.env.FLUXALLOY_APP_SMOKE_NODE
  return v === '0' || (typeof v === 'string' && v.trim().toLowerCase() === 'false')
}

function printHelp() {
  console.log(`smoke-packaged-app — exe + app.asar + ELECTRON_RUN_AS_NODE probe

Переменные:
  FLUXALLOY_SKIP_APP_SMOKE=1     пропуск
  FLUXALLOY_APP_SMOKE_NODE=0     только stat exe/asar
  FLUXALLOY_APP_EXE_PATH         явный путь к FluxAlloy.exe

Флаги: --help`)
}

/**
 * @param {string} appExe
 */
async function runElectronNodeProbe(appExe) {
  const { stdout } = await execFileAsync(
    appExe,
    ['-e', 'process.stdout.write(String(process.versions.electron || "")); process.exit(0)'],
    {
      ...WIN_ENGINE_EXE_OPTS_APP,
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
    }
  )
  return stdout
}

async function main() {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_APP_SMOKE — пропуск')
    return
  }

  if (process.platform !== 'win32') {
    log('не Windows — пропуск (ожидается dist/win-unpacked после pack:dir на Win)')
    return
  }

  const appExe = await pickFirstExistingEngine(listPackagedAppExeCandidatePaths(rootDir))
  if (appExe === null) {
    throw new Error(
      `FluxAlloy.exe не найден. Сначала: npm run build && npm run pack:dir (или npm run check:release), либо FLUXALLOY_APP_EXE_PATH.`
    )
  }
  log(`exe: ${appExe}`)

  const asarPath = packagedAppAsarPath(rootDir)
  if (!(await isNonEmptyFile(asarPath))) {
    throw new Error(`Нет или пустой ${asarPath}`)
  }
  log(`asar: ${asarPath}`)

  if (nodeProbeDisabled()) {
    log('FLUXALLOY_APP_SMOKE_NODE=0 — только stat')
    return
  }

  log('ELECTRON_RUN_AS_NODE probe…')
  const out = await runElectronNodeProbe(appExe)
  if (!isMinimalPackagedAppElectronVersionOutput(out)) {
    throw new Error(`Неожиданный вывод Electron probe: ${JSON.stringify(out)}`)
  }
  log(`OK: Electron ${out.trim()}`)
}

main().catch((error) => {
  console.error(
    `[app:smoke] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
