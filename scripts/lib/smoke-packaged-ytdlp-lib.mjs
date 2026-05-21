/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export { listPackagedYtdlpCandidatePaths } from '../../src/shared/packaged-engine-candidate-paths.ts'

export { isMinimalYtdlpExtractorsOutput } from '../../src/shared/packaged-ytdlp-smoke.ts'

export { pickFirstExistingEngine } from './smoke-packaged-engine.mjs'
