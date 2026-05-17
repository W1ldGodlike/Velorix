/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
import { stat } from 'node:fs/promises'

export {
  isMinimalFfprobeProbeJson,
  isPackagedFfprobeProbeJsonParsableByContainerRegistry,
  listPackagedFfmpegCandidatePaths,
  listPackagedFfprobeCandidatePaths
} from '../src/shared/packaged-ffprobe-smoke.ts'

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
