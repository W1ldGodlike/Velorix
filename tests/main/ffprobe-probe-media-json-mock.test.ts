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
        duration_ts: '90000',
        time_base: '1/90000',
        probe_size: '4096',
        filename: 'C:\\clips\\clip.mp4',
        tags: {
          major_brand: 'isom',
          compatible_brands: 'mp41iso2',
          creation_time: '2024-03-20T08:30:00.000000Z',
          encoder: 'Lavf61.0.100',
          publisher: 'Flux Media',
          encoded_by: 'HandBrake 1.8',
          software: 'Adobe Premiere Pro',
          title: 'clip',
          comment: 'offline',
          synopsis: 'Short plot summary',
          description: 'Demo reel',
          keywords: 'demo, offline',
          lyrics: 'Verse one…',
          artist: 'Flux Studio',
          performer: 'Guest Vocalist',
          sort_artist: 'Studio, Flux',
          album: 'Season One',
          album_artist: 'Various Artists',
          sort_album: 'Season One (2024)',
          sort_title: '01 clip',
          genre: 'Documentary',
          track: '3/12',
          disc: '1/2',
          copyright: '2024 Flux',
          isrc: 'USRC17607839',
          date: '2024-03-20',
          location: '+55.7558+037.6173/',
          purchase_date: '2024-01-15'
        }
      },
      streams: [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
          width: 320,
          height: 240,
          avg_frame_rate: '24/1',
          time_base: '1/90000',
          codec_time_base: '1/50',
          duration_ts: '90000'
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
        expect(r.containerPublisherTag).toBe('Flux Media')
        expect(r.containerEncodedByTag).toBe('HandBrake 1.8')
        expect(r.containerSoftwareTag).toBe('Adobe Premiere Pro')
        expect(r.containerTitleTag).toBe('clip')
        expect(r.containerCommentTag).toBe('offline')
        expect(r.containerSynopsisTag).toBe('Short plot summary')
        expect(r.containerDescriptionTag).toBe('Demo reel')
        expect(r.containerKeywordsTag).toBe('demo, offline')
        expect(r.containerLyricsTag).toBe('Verse one…')
        expect(r.containerArtistTag).toBe('Flux Studio')
        expect(r.containerPerformerTag).toBe('Guest Vocalist')
        expect(r.containerSortArtistTag).toBe('Studio, Flux')
        expect(r.containerAlbumTag).toBe('Season One')
        expect(r.containerAlbumArtistTag).toBe('Various Artists')
        expect(r.containerSortAlbumTag).toBe('Season One (2024)')
        expect(r.containerSortTitleTag).toBe('01 clip')
        expect(r.containerGenreTag).toBe('Documentary')
        expect(r.containerTrackTag).toBe('3/12')
        expect(r.containerDiscTag).toBe('1/2')
        expect(r.containerCopyrightTag).toBe('2024 Flux')
        expect(r.containerIsrcTag).toBe('USRC17607839')
        expect(r.containerDateTag).toBe('2024-03-20')
        expect(r.containerLocationTag).toBe('+55.7558+037.6173/')
        expect(r.containerPurchaseDateTag).toBe('2024-01-15')
        expect(r.containerCompatibleBrands).toBe('mp41iso2')
        expect(r.probeScore).toBe(100)
        expect(r.containerNbStreams).toBe(2)
        expect(r.containerNbPrograms).toBe(1)
        expect(r.containerFormatFlags).toBe('0x0')
        expect(r.containerSizeBytes).toBe(2048)
        expect(r.containerStartTimeSec).toBe(0.5)
        expect(r.containerStartTimeRealSec).toBe(0.75)
        expect(r.containerDurationTs).toBe(90000)
        expect(r.containerTimeBase).toBe('1/90000')
        expect(r.containerProbeSizeBytes).toBe(4096)
        expect(r.containerFilename).toBe('C:\\clips\\clip.mp4')
        expect(r.tracks).toHaveLength(1)
        expect(r.tracks[0]?.detail).toContain('H.264 / AVC')
        expect(r.tracks[0]?.detail).toContain('tb 1/90000')
        expect(r.tracks[0]?.detail).toContain('ctb 1/50')
        expect(r.tracks[0]?.detail).toContain('dur_ts 90000')
        expect(r.containerDurationTs).toBe(90000)
        expect(r.containerStartTimeSec).toBe(0.5)
        expect(r.containerStartTimeRealSec).toBe(0.75)
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
