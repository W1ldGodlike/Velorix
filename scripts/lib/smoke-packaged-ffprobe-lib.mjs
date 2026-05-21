/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export {
  listPackagedFfmpegCandidatePaths,
  listPackagedFfprobeCandidatePaths
} from '../../src/shared/packaged-engine-candidate-paths.ts'

export {
  isMinimalFfprobeProbeJson,
  isPackagedFfprobeProbeJsonParsableByContainerRegistry,
  isPackagedFfprobeProbeJsonParsableForSmoke,
  isPackagedFfprobeProbeJsonParsableByStreamDetailFields
} from '../../src/shared/packaged-ffprobe-smoke.ts'

export { isNonEmptyFile, pickFirstExistingEngine } from './smoke-packaged-engine.mjs'
