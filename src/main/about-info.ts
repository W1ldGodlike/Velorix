import { app } from 'electron'

import { readAppBuildInfo } from '../shared/app-build-info'
import type { AppAboutInfo } from '../shared/about-contract'

export function getAppAboutInfo(): AppAboutInfo {
  const build = readAppBuildInfo()
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
    buildId: build.buildId,
    builtAtUtc: build.builtAtUtc,
    electronVersion: process.versions.electron ?? '',
    chromeVersion: process.versions.chrome ?? '',
    nodeVersion: process.versions.node ?? ''
  }
}
