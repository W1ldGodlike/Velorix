import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({
  shell: {
    openExternal: vi.fn()
  }
}))

import {
  isAllowedExternalUrl,
  openAllowedExternalUrl,
  shouldAllowElectronWindowNavigation
} from '../../src/main/external-url'
import { shell } from 'electron'

describe('external-url guard', () => {
  it('разрешает только http/https ссылки', () => {
    expect(isAllowedExternalUrl('https://example.com/docs')).toBe(true)
    expect(isAllowedExternalUrl('http://localhost:3000')).toBe(true)
    expect(isAllowedExternalUrl('file:///C:/secret.txt')).toBe(false)
    expect(isAllowedExternalUrl('javascript:alert(1)')).toBe(false)
    expect(isAllowedExternalUrl('not a url')).toBe(false)
  })

  it('не вызывает shell.openExternal для запрещённых схем', () => {
    openAllowedExternalUrl('file:///C:/secret.txt')
    expect(shell.openExternal).not.toHaveBeenCalled()

    openAllowedExternalUrl('https://example.com/')
    expect(shell.openExternal).toHaveBeenCalledWith('https://example.com/')
  })

  it('разрешает только внутреннюю навигацию текущего Electron-окна', () => {
    expect(
      shouldAllowElectronWindowNavigation(
        'http://localhost:5173/#inspector',
        'http://localhost:5173/'
      )
    ).toBe(true)
    expect(
      shouldAllowElectronWindowNavigation(
        'file:///C:/app/renderer/index.html#inspector',
        'file:///C:/app/renderer/index.html'
      )
    ).toBe(true)
    expect(
      shouldAllowElectronWindowNavigation(
        'file:///C:/Users/user/secret.txt',
        'file:///C:/app/renderer/index.html'
      )
    ).toBe(false)
    expect(
      shouldAllowElectronWindowNavigation(
        'https://example.com/',
        'file:///C:/app/renderer/index.html'
      )
    ).toBe(false)
  })
})
