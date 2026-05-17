/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export {
  isMinimalFfprobeProbeJson,
  isPackagedFfprobeProbeJsonParsableByContainerRegistry,
  listPackagedFfmpegCandidatePaths,
  listPackagedFfprobeCandidatePaths
} from '../src/shared/packaged-ffprobe-smoke.ts'

export { isNonEmptyFile, pickFirstExistingEngine } from './lib/smoke-packaged-engine.mjs'
