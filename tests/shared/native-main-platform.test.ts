import { describe, expect, it } from 'vitest'

import {
  isNativeMainEngineAutoDownloadSupported,
  isNativeMainQuitOnLastWindowClosed,
  isNativeMainYtdlpOsPauseSupported,
  nativeMainEngineBinaryName,
  nativeMainEngineOpenDialogFilters,
  nativeMainPlatformFamily
} from '../../src/shared/native-main-platform'

describe('native-main-platform §2.1', () => {
  it('nativeMainPlatformFamily maps Node platforms', () => {
    expect(nativeMainPlatformFamily('win32')).toBe('windows')
    expect(nativeMainPlatformFamily('darwin')).toBe('macos')
    expect(nativeMainPlatformFamily('linux')).toBe('linux')
    expect(nativeMainPlatformFamily('freebsd')).toBe('other')
  })

  it('nativeMainEngineBinaryName adds .exe on Windows', () => {
    expect(nativeMainEngineBinaryName('ffmpeg', 'win32')).toBe('ffmpeg.exe')
    expect(nativeMainEngineBinaryName('ffmpeg', 'linux')).toBe('ffmpeg')
  })

  it('policy flags per OS', () => {
    expect(isNativeMainEngineAutoDownloadSupported('win32')).toBe(true)
    expect(isNativeMainEngineAutoDownloadSupported('linux')).toBe(false)
    expect(isNativeMainYtdlpOsPauseSupported('win32')).toBe(false)
    expect(isNativeMainYtdlpOsPauseSupported('linux')).toBe(true)
    expect(isNativeMainQuitOnLastWindowClosed('darwin')).toBe(false)
    expect(isNativeMainQuitOnLastWindowClosed('win32')).toBe(true)
  })

  it('nativeMainEngineOpenDialogFilters', () => {
    const labels = { executables: 'Exe', all: 'All' }
    expect(nativeMainEngineOpenDialogFilters(labels, 'win32')).toHaveLength(2)
    expect(nativeMainEngineOpenDialogFilters(labels, 'linux')).toHaveLength(1)
  })
})
