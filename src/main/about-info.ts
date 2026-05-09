import { app } from 'electron'

/** Данные для диалога «О программе» §4.5 (без произвольного FS/main-доступа из renderer). */
export interface AppAboutInfo {
  appName: string
  appVersion: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
}

export function getAppAboutInfo(): AppAboutInfo {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron ?? '',
    chromeVersion: process.versions.chrome ?? '',
    nodeVersion: process.versions.node ?? ''
  }
}
