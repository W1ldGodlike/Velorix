/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §3 predev — Windows: `prepare-engines-win`; macOS/Linux: `prepare-engines-unix` if `bin/` empty, else verify hashes.
 */
import { stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { BUNDLED_UNIX_BIN_FILES } from './engines-bundled-sha256.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const binDir = join(rootDir, 'bin')

function runNodeScript(rel, args = []) {
  const scriptPath = join(rootDir, rel)
  const r = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: rootDir,
    stdio: 'inherit'
  })
  if (r.status !== 0) {
    process.exit(r.status ?? 1)
  }
}

async function unixBinsReady() {
  for (const { file } of BUNDLED_UNIX_BIN_FILES) {
    try {
      const s = await stat(join(binDir, file))
      if (!s.isFile() || s.size === 0) {
        return false
      }
    } catch {
      return false
    }
  }
  return true
}

async function main() {
  if (process.platform === 'win32') {
    runNodeScript('scripts/release/prepare-engines-win.mjs')
    return
  }
  const prepareKey = process.platform === 'darwin' ? 'mac' : 'linux'
  if (!(await unixBinsReady())) {
    runNodeScript('scripts/release/prepare-engines-unix.mjs', [prepareKey])
  }
  runNodeScript('scripts/release/verify-bundled-engines-hashes.mjs')
}

main().catch((error) => {
  console.error(
    `[predev] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
