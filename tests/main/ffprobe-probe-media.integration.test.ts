import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { execPath } from 'node:process'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import type { AppPaths } from '../../src/main/app-paths'
import { probeMediaFile } from '../../src/main/ffprobe-service'

function tmpAppPaths(): { paths: AppPaths; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), 'flux-probe-'))
  const userData = join(root, 'userdata')
  const bundledBin = join(root, 'bundled-bin')
  const userBin = join(root, 'user-bin')
  mkdirSync(userData, { recursive: true })
  mkdirSync(bundledBin, { recursive: true })
  mkdirSync(userBin, { recursive: true })
  const paths: AppPaths = {
    appRoot: root,
    resources: root,
    userData,
    appTemp: join(userData, 'temp'),
    bundledBin,
    userBin
  }
  return {
    paths,
    cleanup: (): void => {
      rmSync(root, { recursive: true, force: true })
    }
  }
}

describe('probeMediaFile smoke', () => {
  it('ok:false когда ffprobe отсутствует на bundled/user путях', async () => {
    const { paths, cleanup } = tmpAppPaths()
    try {
      const media = join(paths.appRoot, 'clip.mp4')
      writeFileSync(media, '')
      const r = await probeMediaFile(paths, media)
      expect(r.ok).toBe(false)
      if (!r.ok) {
        expect(r.error).toMatch(/ffprobe/i)
      }
    } finally {
      cleanup()
    }
  })

  it('ok:false когда override указывает на исполняемый файл, не являющийся ffprobe', async () => {
    const { paths, cleanup } = tmpAppPaths()
    try {
      const media = join(paths.appRoot, 'clip.mp4')
      writeFileSync(media, '')
      const r = await probeMediaFile(paths, media, { ffprobe: execPath })
      expect(r.ok).toBe(false)
      if (!r.ok) {
        expect(r.error.length).toBeGreaterThan(0)
      }
    } finally {
      cleanup()
    }
  })
})
