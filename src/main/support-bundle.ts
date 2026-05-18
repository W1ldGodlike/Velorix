import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

import { resolveAppTempDirectory } from './app-data-root-paths'
import { getDiagnosticsMaintenanceSnapshot } from './diagnostics-maintenance'
import {
  collectDirectoryUsage,
  formatDirectoryUsageLine,
  pushCrashDumps,
  pushFile
} from './support-bundle-collect'
import type { SupportBundleRuntimeInfo } from './support-bundle-types'
import { buildStoredZipBuffer } from './support-bundle-zip'

export type { SupportBundleRuntimeInfo } from './support-bundle-types'
export { pruneOldDiagnosticFiles } from './support-bundle-collect'
export { buildStoredZipBuffer } from './support-bundle-zip'

function diagnosticsText(info: SupportBundleRuntimeInfo): string {
  const logsUsage = collectDirectoryUsage(info.logFile ? dirname(info.logFile) : null)
  const crashUsage = collectDirectoryUsage(info.crashDumps)
  const previewCacheUsage = collectDirectoryUsage(join(info.userData, 'preview-cache'))
  const ytdlpDownloadsUsage = collectDirectoryUsage(join(info.userData, 'downloads', 'ytdlp'))
  const maintenance = getDiagnosticsMaintenanceSnapshot({
    appRoot: info.resources,
    resources: info.resources,
    userData: info.userData,
    appTemp: resolveAppTempDirectory(info.userData),
    bundledBin: join(info.resources, 'bin'),
    userBin: join(info.userData, 'bin')
  })
  return [
    `FluxAlloy ${info.appVersion}`,
    ...(info.buildInfoLines.length > 0 ? [...info.buildInfoLines] : []),
    `Electron ${info.electronVersion}`,
    `Chrome ${info.chromeVersion}`,
    `Node ${info.nodeVersion}`,
    `${info.platform}/${info.arch}`,
    `appLocale: ${info.appLocale}`,
    `systemLocale: ${info.systemLocale}`,
    `pid: ${info.processId}`,
    `cwd: ${info.currentWorkingDirectory}`,
    `exec: ${info.execBasename}`,
    `packaged: ${info.packaged ? 'yes' : 'no'}`,
    `primaryDisplay: ${info.primaryDisplayLine}`,
    '',
    `userData: ${info.userData}`,
    `resources: ${info.resources}`,
    `logFile: ${info.logFile ?? '-'}`,
    `logBackupFile: ${info.logBackupFile ?? '-'}`,
    `sessionLogFile: ${info.sessionLogFile ?? '-'}`,
    `terminalCliLogFile: ${info.terminalCliLogFile ?? '-'}`,
    `crashDumps: ${info.crashDumps ?? '-'}`,
    '',
    'directoryUsage:',
    `  ${formatDirectoryUsageLine('logs', logsUsage)}`,
    `  ${formatDirectoryUsageLine('crashDumps', crashUsage)}`,
    `  ${formatDirectoryUsageLine('preview-cache', previewCacheUsage)}`,
    `  ${formatDirectoryUsageLine('downloads/ytdlp', ytdlpDownloadsUsage)}`,
    '',
    'maintenanceTargets:',
    `  total: ${maintenance.totalBytes} bytes`,
    `  cleanable: ${maintenance.cleanableBytes} bytes`,
    ...maintenance.targets.map(
      (target) =>
        `  ${target.id}: ${target.files} files, ${target.directories} dirs, ${target.bytes} bytes`
    ),
    ...(info.engineDiagnosticLines.length > 0
      ? ['', 'engines:', ...info.engineDiagnosticLines]
      : []),
    ...(info.releaseSmokeLines.length > 0
      ? ['', 'releaseSmoke:', ...info.releaseSmokeLines]
      : []),
    ...(info.ffprobeSmokeLines.length > 0
      ? ['', 'ffprobeSmoke:', ...info.ffprobeSmokeLines]
      : []),
    ...(info.uiLocaleIpcLines.length > 0
      ? ['', 'uiLocale:', ...info.uiLocaleIpcLines]
      : []),
    ...(info.localeJsonCatalogLines.length > 0
      ? ['', 'localeJson:', ...info.localeJsonCatalogLines]
      : []),
    ...(info.rendererStateLines.length > 0
      ? ['', 'rendererState:', ...info.rendererStateLines]
      : []),
    ...(info.uiDpiLines.length > 0 ? ['', 'uiDpi:', ...info.uiDpiLines] : []),
    ...(info.hwManualSmokeChecklistLines.length > 0
      ? ['', 'hwManualSmoke:', ...info.hwManualSmokeChecklistLines]
      : [])
  ].join('\n')
}

export function createSupportBundleZip(targetFile: string, info: SupportBundleRuntimeInfo): void {
  mkdirSync(dirname(targetFile), { recursive: true })
  const entries = [{ name: 'diagnostics.txt', data: Buffer.from(diagnosticsText(info), 'utf8') }]
  pushFile(entries, 'logs/main.log', info.logFile)
  pushFile(entries, 'logs/main.log.1', info.logBackupFile)
  pushFile(entries, 'logs/session.log', info.sessionLogFile)
  pushFile(entries, 'logs/terminal-cli.log', info.terminalCliLogFile)
  pushCrashDumps(entries, info.crashDumps)
  writeFileSync(targetFile, buildStoredZipBuffer(entries))
}
