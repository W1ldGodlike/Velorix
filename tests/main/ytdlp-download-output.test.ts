import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { afterEach, describe, expect, it } from 'vitest'

import {
  resolveAllowedYtdlpDownloadOutputFile,
  syncYtdlpDownloadDirectoryFromSettings
} from '../../src/main/ytdlp-download-output'

afterEach(() => {
  syncYtdlpDownloadDirectoryFromSettings(undefined)
})

describe('resolveAllowedYtdlpDownloadOutputFile', () => {
  it('принимает файл внутри каталога по умолчанию userData/downloads/ytdlp', () => {
    const root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-out-'))
    const outDir = join(root, 'downloads', 'ytdlp')
    mkdirSync(outDir, { recursive: true })
    const file = join(outDir, 'x.mp4')
    writeFileSync(file, 'x')
    expect(resolveAllowedYtdlpDownloadOutputFile(file, root)).toBe(file)
    rmSync(root, { recursive: true, force: true })
  })

  it('отклоняет пути вне каталога загрузок yt-dlp', () => {
    const root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-out2-'))
    mkdirSync(join(root, 'downloads', 'ytdlp'), { recursive: true })
    const outside = join(root, 'outside.txt')
    writeFileSync(outside, 'x')
    expect(resolveAllowedYtdlpDownloadOutputFile(outside, root)).toBeNull()
    rmSync(root, { recursive: true, force: true })
  })

  it('учитывает override каталога загрузки из настроек', () => {
    const root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-custom-'))
    const customDir = join(root, 'my-downloads')
    mkdirSync(customDir, { recursive: true })
    syncYtdlpDownloadDirectoryFromSettings(customDir)
    const file = join(customDir, 'clip.mkv')
    writeFileSync(file, 'x')
    expect(resolveAllowedYtdlpDownloadOutputFile(file, root)).toBe(file)
    rmSync(root, { recursive: true, force: true })
  })

  it('находит финальный файл по media id, если yt-dlp сообщил удалённый промежуточный путь', () => {
    const root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-merge-'))
    const outDir = join(root, 'downloads', 'ytdlp')
    mkdirSync(outDir, { recursive: true })
    const finalFile = join(outDir, 'Rimworld. нормальное имя [dCoZhhCIhXo].mkv')
    writeFileSync(finalFile, 'x')
    const staleMojibakePath = join(outDir, 'Rimworld. я┐╜я┐╜ [dCoZhhCIhXo].f299.mp4')

    expect(resolveAllowedYtdlpDownloadOutputFile(staleMojibakePath, root)).toBe(finalFile)
    rmSync(root, { recursive: true, force: true })
  })

  it('не ищет fallback по media id для пути вне каталога загрузок', () => {
    const root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-merge-outside-'))
    const outDir = join(root, 'downloads', 'ytdlp')
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'clip [dCoZhhCIhXo].mkv'), 'x')
    const outside = join(root, 'outside [dCoZhhCIhXo].mp4')

    expect(resolveAllowedYtdlpDownloadOutputFile(outside, root)).toBeNull()
    rmSync(root, { recursive: true, force: true })
  })
})
