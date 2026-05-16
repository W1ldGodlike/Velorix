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

  it('парсит format.tags и probe_score', async () => {
    const payload = {
      format: {
        duration: '1.0',
        format_name: 'mov,mp4,m4a,3gp,3g2,mj2',
        probe_score: 100,
        nb_streams: 2,
        nb_programs: 1,
        flags: 0,
        size: '2048',
        start_time: '0.500000',
        start_time_real: '0.750000',
        filename: 'C:\\clips\\clip.mp4',
        tags: {
          major_brand: 'isom',
          compatible_brands: 'mp41iso2',
          creation_time: '2024-03-20T08:30:00.000000Z',
          encoder: 'Lavf61.0.100',
          title: 'clip'
        }
      },
      streams: [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 320,
          height: 240,
          avg_frame_rate: '24/1'
        }
      ]
    }
    execFileMock.mockImplementation((_cmd, _args, _opts, cb) => {
      queueMicrotask(() => {
        ;(cb as (err: Error | null, stdout: string, stderr: string) => void)(
          null,
          JSON.stringify(payload),
          ''
        )
      })
    })
    const { paths, cleanup } = tmpAppPaths()
    const probeName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
    writeFileSync(join(paths.bundledBin, probeName), '')
    try {
      const media = join(paths.appRoot, 'clip.mp4')
      writeFileSync(media, '')
      const r = await probeMediaFile(paths, media)
      expect(r.ok).toBe(true)
      if (r.ok) {
        expect(r.containerMajorBrand).toBe('isom')
        expect(r.containerCreationTime).toContain('2024-03-20')
        expect(r.containerEncoder).toBe('Lavf61.0.100')
        expect(r.containerTitleTag).toBe('clip')
        expect(r.containerCompatibleBrands).toBe('mp41iso2')
        expect(r.probeScore).toBe(100)
        expect(r.containerNbStreams).toBe(2)
        expect(r.containerNbPrograms).toBe(1)
        expect(r.containerFormatFlags).toBe('0x0')
        expect(r.containerSizeBytes).toBe(2048)
        expect(r.containerStartTimeSec).toBe(0.5)
        expect(r.containerStartTimeRealSec).toBe(0.75)
        expect(r.containerFilename).toBe('C:\\clips\\clip.mp4')
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
