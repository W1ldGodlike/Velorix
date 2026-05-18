import type { AppUiLocale } from './app-ui-locale'

export type { MainApplicationStrings } from './main-application-locale-types'

export { getMainApplicationStrings } from './main-runtime-locale'

import { getMainApplicationStrings } from './main-runtime-locale'

export function formatTerminalEngineMissingInSettings(
  locale: AppUiLocale,
  tool: string
): string {
  return getMainApplicationStrings(locale).terminalEngineMissingInSettings.replace(
    /\{tool\}/g,
    tool
  )
}

export function formatPickEngineExecutableTitle(
  locale: AppUiLocale,
  engineId: string
): string {
  return locale === 'en'
    ? `Select executable: ${engineId}`
    : `Выберите исполняемый файл: ${engineId}`
}

export function formatMainProcessErrorClipboardHeader(
  locale: AppUiLocale,
  kind: 'uncaughtException' | 'unhandledRejection',
  appVersion: string,
  platform: string,
  arch: string
): { typeLine: string; timeLine: string; versionLine: string; platformLine: string } {
  const s = getMainApplicationStrings(locale)
  return {
    typeLine: `${s.processErrorMetaType}: ${kind}`,
    timeLine: `${s.processErrorMetaTime}: ${new Date().toISOString()}`,
    versionLine: `${s.processErrorMetaVersion}: ${appVersion}`,
    platformLine: `${s.processErrorMetaPlatform}: ${platform}/${arch}`
  }
}
