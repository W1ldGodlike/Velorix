/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** Re-export для smoke-скрипта (реализация в shared — Vitest/typecheck). */
export {
  isMinimalFfmpegEncodersOutput,
  listPackagedFfmpegCandidatePaths
} from '../src/shared/packaged-ffmpeg-smoke.ts'

export { pickFirstExistingEngine } from './lib/smoke-packaged-engine.mjs'
