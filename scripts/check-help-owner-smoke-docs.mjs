/**
 * §15 Help — owner manual smoke + support ZIP articles cross-link §21 e2e registry.
 */
import fs from 'node:fs'
import path from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const OWNER_HELP_FILES = [
  'Help/owner-manual-smoke.md',
  'Help/en/owner-manual-smoke.md',
  'Help/about-support-logs.md',
  'Help/en/about-support-logs.md'
]

const REQUIRED_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  '§21 e2e'
]

let failed = false
for (const rel of OWNER_HELP_FILES) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  const missing = REQUIRED_SNIPPETS.filter((s) => !text.includes(s))
  if (missing.length > 0) {
    failed = true
    console.error(`[check:help-owner-smoke-docs] ${rel} missing: ${missing.join(', ')}`)
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-owner-smoke-docs] OK (${OWNER_HELP_FILES.length} files × ${REQUIRED_SNIPPETS.length} snippets)`
)
