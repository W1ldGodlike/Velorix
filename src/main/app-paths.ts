import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export interface AppPaths {
  /** Корень приложения как его видит Electron: в dev это проект, в prod — app.asar/пакет. */
  appRoot: string
  /** Каталог, из которого можно читать bundled ресурсы (`Data`, `Help`, будущий `bin`). */
  resources: string
  /** Пользовательский каталог Electron для настроек, кэшей и скачанных runtime-ресурсов. */
  userData: string
  /** `bin` внутри поставки приложения: сюда попадут проверенные ffmpeg/ffprobe/yt-dlp. */
  bundledBin: string
  /** `bin` внутри userData: резерв для автообновления движков без пересборки приложения. */
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
    // В релизной сборке `bin` попадает из `electron-builder.yml extraResources`.
    // Это основной источник движков; `userBin` ниже нужен для обновлений/fallback без переустановки.
    bundledBin: join(resources, 'bin'),
    userBin: join(userData, 'bin')
  }
}
