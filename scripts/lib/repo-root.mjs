/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Repo root helpers for maint/split/audit scripts under `scripts/`.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Absolute path to repository root (`package.json` directory). */
export const REPO_ROOT = join(__dirname, '../..')

/** Absolute path to `scripts/`. */
export const SCRIPTS_DIR = join(REPO_ROOT, 'scripts')

/**
 * @param {string} relPath path relative to repo root (posix slashes)
 */
export function readRepoUtf8(relPath) {
  return readFileSync(join(REPO_ROOT, relPath), 'utf8')
}

/**
 * @param {string} relPath path relative to repo root (posix slashes)
 */
export function readRepoLines(relPath) {
  return readRepoUtf8(relPath).split(/\r?\n/)
}
