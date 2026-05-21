import type { BrowserWindow } from 'electron'

import type { AppUiLocale } from '../../shared/app-ui-locale'

let miniPlayerWindow: BrowserWindow | null = null
let snapshotTimer: ReturnType<typeof setInterval> | null = null
let lastResolvedLocale: AppUiLocale = 'ru'

export function getMiniPlayerWindow(): BrowserWindow | null {
  return miniPlayerWindow
}

export function setMiniPlayerWindow(win: BrowserWindow | null): void {
  miniPlayerWindow = win
}

export function isMiniPlayerWindow(win: BrowserWindow | undefined | null): boolean {
  if (!win || win.isDestroyed()) {
    return false
  }
  return (
    miniPlayerWindow !== null && !miniPlayerWindow.isDestroyed() && win.id === miniPlayerWindow.id
  )
}

export function setLastMiniPlayerResolvedUiLocale(locale: AppUiLocale): void {
  lastResolvedLocale = locale
}

export function getLastMiniPlayerResolvedUiLocale(): AppUiLocale {
  return lastResolvedLocale
}

export function setMiniPlayerSnapshotTimer(timer: ReturnType<typeof setInterval> | null): void {
  snapshotTimer = timer
}

export function getMiniPlayerSnapshotTimer(): ReturnType<typeof setInterval> | null {
  return snapshotTimer
}
