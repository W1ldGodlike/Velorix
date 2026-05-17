/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export {
  isMinimalYtdlpExtractorsOutput,
  listPackagedYtdlpCandidatePaths
} from '../src/shared/packaged-ytdlp-smoke.ts'

export { pickFirstExistingEngine } from './lib/smoke-packaged-engine.mjs'
