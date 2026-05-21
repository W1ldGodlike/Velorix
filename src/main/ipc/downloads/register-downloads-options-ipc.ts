import { registerDownloadsOptionsIpcCliHandlers } from './register-downloads-options-ipc-cli'
import { registerDownloadsOptionsIpcCookiesHandlers } from './register-downloads-options-ipc-cookies'
import { registerDownloadsOptionsIpcOutputHandlers } from './register-downloads-options-ipc-output'

export function registerDownloadsOptionsIpcHandlers(): void {
  registerDownloadsOptionsIpcOutputHandlers()
  registerDownloadsOptionsIpcCliHandlers()
  registerDownloadsOptionsIpcCookiesHandlers()
}
