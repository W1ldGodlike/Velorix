/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §15 Help — packaged smoke articles must cross-link owner bundle and parity guard.
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
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

const WINDOWS_SNIPPETS = [...BASE_SNIPPETS, 'check:help-workflow-smoke-crosslinks']

const WINDOWS_PACKAGED_HELP_FILES = PACKAGED_HELP_FILES.filter((rel) => rel.includes('windows'))

const NON_WINDOWS_PACKAGED_HELP_FILES = PACKAGED_HELP_FILES.filter(
  (rel) => !rel.includes('windows')
)

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

function checkCrosslinksCount(rel, countSnippet, label) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  if (!text.includes(countSnippet)) {
    console.error(
      `[check:help-packaged-smoke-docs] ${label} ${rel} missing crosslinks count: ${countSnippet}`
    )
    return true
  }
  return false
}

let failed = false
failed = checkFiles(WINDOWS_PACKAGED_HELP_FILES, WINDOWS_SNIPPETS, 'windows') || failed
failed = checkFiles(NON_WINDOWS_PACKAGED_HELP_FILES, BASE_SNIPPETS, 'mac/linux-base') || failed
failed = checkFiles(MAC_LINUX_HELP_FILES, MAC_LINUX_SNIPPETS, 'mac/linux') || failed
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PACKAGED_WIN_PATHS) {
  const countSnippet = rel.includes('/en/')
    ? PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
    : PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
  failed = checkCrosslinksCount(rel, countSnippet, 'win-count') || failed
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:help-packaged-smoke-docs] OK (${PACKAGED_HELP_FILES.length} files; win ${WINDOWS_SNIPPETS.length} + mac/linux ${BASE_SNIPPETS.length}/${MAC_LINUX_SNIPPETS.length} snippets; win crosslinks count)`
)
