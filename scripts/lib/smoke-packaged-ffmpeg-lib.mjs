/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export { listPackagedFfmpegCandidatePaths } from '../../src/shared/packaged-engine-candidate-paths.ts'

export { isMinimalFfmpegEncodersOutput } from '../../src/shared/packaged-ffmpeg-smoke.ts'

export { pickFirstExistingEngine } from './smoke-packaged-engine.mjs'
