/**
 * §19 — package.json scripts must expose names from platform-packaging-scripts.ts.
 * Node ESM: only leaf shared/*.ts (no transitive imports).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME,
  formatElectronViteEsmShimFixDiagnosticLine
} from '../src/shared/electron-vite-build-meta.ts'
import { PLATFORM_PACKAGING_NPM_SCRIPTS } from '../src/shared/platform-packaging-npm-scripts.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'))
const scripts = packageJson.scripts ?? {}

const missing = PLATFORM_PACKAGING_NPM_SCRIPTS.filter((name) => typeof scripts[name] !== 'string')
if (missing.length > 0) {
  console.error(
    `[check:platform-packaging-scripts] package.json missing scripts: ${missing.join(', ')}`
  )
  process.exit(1)
}

const evConfigPath = path.join(REPO_ROOT, 'electron.vite.config.ts')
const evConfigText = fs.readFileSync(evConfigPath, 'utf8')
if (
  !evConfigText.includes('electron-vite-build-meta') ||
  !evConfigText.includes('ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME')
) {
  console.error(
    `[check:platform-packaging-scripts] ${evConfigPath} must import ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME from electron-vite-build-meta (${ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME})`
  )
  process.exit(1)
}

const packagingScriptsPath = path.join(REPO_ROOT, 'src/shared/platform-packaging-scripts.ts')
const packagingScriptsText = fs.readFileSync(packagingScriptsPath, 'utf8')
if (!packagingScriptsText.includes('formatElectronViteEsmShimFixDiagnosticLine()')) {
  console.error(
    `[check:platform-packaging-scripts] ${packagingScriptsPath} must call formatElectronViteEsmShimFixDiagnosticLine()`
  )
  process.exit(1)
}
const esmDiag = formatElectronViteEsmShimFixDiagnosticLine()
if (!packagingScriptsText.includes('electron-vite-build-meta')) {
  console.error(
    `[check:platform-packaging-scripts] ${packagingScriptsPath} must import electron-vite-build-meta`
  )
  process.exit(1)
}

console.log(
  `[check:platform-packaging-scripts] OK (${PLATFORM_PACKAGING_NPM_SCRIPTS.length} scripts; ${ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME}; ${esmDiag})`
)
