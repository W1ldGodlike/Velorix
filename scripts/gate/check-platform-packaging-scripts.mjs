/**
 * §19 — package.json scripts must expose names from platform-packaging-scripts.ts.
 * Node ESM: only leaf shared/*.ts (no transitive imports).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME,
  formatElectronViteEsmShimFixDiagnosticLine
} from '../../src/shared/electron-vite-build-meta.ts'
import {
  BUILD_LINUX_NPM_SCRIPT,
  PACK_LINUX_DIR_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  PLATFORM_PACKAGING_NPM_SCRIPTS,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT
} from '../../src/shared/platform-packaging-npm-scripts.ts'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'))
const scripts = packageJson.scripts ?? {}

const packMac = scripts[PACK_MAC_DIR_NPM_SCRIPT]
const verifyMac = scripts[VERIFY_MAC_UNPACKED_NPM_SCRIPT]
if (typeof packMac !== 'string' || !packMac.includes('electron-builder --mac --dir')) {
  console.error(
    `[check:platform-packaging-scripts] ${PACK_MAC_DIR_NPM_SCRIPT} must run electron-builder --mac --dir`
  )
  process.exit(1)
}
if (typeof verifyMac !== 'string' || !verifyMac.includes('verify-macos-unpacked-layout.mjs')) {
  console.error(
    `[check:platform-packaging-scripts] ${VERIFY_MAC_UNPACKED_NPM_SCRIPT} must invoke verify-macos-unpacked-layout.mjs`
  )
  process.exit(1)
}

const macVerifyPath = path.join(REPO_ROOT, 'scripts/release/verify-macos-unpacked-layout.mjs')
const macVerifyText = fs.readFileSync(macVerifyPath, 'utf8')
if (!macVerifyText.includes("process.platform !== 'darwin'")) {
  console.error(
    `[check:platform-packaging-scripts] ${macVerifyPath} must skip verify on non-darwin hosts`
  )
  process.exit(1)
}

const ciWorkflowPath = path.join(REPO_ROOT, '.github/workflows/ci.yml')
const ciWorkflowText = fs.readFileSync(ciWorkflowPath, 'utf8')
if (/\brun:\s*npm run pack:mac:dir\b/.test(ciWorkflowText)) {
  console.error(
    `[check:platform-packaging-scripts] ${ciWorkflowPath} must not run pack:mac:dir (local macOS only)`
  )
  process.exit(1)
}

const packLinux = scripts[PACK_LINUX_DIR_NPM_SCRIPT]
const verifyLinuxUnpacked = scripts[VERIFY_LINUX_UNPACKED_NPM_SCRIPT]
if (typeof packLinux !== 'string' || !packLinux.includes('electron-builder --linux --dir')) {
  console.error(
    `[check:platform-packaging-scripts] ${PACK_LINUX_DIR_NPM_SCRIPT} must run electron-builder --linux --dir`
  )
  process.exit(1)
}
if (
  typeof verifyLinuxUnpacked !== 'string' ||
  !verifyLinuxUnpacked.includes('verify-linux-unpacked-layout.mjs')
) {
  console.error(
    `[check:platform-packaging-scripts] ${VERIFY_LINUX_UNPACKED_NPM_SCRIPT} must invoke verify-linux-unpacked-layout.mjs`
  )
  process.exit(1)
}

const linuxUnpackedVerifyPath = path.join(
  REPO_ROOT,
  'scripts/release/verify-linux-unpacked-layout.mjs'
)
const linuxUnpackedVerifyText = fs.readFileSync(linuxUnpackedVerifyPath, 'utf8')
if (!linuxUnpackedVerifyText.includes("process.platform !== 'linux'")) {
  console.error(
    `[check:platform-packaging-scripts] ${linuxUnpackedVerifyPath} must skip verify on non-linux hosts`
  )
  process.exit(1)
}

if (!/\brun:\s*npm run pack:linux:dir\b/.test(ciWorkflowText)) {
  console.error(
    `[check:platform-packaging-scripts] ${ciWorkflowPath} must run pack:linux:dir in linux-packaging job`
  )
  process.exit(1)
}
if (!/\brun:\s*npm run verify:linux-unpacked\b/.test(ciWorkflowText)) {
  console.error(
    `[check:platform-packaging-scripts] ${ciWorkflowPath} must run verify:linux-unpacked in linux-packaging job`
  )
  process.exit(1)
}

const electronBuilderYmlPath = path.join(REPO_ROOT, 'electron-builder.yml')
const electronBuilderYmlText = fs.readFileSync(electronBuilderYmlPath, 'utf8')
for (const needle of [
  'mac:',
  'linux:',
  'dmg:',
  'appImage:',
  'AppImage',
  'deb',
  'notarize: false'
]) {
  if (!electronBuilderYmlText.includes(needle)) {
    console.error(
      `[check:platform-packaging-scripts] ${electronBuilderYmlPath} must include non-Windows target marker: ${needle}`
    )
    process.exit(1)
  }
}

const buildLinux = scripts[BUILD_LINUX_NPM_SCRIPT]
const verifyLinuxRelease = scripts[VERIFY_LINUX_RELEASE_NPM_SCRIPT]
if (typeof buildLinux !== 'string' || !buildLinux.includes('electron-builder --linux')) {
  console.error(
    `[check:platform-packaging-scripts] ${BUILD_LINUX_NPM_SCRIPT} must run electron-builder --linux`
  )
  process.exit(1)
}
if (
  typeof verifyLinuxRelease !== 'string' ||
  !verifyLinuxRelease.includes('verify-linux-release-artifacts.mjs')
) {
  console.error(
    `[check:platform-packaging-scripts] ${VERIFY_LINUX_RELEASE_NPM_SCRIPT} must invoke verify-linux-release-artifacts.mjs`
  )
  process.exit(1)
}

const linuxReleaseVerifyPath = path.join(
  REPO_ROOT,
  'scripts/release/verify-linux-release-artifacts.mjs'
)
const linuxReleaseVerifyText = fs.readFileSync(linuxReleaseVerifyPath, 'utf8')
if (!linuxReleaseVerifyText.includes("process.platform !== 'linux'")) {
  console.error(
    `[check:platform-packaging-scripts] ${linuxReleaseVerifyPath} must skip verify on non-linux hosts`
  )
  process.exit(1)
}

if (/\brun:\s*npm run build:linux\b/.test(ciWorkflowText)) {
  console.error(
    `[check:platform-packaging-scripts] ${ciWorkflowPath} must not run build:linux (local Linux release only)`
  )
  process.exit(1)
}
if (/\brun:\s*npm run verify:linux-release\b/.test(ciWorkflowText)) {
  console.error(
    `[check:platform-packaging-scripts] ${ciWorkflowPath} must not run verify:linux-release (local Linux release only)`
  )
  process.exit(1)
}

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
