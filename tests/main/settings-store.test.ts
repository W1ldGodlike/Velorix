import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  loadSettings,
  saveSettings,
  type AppSettings
} from '../../src/main/services/settings/settings-store'

const tempRoots: string[] = []

function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'VELORIX-settings-'))
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
      theme: 'dark',
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
    expect(loaded.ffmpegSnapshotFormat).toBe('webp')
  })

  it('создаёт каталог при сохранении settings.json', () => {
    const root = makeTempRoot()
    const file = join(root, 'nested', 'settings.json')
    const settings: AppSettings = { theme: 'dark', ytdlpFragmentRetries: 4 }

    saveSettings(file, settings)

    expect(loadSettings(file)).toMatchObject(settings)
  })

  it('игнорирует legacy ui-панели в settings.json', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(
      file,
      JSON.stringify({
        theme: 'dark',
        mainWindowUiPanels: { ffmpegSettingsRailOpen: false },
        downloadsWindowUiPanels: { log: false }
      }),
      'utf-8'
    )
    const loaded = loadSettings(file)
    expect(loaded.theme).toBe('dark')
    expect(loaded).not.toHaveProperty('mainWindowUiPanels')
    expect(loaded).not.toHaveProperty('downloadsWindowUiPanels')
  })

  it('legacy theme: system схлопывается в dark', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(file, JSON.stringify({ theme: 'system' }), 'utf-8')
    expect(loadSettings(file).theme).toBe('dark')
  })

  it('невалидная theme откатывается к dark', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(file, JSON.stringify({ theme: 'auto' }), 'utf-8')
    expect(loadSettings(file).theme).toBe('dark')
  })

  it('загружает uiLocale: en', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(file, JSON.stringify({ theme: 'dark', uiLocale: 'en' }), 'utf-8')
    expect(loadSettings(file).uiLocale).toBe('en')
  })

  it('отбрасывает невалидный uiLocale', () => {
    const root = makeTempRoot()
    const file = join(root, 'settings.json')
    writeFileSync(file, JSON.stringify({ theme: 'dark', uiLocale: 'de' }), 'utf-8')
    expect(loadSettings(file).uiLocale).toBeUndefined()
  })
})
