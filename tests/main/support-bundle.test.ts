import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import { buildStoredZipBuffer, createSupportBundleZip } from '../../src/main/support-bundle'

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
      crashDumps: null
    })

    const zip = readFileSync(out)
    expect(zip.includes(Buffer.from('diagnostics.txt'))).toBe(true)
    expect(zip.includes(Buffer.from('logs/main.log'))).toBe(true)
    expect(zip.includes(Buffer.from('hello log'))).toBe(true)
  })
})
