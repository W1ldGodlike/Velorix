import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { execFileMock } = vi.hoisted(() => ({
  execFileMock: vi.fn()
}))

vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('child_process')>()
  return { ...actual, execFile: execFileMock }
})

import type { AppPaths } from '../../src/main/app-paths'
import { probeMediaFile } from '../../src/main/ffprobe-service'

function tmpAppPaths(): { paths: AppPaths; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), 'flux-probe-json-'))
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

describe('probeMediaFile invalid JSON (mocked execFile)', () => {
  beforeEach(() => {
    execFileMock.mockReset()
  })

  it('ok:false когда stdout не парсится как JSON', async () => {
    execFileMock.mockImplementation((_cmd, _args, _opts, cb) => {
      queueMicrotask(() => {
        ;(cb as (err: Error | null, stdout: string, stderr: string) => void)(null, '{broken', '')
      })
    })
    const { paths, cleanup } = tmpAppPaths()
    const probeName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
    writeFileSync(join(paths.bundledBin, probeName), '')
    try {
      const media = join(paths.appRoot, 'clip.mp4')
      writeFileSync(media, '')
      const r = await probeMediaFile(paths, media)
      expect(r.ok).toBe(false)
      if (!r.ok) {
        expect(r.error).toBe('Некорректный JSON ffprobe')
      }
      expect(execFileMock).toHaveBeenCalled()
    } finally {
      cleanup()
    }
  })

  it('ok:false при пустом stdout (JSON.parse падает)', async () => {
    execFileMock.mockImplementation((_cmd, _args, _opts, cb) => {
      queueMicrotask(() => {
        ;(cb as (err: Error | null, stdout: string, stderr: string) => void)(null, '', '')
      })
    })
    const { paths, cleanup } = tmpAppPaths()
    const probeName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
    writeFileSync(join(paths.bundledBin, probeName), '')
    try {
      const media = join(paths.appRoot, 'empty.mp4')
      writeFileSync(media, '')
      const r = await probeMediaFile(paths, media)
      expect(r.ok).toBe(false)
      if (!r.ok) {
        expect(r.error).toBe('Некорректный JSON ffprobe')
      }
    } finally {
      cleanup()
    }
  })

  it('ok:false при error из execFile с приоритетом stderr', async () => {
    execFileMock.mockImplementation((_cmd, _args, _opts, cb) => {
      queueMicrotask(() => {
        ;(cb as (err: Error | null, stdout: string, stderr: string) => void)(
          new Error('spawn failed'),
          '',
          'Invalid data found when processing input'
        )
      })
    })
    const { paths, cleanup } = tmpAppPaths()
    const probeName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
    writeFileSync(join(paths.bundledBin, probeName), '')
    try {
      const media = join(paths.appRoot, 'bad.mp4')
      writeFileSync(media, '')
      const r = await probeMediaFile(paths, media)
      expect(r.ok).toBe(false)
      if (!r.ok) {
        expect(r.error).toBe('Invalid data found when processing input')
      }
    } finally {
      cleanup()
    }
  })
})
