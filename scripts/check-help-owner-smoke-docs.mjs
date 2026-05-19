/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §15 Help — owner manual smoke + support ZIP articles cross-link §21 e2e registry.
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS,
  pickPackagedE2eHelpWorkflowCrosslinksCountSnippet
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const ABOUT_HELP_FILES = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ABOUT_HELP_PATHS]
const LOGGING_HELP_FILES = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_LOGGING_HELP_PATHS]
const PLANNER_HELP_FILES = [...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNER_HELP_PATHS]

const OWNER_SNIPPETS = [
  'packaged-e2e-scenarios-registry',
  'releaseSmoke:',
  'ownerManualSmoke:',
  '§21 e2e',
  'e2e launch:',
  '§21 packaged e2e (CI vs owner)',
  'formatPackagedManualSmokeE2eAppendixLines',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
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
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
]

const LOGGING_SNIPPETS = [
  'check:packaged-e2e-scenarios-registry',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  '§21 packaged e2e (CI vs owner)',
  'planned GUI e2e scope'
]

const PLANNER_SNIPPETS = [
  'owner-manual-smoke.md',
  'packaged-windows-smoke.md',
  'formatPackagedManualSmokeE2eAppendixLines',
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
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

function checkCrosslinksCount(rel, countSnippet, label) {
  const file = path.join(REPO_ROOT, rel)
  const text = fs.readFileSync(file, 'utf8')
  if (!text.includes(countSnippet)) {
    console.error(
      `[check:help-owner-smoke-docs] ${label} ${rel} missing crosslinks count: ${countSnippet}`
    )
    return true
  }
  return false
}

let failed = false
if (
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length !==
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_ANCHOR_PATHS.length +
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_ANCHOR_PATHS.length
) {
  console.error(
    '[check:help-owner-smoke-docs] COUNT_ANCHOR_PATHS out of sync with RU/EN anchor lists'
  )
  process.exit(1)
}
if (
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS.length !==
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS.length
) {
  console.error(
    '[check:help-owner-smoke-docs] OWNER_GUARD_HELP_PATHS out of sync with COUNT_ANCHOR_PATHS'
  )
  process.exit(1)
}
failed =
  checkFiles(
    [PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS[0]],
    OWNER_SNIPPETS,
    'owner-ru'
  ) || failed
failed =
  checkFiles(
    [PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS[1]],
    OWNER_SNIPPETS,
    'owner-en'
  ) || failed
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_ANCHOR_PATHS) {
  failed =
    checkCrosslinksCount(
      rel,
      pickPackagedE2eHelpWorkflowCrosslinksCountSnippet(rel),
      'anchor-count'
    ) || failed
}
failed = checkFiles(ABOUT_HELP_FILES, ABOUT_SNIPPETS, 'about') || failed
failed = checkFiles(LOGGING_HELP_FILES, LOGGING_SNIPPETS, 'logging') || failed
failed = checkFiles(PLANNER_HELP_FILES, PLANNER_SNIPPETS, 'planner') || failed

if (failed) {
  process.exit(1)
}
const fileCount = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS.length
console.log(
  `[check:help-owner-smoke-docs] OK (${fileCount} files; owner/about/logging/planner + crosslinks count anchors)`
)
