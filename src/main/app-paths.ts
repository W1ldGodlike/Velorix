import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export interface AppPaths {
  appRoot: string
  resources: string
  userData: string
  bundledBin: string
  userBin: string
}

/**
 * Единая карта путей main-process.
 *
 * В Electron dev/prod пути отличаются: в разработке ресурсы лежат рядом с исходниками,
 * а в установленном приложении — рядом с `process.resourcesPath`. Держим это в одном
 * месте, чтобы сервисы движков, Help/Data и будущая упаковка не размножали свои правила.
 */
export function resolveAppPaths(): AppPaths {
  const appRoot = app.getAppPath()
  const resources = is.dev ? appRoot : process.resourcesPath
  const userData = app.getPath('userData')

  return {
    appRoot,
    resources,
    userData,
    bundledBin: join(resources, 'bin'),
    userBin: join(userData, 'bin')
  }
}
