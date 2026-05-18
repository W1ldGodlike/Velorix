/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.1 — после `npm run build:linux` проверяем AppImage + deb в `dist/`.
 * Не-Linux: exit 0 с пояснением.
 */
import { readdirSync } from 'node:fs'

import { REPO_ROOT } from './lib/repo-root.mjs'
import {
  collectLinuxReleaseArtifactFailures,
  distDirectory
} from './verify-linux-release-artifacts-lib.mjs'

function log(message) {
  console.log(`[pack:verify-linux-release] ${message}`)
}

function skipRequested() {
  const v = process.env.FLUXALLOY_SKIP_PACK_VERIFY
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function main() {
  if (process.argv.includes('--help')) {
    console.log(`verify-linux-release-artifacts — dist/*.AppImage и dist/*.deb после build:linux

Переменные:
  FLUXALLOY_SKIP_PACK_VERIFY=1   пропуск`)
    return
  }

  if (skipRequested()) {
    log('FLUXALLOY_SKIP_PACK_VERIFY — пропуск')
    return
  }

  if (process.platform !== 'linux') {
    log('не Linux — пропуск (ожидается после npm run build:linux на Linux)')
    return
  }

  const distDir = distDirectory(REPO_ROOT)
  const failures = collectLinuxReleaseArtifactFailures(distDir, {
    listDistFileNames: (dir) => {
      try {
        return readdirSync(dir)
      } catch {
        return []
      }
    }
  })
  if (failures.length > 0) {
    throw new Error(failures.join('\n'))
  }
  log('OK: dist/*.AppImage и dist/*.deb')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
