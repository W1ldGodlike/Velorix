/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Shared helpers for packaged-engine smoke scripts (`smoke-packaged-*-lib.mjs`).
 */
import { stat } from 'node:fs/promises'

/**
 * @param {string} path
 */
export async function isNonEmptyFile(path) {
  try {
    const s = await stat(path)
    return s.isFile() && s.size > 0
  } catch {
    return false
  }
}

/**
 * @param {readonly string[]} candidates
 */
export async function pickFirstExistingEngine(candidates) {
  for (const p of candidates) {
    if (await isNonEmptyFile(p)) {
      return p
    }
  }
  return null
}
