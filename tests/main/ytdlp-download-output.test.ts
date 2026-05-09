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
})
