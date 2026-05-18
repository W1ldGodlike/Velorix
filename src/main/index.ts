import { app } from 'electron'

import { configurePortableAppDataPaths } from './app-data-root'
import { attachProcessErrorHandlers } from './logger-service'
import { runMainApplicationBootstrap } from './main-application-bootstrap'
import { registerFluxMediaPrivileges } from './media-protocol'
import { registerFluxHelpPrivileges } from './help-assets-protocol'
import { isNativeMainQuitOnLastWindowClosed } from './platform'

/** Все runtime-данные — в `<installRoot>/app-data`, не в %AppData%. */
configurePortableAppDataPaths()

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
attachProcessErrorHandlers()
registerFluxMediaPrivileges()
registerFluxHelpPrivileges()

app.whenReady().then(() => {
  runMainApplicationBootstrap()
})

app.on('window-all-closed', () => {
  if (isNativeMainQuitOnLastWindowClosed()) {
    app.quit()
  }
})
