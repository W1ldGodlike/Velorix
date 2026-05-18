import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  buildStoredZipBuffer,
  createSupportBundleZip,
  pruneOldDiagnosticFiles
} from '../../src/main/support-bundle'

const tempRoots: string[] = []

function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-support-'))
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

describe('buildStoredZipBuffer', () => {
  it('создаёт ZIP с local header, central directory и end record', () => {
    const zip = buildStoredZipBuffer([{ name: 'diagnostics.txt', data: Buffer.from('ok') }])

    expect(zip.readUInt32LE(0)).toBe(0x04034b50)
    expect(zip.includes(Buffer.from('diagnostics.txt'))).toBe(true)
    expect(zip.includes(Buffer.from([0x50, 0x4b, 0x01, 0x02]))).toBe(true)
    expect(zip.readUInt32LE(zip.length - 22)).toBe(0x06054b50)
  })
})

describe('createSupportBundleZip', () => {
  it('добавляет diagnostics и доступные логи', () => {
    const root = makeTempRoot()
    const logFile = join(root, 'main.log')
    const out = join(root, 'out', 'support.zip')
    writeFileSync(logFile, 'hello log', 'utf-8')

    const sessionLog = join(root, 'session.log')
    writeFileSync(sessionLog, 'session hello', 'utf-8')

    const terminalCli = join(root, 'terminal-cli.log')
    writeFileSync(terminalCli, 'stderr block', 'utf-8')
    const previewCache = join(root, 'preview-cache')
    const ytdlpDownloads = join(root, 'downloads', 'ytdlp')
    mkdirSync(previewCache, { recursive: true })
    mkdirSync(ytdlpDownloads, { recursive: true })
    writeFileSync(join(previewCache, 'thumb.bin'), 'preview', 'utf-8')
    writeFileSync(join(ytdlpDownloads, 'video.mp4.part'), 'partial', 'utf-8')

    createSupportBundleZip(out, {
      appVersion: '0.1.0',
      buildInfoLines: ['buildId: 4f14f86', 'builtAtUtc: 2026-05-18 06:00:00 UTC'],
      electronVersion: '1',
      chromeVersion: '2',
      nodeVersion: '3',
      platform: 'win32',
      arch: 'x64',
      appLocale: 'en-US',
      systemLocale: 'en-US',
      processId: 4242,
      currentWorkingDirectory: root,
      execBasename: 'electron.exe',
      packaged: false,
      primaryDisplayLine: '1920×1080@1.00 work 1920×1040',
      userData: root,
      resources: root,
      logFile,
      logBackupFile: null,
      sessionLogFile: sessionLog,
      terminalCliLogFile: terminalCli,
      crashDumps: null,
      engineDiagnosticLines: [
        '  ffmpeg: ready | C:\\bin\\ffmpeg.exe | ffmpeg version 7.0',
        '  ffprobe: ready | C:\\bin\\ffprobe.exe | ffprobe version 7.0'
      ],
      releaseSmokeLines: [
        'command: npm run smoke:packaged-release (check:release after pack:dir)',
        'steps: verify:win-unpacked → smoke:packaged-app → smoke:packaged-engines (ffprobe, yt-dlp, ffmpeg)',
        'mac: npm run build:mac (electron-builder --mac; dmg; engines/bin вручную)',
        'linux: npm run build:linux (AppImage + deb; engines/bin вручную)',
        'layout: FluxAlloy.exe (missing)'
      ],
      ffprobeSmokeLines: [
        'command: npm run smoke:packaged-ffprobe (part of smoke:packaged-engines)',
        'check: isMinimalFfprobeProbeJson + isPackagedFfprobeProbeJsonParsableForSmoke (format + stream detail)',
        'candidate: C:\\bin\\ffprobe.exe (present)'
      ],
      uiLocaleIpcLines: [
        'invoke: fluxalloy:settings-set-ui-locale → persist settings.json uiLocale',
        'event: fluxalloy:ui-locale-changed → all BrowserWindow webContents'
      ],
      localeJsonCatalogLines: [
        'catalog: locales/ru/*.json + locales/en/*.json (flat string values)',
        'guard: npm run check:locales-json (ru/en key parity per shard)'
      ],
      rendererStateLines: ['approach: hooks-composition'],
      uiDpiLines: [
        'CSS HiDPI: @media 120/144/168/192dpi — main.css (editor, downloads, terminal, modals, knowledge, probe, history)'
      ],
      hwManualSmokeChecklistLines: [
        'section: win-nvenc — Windows — NVENC (NVIDIA)',
        '  step [nvenc-manual]: manual h264_nvenc'
      ],
      winPackagedSmokeChecklistLines: [
        'doc: docs/RELEASE.md §4',
        '  step [launch]: Run dist/win-unpacked/FluxAlloy.exe'
      ]
    })

    const zip = readFileSync(out)
    expect(zip.includes(Buffer.from('diagnostics.txt'))).toBe(true)
    expect(zip.includes(Buffer.from('buildId: 4f14f86'))).toBe(true)
    expect(zip.includes(Buffer.from('builtAtUtc: 2026-05-18 06:00:00 UTC'))).toBe(true)
    expect(zip.includes(Buffer.from('logs/main.log'))).toBe(true)
    expect(zip.includes(Buffer.from('hello log'))).toBe(true)
    expect(zip.includes(Buffer.from('logs/session.log'))).toBe(true)
    expect(zip.includes(Buffer.from('session hello'))).toBe(true)
    expect(zip.includes(Buffer.from('logs/terminal-cli.log'))).toBe(true)
    expect(zip.includes(Buffer.from('stderr block'))).toBe(true)
    expect(zip.includes(Buffer.from('sessionLogFile:'))).toBe(true)
    expect(zip.includes(Buffer.from('terminalCliLogFile:'))).toBe(true)
    expect(zip.includes(Buffer.from('primaryDisplay: 1920×1080@1.00 work 1920×1040'))).toBe(true)
    expect(zip.includes(Buffer.from('packaged: no'))).toBe(true)
    expect(zip.includes(Buffer.from('maintenanceTargets:'))).toBe(true)
    expect(zip.includes(Buffer.from('previewCache: 1 files'))).toBe(true)
    expect(zip.includes(Buffer.from('ytdlpPartials: 1 files'))).toBe(true)
    expect(zip.includes(Buffer.from('engines:'))).toBe(true)
    expect(zip.includes(Buffer.from('ffmpeg: ready'))).toBe(true)
    expect(zip.includes(Buffer.from('ffprobe: ready'))).toBe(true)
    expect(zip.includes(Buffer.from('releaseSmoke:'))).toBe(true)
    expect(zip.includes(Buffer.from('smoke:packaged-release'))).toBe(true)
    expect(zip.includes(Buffer.from('verify:win-unpacked'))).toBe(true)
    expect(zip.includes(Buffer.from('ffprobeSmoke:'))).toBe(true)
    expect(zip.includes(Buffer.from('smoke:packaged-ffprobe'))).toBe(true)
    expect(zip.includes(Buffer.from('ParsableForSmoke'))).toBe(true)
    expect(zip.includes(Buffer.from('uiLocale:'))).toBe(true)
    expect(zip.includes(Buffer.from('ui-locale-changed'))).toBe(true)
    expect(zip.includes(Buffer.from('localeJson:'))).toBe(true)
    expect(zip.includes(Buffer.from('check:locales-json'))).toBe(true)
    expect(zip.includes(Buffer.from('uiDpi:'))).toBe(true)
    expect(zip.includes(Buffer.from('build:linux'))).toBe(true)
    expect(zip.includes(Buffer.from('hwManualSmoke:'))).toBe(true)
    expect(zip.includes(Buffer.from('winPackagedSmoke:'))).toBe(true)
    expect(zip.includes(Buffer.from('win-nvenc'))).toBe(true)
  })
})

describe('pruneOldDiagnosticFiles', () => {
  it('удаляет старые matching файлы и оставляет свежие/неподходящие', () => {
    const root = makeTempRoot()
    const oldDump = join(root, 'old.dmp')
    const freshDump = join(root, 'fresh.dmp')
    const oldOther = join(root, 'old.bin')
    writeFileSync(oldDump, 'old')
    writeFileSync(freshDump, 'fresh')
    writeFileSync(oldOther, 'other')

    const oldDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
    utimesSync(oldDump, oldDate, oldDate)
    utimesSync(oldOther, oldDate, oldDate)

    expect(
      pruneOldDiagnosticFiles({
        directory: root,
        maxAgeMs: 30 * 24 * 60 * 60 * 1000,
        keepNewest: 0,
        fileNamePattern: /\.dmp$/i
      })
    ).toBe(1)
    expect(existsSync(oldDump)).toBe(false)
    expect(existsSync(freshDump)).toBe(true)
    expect(existsSync(oldOther)).toBe(true)
  })

  it('сохраняет newest файлы даже если они старые', () => {
    const root = makeTempRoot()
    const oldA = join(root, 'a.dmp')
    const oldB = join(root, 'b.dmp')
    writeFileSync(oldA, 'a')
    writeFileSync(oldB, 'b')
    const base = Date.now() - 40 * 24 * 60 * 60 * 1000
    utimesSync(oldA, new Date(base), new Date(base))
    utimesSync(oldB, new Date(base + 1000), new Date(base + 1000))

    expect(
      pruneOldDiagnosticFiles({
        directory: root,
        maxAgeMs: 30 * 24 * 60 * 60 * 1000,
        keepNewest: 1,
        fileNamePattern: /\.dmp$/i
      })
    ).toBe(1)
    expect(existsSync(oldA)).toBe(false)
    expect(existsSync(oldB)).toBe(true)
  })
})
