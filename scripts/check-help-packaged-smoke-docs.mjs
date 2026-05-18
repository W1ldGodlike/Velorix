/**
 * §15 Help — packaged smoke articles must cross-link owner bundle and parity guard.
 */
import fs from 'node:fs'
import path from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const PACKAGED_HELP_FILES = [
  'Help/packaged-windows-smoke.md',
  'Help/packaged-linux-smoke.md',
  'Help/packaged-macos-smoke.md',
  'Help/en/packaged-windows-smoke.md',
  'Help/en/packaged-linux-smoke.md',
  'Help/en/packaged-macos-smoke.md'
]

const REQUIRED_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-manual-smoke-parity',
  'packaged-e2e-scenarios-registry',
  'present/missing',
  '§4.3',
  'owner:'
]

let failed = false
for (const rel of PACKAGED_HELP_FILES) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  const missing = REQUIRED_SNIPPETS.filter((s) => !text.includes(s))
  if (missing.length > 0) {
    failed = true
    console.error(`[check:help-packaged-smoke-docs] ${rel} missing: ${missing.join(', ')}`)
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-packaged-smoke-docs] OK (${PACKAGED_HELP_FILES.length} files × ${REQUIRED_SNIPPETS.length} snippets)`
)
