/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §15 Help — owner manual smoke + support ZIP articles cross-link §21 e2e registry.
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const OWNER_HELP_FILES = ['Help/owner-manual-smoke.md', 'Help/en/owner-manual-smoke.md']

const ABOUT_HELP_FILES = ['Help/about-support-logs.md', 'Help/en/about-support-logs.md']

const LOGGING_HELP_FILES = ['Help/logging-and-diagnostics.md', 'Help/en/logging-and-diagnostics.md']

const PLANNER_HELP_FILES = [
  'Help/workflows-planner-scenarios.md',
  'Help/en/workflows-planner-scenarios.md'
]

const OWNER_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  '§21 e2e',
  'e2e launch:',
  '§21 packaged e2e (CI vs owner)',
  'formatPackagedManualSmokeE2eAppendixLines',
  'check:help-workflow-smoke-crosslinks'
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
  'appendPackagedManualSmokeE2ePlanLines',
  'check:help-workflow-smoke-crosslinks'
]

const LOGGING_SNIPPETS = [
  'check:packaged-e2e-scenarios-registry',
  'check:help-workflow-smoke-crosslinks',
  '§21 packaged e2e (CI vs owner)',
  'planned GUI e2e scope'
]

const PLANNER_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  'formatPackagedManualSmokeE2eAppendixLines',
  'check:help-workflow-smoke-crosslinks'
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

function checkCrosslinksCount(files, countSnippet, label) {
  let failed = false
  for (const rel of files) {
    const file = path.join(REPO_ROOT, rel)
    const text = fs.readFileSync(file, 'utf8')
    if (!text.includes(countSnippet)) {
      failed = true
      console.error(
        `[check:help-owner-smoke-docs] ${label} ${rel} missing crosslinks count: ${countSnippet}`
      )
    }
  }
  return failed
}

let failed = false
failed = checkFiles(['Help/owner-manual-smoke.md'], OWNER_SNIPPETS, 'owner-ru') || failed
failed =
  checkCrosslinksCount(
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
    'anchor-ru-count'
  ) || failed
failed = checkFiles(['Help/en/owner-manual-smoke.md'], OWNER_SNIPPETS, 'owner-en') || failed
failed =
  checkCrosslinksCount(
    [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS],
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
    'anchor-en-count'
  ) || failed
failed = checkFiles(ABOUT_HELP_FILES, ABOUT_SNIPPETS, 'about') || failed
failed = checkFiles(LOGGING_HELP_FILES, LOGGING_SNIPPETS, 'logging') || failed
failed = checkFiles(PLANNER_HELP_FILES, PLANNER_SNIPPETS, 'planner') || failed

if (failed) {
  process.exit(1)
}
const fileCount =
  OWNER_HELP_FILES.length +
  ABOUT_HELP_FILES.length +
  LOGGING_HELP_FILES.length +
  PLANNER_HELP_FILES.length
console.log(
  `[check:help-owner-smoke-docs] OK (${fileCount} files; owner/about/logging/planner + crosslinks count anchors)`
)
