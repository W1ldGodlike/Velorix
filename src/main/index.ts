import { app } from 'electron'

import { attachProcessErrorHandlers } from './logger-service'
import { runMainApplicationBootstrap } from './main-application-bootstrap'
import { registerFluxMediaPrivileges } from './media-protocol'
import { registerFluxHelpPrivileges } from './help-assets-protocol'

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
attachProcessErrorHandlers()
registerFluxMediaPrivileges()
registerFluxHelpPrivileges()

app.whenReady().then(() => {
  runMainApplicationBootstrap()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
