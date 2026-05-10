import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import { loadSettings, saveSettings, type AppSettings } from '../../src/main/settings-store'

const tempRoots: string[] = []

function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-settings-'))
  tempRoots.push(dir)
  return dir
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop()
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
})

describe('settings-store yt-dlp fields', () => {
  it('загружает валидные persisted настройки yt-dlp', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(
      file,
      JSON.stringify({
        theme: 'light',
        ytdlpRateLimit: '500k',
        ytdlpRetries: 3,
        ytdlpFragmentRetries: 7,
        ytdlpDownloadPlaylist: true,
        ytdlpAudioOnly: true,
        ytdlpQueueRetryProfile: 'normal',
        ytdlpOpenInHandlerOnComplete: true,
        ffmpegExportContainer: 'mkv',
        ffmpegExportCrf: 20,
        ffmpegExportVideoBitrate: '8000K',
        ffmpegExportAudioMode: 'none',
        ffmpegExportAudioBitrate: '256K',
        ffmpegExportFps: 30,
        ffmpegExportScalePreset: '720p',
        ffmpegExportVideoTransform: 'hflip',
        ffmpegExportCropPreset: 'center-16-9',
        ffmpegExportDirectory: root,
        ffmpegSnapshotDirectory: root,
        ffmpegSnapshotFormat: 'jpg'
      }),
      'utf-8'
    )

    expect(loadSettings(file)).toMatchObject({
      theme: 'light',
      ytdlpRateLimit: '500K',
      ytdlpRetries: 3,
      ytdlpFragmentRetries: 7,
      ytdlpDownloadPlaylist: true,
      ytdlpAudioOnly: true,
      ytdlpQueueRetryProfile: 'normal',
      ytdlpOpenInHandlerOnComplete: true,
      ffmpegExportContainer: 'mkv',
      ffmpegExportCrf: 20,
      ffmpegExportVideoBitrate: '8000k',
      ffmpegExportAudioMode: 'none',
      ffmpegExportAudioBitrate: '256k',
      ffmpegExportFps: 30,
      ffmpegExportScalePreset: '720p',
      ffmpegExportVideoTransform: 'hflip',
      ffmpegExportCropPreset: 'center-16-9',
      ffmpegExportDirectory: root,
      ffmpegSnapshotDirectory: root,
      ffmpegSnapshotFormat: 'jpg'
    })
  })

  it('отбрасывает невалидные числовые поля yt-dlp', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(
      file,
      JSON.stringify({
        theme: 'dark',
        ytdlpRetries: 100,
        ytdlpFragmentRetries: -1,
        ytdlpRateLimit: 'fast',
        ffmpegExportContainer: 'avi',
        ffmpegExportCrf: 52,
        ffmpegExportVideoBitrate: '60M',
        ffmpegExportAudioMode: 'bad',
        ffmpegExportAudioBitrate: '9999k',
        ffmpegExportFps: 29.97,
        ffmpegExportScalePreset: '4k',
        ffmpegExportVideoTransform: 'spin',
        ffmpegExportCropPreset: 'freeform',
        ffmpegExportDirectory: 'relative',
        ffmpegSnapshotDirectory: 'relative',
        ffmpegSnapshotFormat: 'webp'
      }),
      'utf-8'
    )

    const loaded = loadSettings(file)
    expect(loaded.ytdlpRetries).toBeUndefined()
    expect(loaded.ytdlpFragmentRetries).toBeUndefined()
    expect(loaded.ytdlpRateLimit).toBeUndefined()
    expect(loaded.ffmpegExportContainer).toBeUndefined()
    expect(loaded.ffmpegExportCrf).toBeUndefined()
    expect(loaded.ffmpegExportVideoBitrate).toBeUndefined()
    expect(loaded.ffmpegExportAudioMode).toBeUndefined()
    expect(loaded.ffmpegExportAudioBitrate).toBeUndefined()
    expect(loaded.ffmpegExportFps).toBeUndefined()
    expect(loaded.ffmpegExportScalePreset).toBeUndefined()
    expect(loaded.ffmpegExportVideoTransform).toBeUndefined()
    expect(loaded.ffmpegExportCropPreset).toBeUndefined()
    expect(loaded.ffmpegExportDirectory).toBeUndefined()
    expect(loaded.ffmpegSnapshotDirectory).toBeUndefined()
    expect(loaded.ffmpegSnapshotFormat).toBeUndefined()
  })

  it('создаёт каталог при сохранении settings.json', () => {
    const root = makeTempRoot()
    const file = join(root, 'nested', 'settings.json')
    const settings: AppSettings = { theme: 'dark', ytdlpFragmentRetries: 4 }

    saveSettings(file, settings)

    expect(loadSettings(file)).toMatchObject(settings)
  })

  it('загружает §4.1 ui-панели: только whitelist boolean, лишнее отбрасывается', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(
      file,
      JSON.stringify({
        theme: 'dark',
        mainWindowUiPanels: {
          quickYtdlp: true,
          ffmpegVideo: false,
          probeTracks: true,
          probeBad: false,
          unknownKey: true,
          bad: 'x'
        },
        downloadsWindowUiPanels: {
          log: false,
          format: true,
          extra: false
        }
      }),
      'utf-8'
    )

    expect(loadSettings(file)).toMatchObject({
      theme: 'dark',
      mainWindowUiPanels: { quickYtdlp: true, ffmpegVideo: false, probeTracks: true },
      downloadsWindowUiPanels: { log: false, format: true }
    })
  })
})
