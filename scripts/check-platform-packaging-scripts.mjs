/**
 * §19 — package.json scripts must expose names from platform-packaging-scripts.ts.
 */
import fs from 'node:fs'
import path from 'node:path'

import { PLATFORM_PACKAGING_NPM_SCRIPTS } from '../src/shared/platform-packaging-scripts.ts'
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

console.log(
  `[check:platform-packaging-scripts] OK (${PLATFORM_PACKAGING_NPM_SCRIPTS.length} scripts)`
)
