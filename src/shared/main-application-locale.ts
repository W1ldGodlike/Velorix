import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

export type { MainApplicationStrings } from './main-application-locale-types'

import type { MainApplicationStrings } from './main-application-locale-types'
import { mainApplicationStringsEn } from './main-application-locale-strings-en'
import { mainApplicationStringsRu } from './main-application-locale-strings-ru'

export function getMainApplicationStrings(locale: DownloadsWindowUiLocale): MainApplicationStrings {
  return locale === 'en' ? mainApplicationStringsEn : mainApplicationStringsRu
}

export function formatTerminalEngineMissingInSettings(
  locale: DownloadsWindowUiLocale,
  tool: string
): string {
  return getMainApplicationStrings(locale).terminalEngineMissingInSettings.replace(
    /\{tool\}/g,
    tool
  )
}

export function formatPickEngineExecutableTitle(
  locale: DownloadsWindowUiLocale,
  engineId: string
): string {
  return locale === 'en'
    ? `Select executable: ${engineId}`
    : `Выберите исполняемый файл: ${engineId}`
}

export function formatMainProcessErrorClipboardHeader(
  locale: DownloadsWindowUiLocale,
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

