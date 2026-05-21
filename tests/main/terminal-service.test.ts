import { readFileSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({
  app: {
    getAppPath: () => '/tmp/fluxalloy-test',
    getPath: () => '/tmp'
  }
}))

vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

const { execFileMock, resolveEnginePathMock } = vi.hoisted(() => ({
  execFileMock: vi.fn(),
  resolveEnginePathMock: vi.fn((): string | null => 'C:\\tools\\ffmpeg.exe')
}))
vi.mock('child_process', () => ({
  execFile: execFileMock
}))

vi.mock('../../src/main/services/engines/engine-service', () => ({
  resolveEngineExecutablePath: (): string | null => resolveEnginePathMock() as string | null
}))

import {
  appendTerminalCliSessionLog,
  runTerminalCommand,
  resolveTerminalCliSessionLogPath,
  resolveTerminalCurrentFileArgs
} from '../../src/main/services/terminal/terminal-service'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from '../../src/shared/terminal-contract'

describe('appendTerminalCliSessionLog', () => {
  it('создаёт logs/terminal-cli.log под userData', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-term-cli-'))
    try {
      appendTerminalCliSessionLog({ userData: dir, block: 'probe-run\n' })
      const p = resolveTerminalCliSessionLogPath(dir)
      expect(readFileSync(p, 'utf8')).toContain('probe-run')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('resolveTerminalCurrentFileArgs', () => {
  it('без плейсхолдера не меняет argv', () => {
    expect(
      resolveTerminalCurrentFileArgs({
        args: ['-hide_banner', '-i', 'x.mp4'],
        currentFilePath: null,
        grantPath: () => false
      })
    ).toEqual({ ok: true, args: ['-hide_banner', '-i', 'x.mp4'] })
  })

  it('подставляет абсолютный путь при успешном grant', () => {
    const r = resolveTerminalCurrentFileArgs({
      args: ['-hide_banner', '-i', TERMINAL_CURRENT_FILE_PLACEHOLDER],
      currentFilePath: 'C:\\Media\\clip.mkv',
      grantPath: (abs) => abs.includes('clip.mkv')
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.args[0]).toBe('-hide_banner')
      expect(r.args[2]).toMatch(/clip\.mkv$/)
      expect(r.args[2]).not.toContain(TERMINAL_CURRENT_FILE_PLACEHOLDER)
    }
  })

  it('ошибка без пути к превью', () => {
    const r = resolveTerminalCurrentFileArgs({
      args: [TERMINAL_CURRENT_FILE_PLACEHOLDER],
      currentFilePath: '  ',
      grantPath: () => true
    })
    expect(r.ok).toBe(false)
  })

  it('ошибка если путь не в grant-list', () => {
    const r = resolveTerminalCurrentFileArgs({
      args: [TERMINAL_CURRENT_FILE_PLACEHOLDER],
      currentFilePath: 'C:\\secret\\a.mp4',
      grantPath: () => false
    })
    expect(r.ok).toBe(false)
  })
})

const terminalPaths = {
  appRoot: 'C:\\app',
  resources: 'C:\\app',
  userData: 'C:\\app\\userData',
  appTemp: 'C:\\app\\userData\\temp',
  bundledBin: 'C:\\app\\bin',
  userBin: 'C:\\app\\userData\\bin'
}

describe('runTerminalCommand', () => {
  it('принимает tool-префикс в любом регистре', async () => {
    resolveEnginePathMock.mockReturnValue('C:\\tools\\ffmpeg.exe')
    execFileMock.mockImplementation((_path, _argv, _opts, cb) => cb(null, 'ok', ''))
    const result = await runTerminalCommand({
      paths: terminalPaths,
      line: 'FFMPEG -version',
      currentFilePath: null,
      locale: 'ru'
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tool).toBe('ffmpeg')
      expect(result.args).toEqual(['-version'])
      expect(result.code).toBe(0)
    }
    expect(execFileMock).toHaveBeenCalledTimes(1)
  })

  it('ffprobe: отдельный бинарник и argv', async () => {
    resolveEnginePathMock.mockReturnValue('C:\\tools\\ffprobe.exe')
    execFileMock.mockImplementation((_path, _argv, _opts, cb) => cb(null, '{}', ''))
    const result = await runTerminalCommand({
      paths: terminalPaths,
      line: 'ffprobe -hide_banner -show_format',
      currentFilePath: null,
      locale: 'ru'
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tool).toBe('ffprobe')
      expect(result.args).toEqual(['-hide_banner', '-show_format'])
    }
    expect(execFileMock.mock.calls[0]?.[0]).toBe('C:\\tools\\ffprobe.exe')
  })

  it('yt-dlp: tool id с дефисом', async () => {
    resolveEnginePathMock.mockReturnValue('C:\\tools\\yt-dlp.exe')
    execFileMock.mockImplementation((_path, _argv, _opts, cb) => cb(null, '', ''))
    const result = await runTerminalCommand({
      paths: terminalPaths,
      line: 'yt-dlp --version',
      currentFilePath: null,
      locale: 'en'
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tool).toBe('yt-dlp')
      expect(result.args).toEqual(['--version'])
    }
  })

  it('блокирует неизвестный tool', async () => {
    const result = await runTerminalCommand({
      paths: terminalPaths,
      line: 'curl https://example.com',
      currentFilePath: null,
      locale: 'ru'
    })
    expect(result.ok).toBe(false)
    expect(execFileMock).not.toHaveBeenCalled()
  })

  it('блокирует shell-метасимволы в argv', async () => {
    const result = await runTerminalCommand({
      paths: terminalPaths,
      line: 'ffmpeg -i a.mp4 | del',
      currentFilePath: null,
      locale: 'ru'
    })
    expect(result.ok).toBe(false)
    expect(execFileMock).not.toHaveBeenCalled()
  })

  it('ошибка если движок не найден в настройках', async () => {
    resolveEnginePathMock.mockImplementation(() => null)
    const result = await runTerminalCommand({
      paths: terminalPaths,
      line: 'ffmpeg -version',
      currentFilePath: null,
      locale: 'ru'
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0)
    }
    expect(execFileMock).not.toHaveBeenCalled()
  })
})
