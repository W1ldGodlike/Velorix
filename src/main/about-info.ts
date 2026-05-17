import { app } from 'electron'

import type { AppAboutInfo } from '../shared/about-contract'

export function getAppAboutInfo(): AppAboutInfo {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron ?? '',
    chromeVersion: process.versions.chrome ?? '',
    nodeVersion: process.versions.node ?? ''
  }
}
