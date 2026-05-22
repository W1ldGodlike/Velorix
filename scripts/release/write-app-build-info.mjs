/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Записывает src/shared/app-build-info.json перед production build.
 * Dev: в репозитории закоммичен buildId "dev"; скрипт перезаписывает при npm run build.
 */
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'

function resolveBuildId() {
  const fromEnv = process.env.VELORIX_BUILD_ID
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim()
  }
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return 'unknown'
  }
}

const outPath = join(REPO_ROOT, 'src', 'shared', 'app-build-info.json')
const payload = {
  buildId: resolveBuildId(),
  builtAtUtc: new Date().toISOString()
}

writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
console.log(`[build-info] ${payload.buildId} @ ${payload.builtAtUtc}`)
