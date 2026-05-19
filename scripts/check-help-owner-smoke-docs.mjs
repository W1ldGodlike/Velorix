/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §15 Help — owner manual smoke + support ZIP articles cross-link §21 e2e registry.
 */
import fs from 'node:fs'
import path from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const OWNER_HELP_FILES = ['Help/owner-manual-smoke.md', 'Help/en/owner-manual-smoke.md']

const ABOUT_HELP_FILES = ['Help/about-support-logs.md', 'Help/en/about-support-logs.md']

const OWNER_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  '§21 e2e',
  'e2e launch:',
  '§21 packaged e2e (CI vs owner)',
  'formatPackagedManualSmokeE2eAppendixLines'
]

const ABOUT_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  '§21 e2e',
  'e2e <id>:',
  'win-unpacked',
  'linux-unpacked',
  'FluxAlloy.app',
  'present/missing',
  '§21 packaged e2e (CI vs owner)',
  'appendPackagedManualSmokeE2ePlanLines'
]

function checkFiles(files, snippets, label) {
  let failed = false
  for (const rel of files) {
    const file = path.join(REPO_ROOT, rel)
    const text = fs.readFileSync(file, 'utf8')
    const missing = snippets.filter((s) => !text.includes(s))
    if (missing.length > 0) {
      failed = true
      console.error(`[check:help-owner-smoke-docs] ${label} ${rel} missing: ${missing.join(', ')}`)
    }
  }
  return failed
}

let failed = false
failed =
  checkFiles(['Help/owner-manual-smoke.md'], [...OWNER_SNIPPETS, '34 статьи'], 'owner-ru') || failed
failed =
  checkFiles(['Help/en/owner-manual-smoke.md'], [...OWNER_SNIPPETS, '34 articles'], 'owner-en') ||
  failed
failed = checkFiles(ABOUT_HELP_FILES, ABOUT_SNIPPETS, 'about') || failed

if (failed) {
  process.exit(1)
}
const fileCount = OWNER_HELP_FILES.length + ABOUT_HELP_FILES.length
console.log(`[check:help-owner-smoke-docs] OK (${fileCount} files; owner + about layout snippets)`)
