#!/usr/bin/env node
/**
 * ARCHIVE maintainer: numbered bullets lived in IMPLEMENTATION_CHECKLIST (now OLD).
 * Active checklist: docs/IMPLEMENTATION_NEON_CHECKLIST.md — no TZ § numbering.
 */
import { join } from 'node:path'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const CHECKLIST = join(REPO_ROOT, 'docs', 'archive', 'IMPLEMENTATION_CHECKLIST.OLD.md')

console.error(
  '[number-implementation-checklist] ARCHIVE only. Target:',
  CHECKLIST,
  '— use docs/IMPLEMENTATION_NEON_CHECKLIST.md for active sprint.'
)
process.exit(0)
