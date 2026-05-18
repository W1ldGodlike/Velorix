/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Phase 7: IPC registry ↔ main handlers ↔ preload invoke; ARCHITECTURE inventory.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT, readRepoUtf8 } from './lib/repo-root.mjs'

const channelsText = readRepoUtf8('src/shared/ipc-channels.ts')

/** Main → renderer push (no ipcMain.handle). */
const PUSH_KEYS = new Set([
  'exportProgress',
  'exportBenchmarkProgress',
  'extractFramesProgress',
  'enginesProgress',
  'previewOpened',
  'themeChanged',
  'uiLocaleChanged',
  'openEnginePaths',
  'openSettings',
  'enginePathsChanged',
  'openAbout',
  'openExternalFilterScript',
  'openWorkflowPlanner',
  'openWorkflowScenarioBuilder',
  'workflowWatchFolderDetected',
  'workflowWatchFolderRunFinished',
  'settingsBackupImported',
  'processingHistoryChanged',
  'downloadsHistoryChanged',
  'mainWindowUiPanelsChanged',
  'downloadsWindowUiPanelsChanged',
  'downloadsOutputDirectoryChanged',
  'downloadsCliOptionsChanged',
  'batchExportSnapshot',
  'inspectorTargetMediaPath',
  'queueSnapshot',
  'log'
])

/** Renderer → main one-way (`ipcMain.on` + `ipcRenderer.send`). */
const MAIN_ON_KEYS = new Set(['logRenderer'])

function parseIpcObject(exportName) {
  const start = channelsText.indexOf(`export const ${exportName}`)
  if (start < 0) {
    throw new Error(`missing ${exportName} in ipc-channels.ts`)
  }
  const end = channelsText.indexOf('} as const', start)
  const block = channelsText.slice(start, end)
  const entries = new Map()
  for (const m of block.matchAll(/(\w+):\s*(?:\n\s*)?'([^']+)'/g)) {
    entries.set(m[1], m[2])
  }
  return entries
}

const mainWindow = parseIpcObject('mainWindowIpc')
const downloads = parseIpcObject('downloadsIpc')
const registry = new Map([...mainWindow, ...downloads].map(([k, v]) => [v, k]))

function walkTs(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) {
      walkTs(p, out)
    } else if (ent.name.endsWith('.ts')) {
      out.push(p)
    }
  }
  return out
}

function readTree(relDir) {
  return walkTs(join(REPO_ROOT, relDir))
    .map((p) => readFileSync(p, 'utf8'))
    .join('\n')
}

const mainText = readTree('src/main')
const preloadText = readTree('src/preload')
const settingsIpcText = readRepoUtf8('src/main/ipc/register-settings-ipc.ts')

const byFile = {}
const handleRe = /ipcMain\.handle\(/g
for (const file of walkTs(join(REPO_ROOT, 'src/main'))) {
  const body = readFileSync(file, 'utf8')
  const n = (body.match(handleRe) ?? []).length
  if (n > 0) {
    byFile[file.replace(/\\/g, '/').slice(REPO_ROOT.length + 1)] = n
  }
}

const rawHandleLines = Object.values(byFile).reduce((a, b) => a + b, 0)
const ffmpegLoopExtra =
  (readRepoUtf8('src/main/ipc/register-settings-ipc.ts').match(/channel:\s*mw\./g) ?? [])
    .length - 1
const handleTotal = rawHandleLines + Math.max(0, ffmpegLoopExtra)

function mainRegistersKey(key, scope) {
  const ref = scope === 'downloads' ? `d.${key}` : `mw.${key}`
  if (MAIN_ON_KEYS.has(key)) {
    return (
      mainText.includes(`ipcMain.on(${ref}`) ||
      mainText.includes(`ipcMain.on(\n    ${ref}`) ||
      mainText.includes(`ipcMain.on(\r\n    ${ref}`)
    )
  }
  if (
    scope === 'main' &&
    (settingsIpcText.includes(`channel: ${ref}`) ||
      settingsIpcText.includes(`channel: ${ref},`))
  ) {
    return true
  }
  return (
    mainText.includes(`ipcMain.handle(${ref}`) ||
    mainText.includes(`ipcMain.handle(\n    ${ref}`) ||
    mainText.includes(`ipcMain.handle(\r\n    ${ref}`)
  )
}

function preloadExposesKey(key, scope) {
  const ref = scope === 'downloads' ? `d.${key}` : `mw.${key}`
  if (MAIN_ON_KEYS.has(key)) {
    return preloadText.includes(`send(${ref}`)
  }
  return preloadText.includes(`invoke(${ref}`)
}

const missingMain = []
const missingPreload = []

for (const [key, channel] of mainWindow) {
  if (PUSH_KEYS.has(key) || MAIN_ON_KEYS.has(key)) {
    continue
  }
  if (!mainRegistersKey(key, 'main')) {
    missingMain.push(`mainWindowIpc.${key} (${channel})`)
  }
  if (!preloadExposesKey(key, 'main')) {
    missingPreload.push(`mainWindowIpc.${key} (${channel})`)
  }
}

for (const [key, channel] of downloads) {
  if (PUSH_KEYS.has(key)) {
    continue
  }
  if (!mainRegistersKey(key, 'downloads')) {
    missingMain.push(`downloadsIpc.${key} (${channel})`)
  }
  if (!preloadExposesKey(key, 'downloads')) {
    missingPreload.push(`downloadsIpc.${key} (${channel})`)
  }
}

const literalHandle = mainText.match(/ipcMain\.handle\(\s*['"]fluxalloy/g)
if (literalHandle?.length) {
  console.error(
    `[audit:ipc-architecture] FAIL: string-literal ipcMain.handle (${literalHandle.length}) — use ipc-channels.ts`
  )
  process.exit(1)
}

let failed = false
if (missingMain.length > 0) {
  failed = true
  console.error('[audit:ipc-architecture] invoke channels without ipcMain.handle in src/main/:')
  for (const line of missingMain) {
    console.error(`  ${line}`)
  }
}
if (missingPreload.length > 0) {
  failed = true
  console.error(
    '[audit:ipc-architecture] invoke channels without ipcRenderer.invoke/send in src/preload/:'
  )
  for (const line of missingPreload) {
    console.error(`  ${line}`)
  }
}

console.log(`[audit:ipc-architecture] registry channels: ${registry.size}`)
console.log(`[audit:ipc-architecture] push-only: ${PUSH_KEYS.size}`)
console.log(
  `[audit:ipc-architecture] invoke channels: ${registry.size - PUSH_KEYS.size} (main handle lines: ${rawHandleLines}, effective handles: ${handleTotal})`
)
for (const [f, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n}\t${f}`)
}

if (failed) {
  process.exit(1)
}

console.log('[audit:ipc-architecture] OK (registry ↔ main handle ↔ preload invoke)')
