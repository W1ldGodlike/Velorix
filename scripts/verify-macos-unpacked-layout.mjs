/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** §2.1 — после pack:mac:dir проверяем dist/mac-arm64/FluxAlloy.app (stat-only). */
import { stat } from 'node:fs/promises'

import { REPO_ROOT } from './lib/repo-root.mjs'
import {
  collectMacosUnpackedLayoutFailures,
  macosAppBundleCandidates,
  resolveMacosAppBundleRoot
} from './verify-macos-unpacked-layout-lib.mjs'

function log(message) {
  console.log(`[pack:verify-mac] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_PACK_VERIFY
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

async function fileNonEmpty(path) {
  try {
    const s = await stat(path)
    return s.isFile() && s.size > 0
  } catch {
    return false
  }
}

async function dirExists(path) {
  try {
    const s = await stat(path)
    return s.isDirectory()
  } catch {
    return false
  }
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log(`verify-macos-unpacked-layout — FluxAlloy.app после pack:mac:dir

Переменные:
  FLUXALLOY_SKIP_PACK_VERIFY=1   пропуск`)
    return
  }

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_PACK_VERIFY — пропуск')
    return
  }

  if (process.platform !== 'darwin') {
    log('не macOS — пропуск (ожидается после npm run pack:mac:dir на macOS)')
    return
  }

  const deps = { fileNonEmpty, dirExists }
  const candidates = macosAppBundleCandidates(REPO_ROOT)
  const bundleRoot = await resolveMacosAppBundleRoot(candidates, deps)
  if (bundleRoot === null) {
    throw new Error(
      `Не найден ${candidates.map((c) => c.split(/[/\\]/).slice(-2).join('/')).join(' или ')}. Сначала: npm run build && npm run pack:mac:dir.`
    )
  }

  const failures = await collectMacosUnpackedLayoutFailures(bundleRoot, deps)
  if (failures.length > 0) {
    throw new Error(failures.join('\n'))
  }

  log(`OK: ${bundleRoot}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
