import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const node = process.execPath

const SCRIPTS = [
  {
    path: 'scripts/smoke-packaged-app.mjs',
    envHint: 'FLUXALLOY_SKIP_APP_SMOKE'
  },
  {
    path: 'scripts/smoke-packaged-ffprobe.mjs',
    envHint: 'FLUXALLOY_SKIP_FFPROBE_SMOKE'
  },
  {
    path: 'scripts/smoke-packaged-ytdlp.mjs',
    envHint: 'FLUXALLOY_SKIP_YTDLP_SMOKE'
  },
  {
    path: 'scripts/smoke-packaged-ffmpeg.mjs',
    envHint: 'FLUXALLOY_SKIP_FFMPEG_SMOKE'
  }
] as const

describe('smoke-packaged scripts --help §19', () => {
  it.each(SCRIPTS)('$path --help exits 0', ({ path, envHint }) => {
    const result = spawnSync(node, [path, '--help'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      windowsHide: true
    })
    expect(result.status).toBe(0)
    expect(`${result.stdout ?? ''}${result.stderr ?? ''}`).toContain(envHint)
  })
})
