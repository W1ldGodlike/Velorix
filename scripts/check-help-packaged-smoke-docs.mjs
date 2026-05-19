/* eslint-disable @typescript-eslint/explicit-function-return-type */
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

const MAC_LINUX_HELP_FILES = PACKAGED_HELP_FILES.filter(
  (rel) => rel.includes('linux') || rel.includes('macos')
)

const BASE_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-manual-smoke-parity',
  'packaged-e2e-scenarios-registry',
  'e2e launch:',
  'present/missing',
  '§4.3',
  'owner:',
  '§21 packaged e2e (CI vs owner)'
]

const MAC_LINUX_SNIPPETS = ['engines:doctor', 'bin/README.md']

function checkFiles(files, snippets, label) {
  let failed = false
  for (const rel of files) {
    const file = path.join(REPO_ROOT, rel)
    const text = fs.readFileSync(file, 'utf8')
    const missing = snippets.filter((s) => !text.includes(s))
    if (missing.length > 0) {
      failed = true
      console.error(
        `[check:help-packaged-smoke-docs] ${label} ${rel} missing: ${missing.join(', ')}`
      )
    }
  }
  return failed
}

let failed = false
failed = checkFiles(PACKAGED_HELP_FILES, BASE_SNIPPETS, 'all') || failed
failed = checkFiles(MAC_LINUX_HELP_FILES, MAC_LINUX_SNIPPETS, 'mac/linux') || failed

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-packaged-smoke-docs] OK (${PACKAGED_HELP_FILES.length} files; all ${BASE_SNIPPETS.length} + mac/linux ${MAC_LINUX_SNIPPETS.length} snippets)`
)
