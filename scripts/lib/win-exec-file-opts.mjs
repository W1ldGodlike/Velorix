/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Shared `execFile` options for Windows engine/smoke scripts.
 */
/**
 * @param {{ timeout?: number, maxBuffer?: number }} [overrides]
 */
export function winEngineExecFileOpts(overrides = {}) {
  return {
    timeout: overrides.timeout ?? 120_000,
    windowsHide: true,
    maxBuffer: overrides.maxBuffer ?? 8 * 1024 * 1024
  }
}

/** ffprobe / ytdlp smoke defaults. */
export const WIN_ENGINE_EXE_OPTS = winEngineExecFileOpts()

/** ffmpeg smoke (`-encoders` output). */
export const WIN_ENGINE_EXE_OPTS_LARGE = winEngineExecFileOpts({
  maxBuffer: 16 * 1024 * 1024
})

/** packaged app exe smoke. */
export const WIN_ENGINE_EXE_OPTS_APP = winEngineExecFileOpts({
  timeout: 90_000,
  maxBuffer: 512 * 1024
})
