/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export { listPackagedYtdlpCandidatePaths } from '../src/shared/packaged-engine-candidate-paths.ts'

export { isMinimalYtdlpExtractorsOutput } from '../src/shared/packaged-ytdlp-smoke.ts'

export { pickFirstExistingEngine } from './lib/smoke-packaged-engine.mjs'
