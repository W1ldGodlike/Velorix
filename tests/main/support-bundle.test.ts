import { existsSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'fs'
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

    createSupportBundleZip(out, {
      appVersion: '0.1.0',
      electronVersion: '1',
      chromeVersion: '2',
      nodeVersion: '3',
      platform: 'win32',
      arch: 'x64',
      userData: root,
      resources: root,
      logFile,
      logBackupFile: null,
      sessionLogFile: sessionLog,
      crashDumps: null
    })

    const zip = readFileSync(out)
    expect(zip.includes(Buffer.from('diagnostics.txt'))).toBe(true)
    expect(zip.includes(Buffer.from('logs/main.log'))).toBe(true)
    expect(zip.includes(Buffer.from('hello log'))).toBe(true)
    expect(zip.includes(Buffer.from('logs/session.log'))).toBe(true)
    expect(zip.includes(Buffer.from('session hello'))).toBe(true)
    expect(zip.includes(Buffer.from('sessionLogFile:'))).toBe(true)
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
